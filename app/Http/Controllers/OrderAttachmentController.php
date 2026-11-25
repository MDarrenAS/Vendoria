<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderAttachment;
use App\Models\Service;
use App\Notifications\OrderAttachmentAdded;
use App\Notifications\OrderAttachmentRequested;
use App\Support\OrderAttachments;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZipArchive;

class OrderAttachmentController extends Controller
{
    public function storeDraft(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'slot_key' => ['required', 'string', 'max:80'],
            'file' => ['required', 'file'],
        ]);

        $service = Service::query()
            ->with('category:id,slug')
            ->where('is_active', true)
            ->findOrFail($validated['service_id']);

        $slot = OrderAttachments::findSlot($service->category?->slug, $validated['slot_key']);

        if ($slot === null) {
            throw ValidationException::withMessages([
                'slot_key' => 'Slot lampiran tidak sesuai dengan kategori layanan.',
            ]);
        }

        /** @var array<string, array<string, mixed>> $draftAttachments */
        $draftAttachments = $request->session()->get('draft_attachments', []);

        $slotCount = collect($draftAttachments)
            ->where('service_id', $service->id)
            ->where('slot_key', $slot['key'])
            ->count();

        if ($slotCount >= (int) $slot['max_files']) {
            throw ValidationException::withMessages([
                'file' => 'Maksimal '.$slot['max_files'].' file untuk slot '.$slot['label'].'.',
            ]);
        }

        $totalFiles = collect($draftAttachments)->where('service_id', $service->id)->count();
        $totalBytes = (int) collect($draftAttachments)->where('service_id', $service->id)->sum('size_bytes');
        $maxFilesOrder = (int) config('vendoria.attachments.max_files_per_order', 30);
        $maxTotalBytes = (int) config('vendoria.attachments.max_total_megabytes', 100) * 1024 * 1024;

        $file = $request->file('file');

        if ($totalFiles + 1 > $maxFilesOrder) {
            throw ValidationException::withMessages([
                'file' => "Maksimal {$maxFilesOrder} file per pesanan.",
            ]);
        }

        if ($totalBytes + $file->getSize() > $maxTotalBytes) {
            throw ValidationException::withMessages([
                'file' => 'Total ukuran seluruh lampiran melebihi batas maksimal.',
            ]);
        }

        OrderAttachments::validateUploadedFile($file, $slot);

        $stored = OrderAttachments::storeFile($file, 'order-attachments/drafts');
        $tempId = (string) Str::uuid();

        $record = [
            'temp_id' => $tempId,
            'service_id' => $service->id,
            'slot_key' => $slot['key'],
            ...$stored,
        ];

        $draftAttachments[$tempId] = $record;
        $request->session()->put('draft_attachments', $draftAttachments);

        return response()->json([
            'attachment' => [
                'temp_id' => $tempId,
                'slot_key' => $slot['key'],
                'original_name' => $stored['original_name'],
                'mime_type' => $stored['mime_type'],
                'size_bytes' => $stored['size_bytes'],
                'preview_url' => route('order.draft.attachments.preview', $tempId, absolute: false),
            ],
        ]);
    }

    public function previewDraft(Request $request, string $tempId): StreamedResponse
    {
        $draftAttachments = $request->session()->get('draft_attachments', []);
        $record = $draftAttachments[$tempId] ?? null;

        abort_if($record === null, 404);

        return $this->streamFromDisk(
            (string) $record['stored_path'],
            (string) $record['original_name'],
            (string) $record['mime_type'],
            false,
        );
    }

    public function destroyDraft(Request $request, string $tempId): JsonResponse
    {
        $draftAttachments = $request->session()->get('draft_attachments', []);
        $record = $draftAttachments[$tempId] ?? null;

        if ($record !== null) {
            OrderAttachments::deleteStoredFile((string) $record['stored_path']);
            unset($draftAttachments[$tempId]);
            $request->session()->put('draft_attachments', $draftAttachments);
        }

        return response()->json(['deleted' => true]);
    }

    public function store(Request $request, Order $order): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user->role === UserRole::Customer && $order->customer_id === $user->id, 403);

        if (in_array($order->status, [OrderStatus::Completed, OrderStatus::Rejected, OrderStatus::Cancelled], true)) {
            throw ValidationException::withMessages([
                'file' => 'Lampiran tidak dapat ditambahkan pada pesanan yang sudah selesai atau dibatalkan.',
            ]);
        }

        $validated = $request->validate([
            'slot_key' => ['required', 'string', 'max:80'],
            'file' => ['required', 'file'],
        ]);

        $order->loadMissing(['service.category:id,slug', 'vendorProfile.user', 'attachments']);

        $slot = OrderAttachments::findSlot($order->service?->category?->slug, $validated['slot_key']);

        if ($slot === null) {
            throw ValidationException::withMessages([
                'slot_key' => 'Slot lampiran tidak sesuai dengan kategori layanan.',
            ]);
        }

        $existingSlotCount = $order->attachments->where('slot_key', $slot['key'])->count();

        if ($existingSlotCount >= (int) $slot['max_files']) {
            throw ValidationException::withMessages([
                'file' => 'Maksimal '.$slot['max_files'].' file untuk slot '.$slot['label'].'.',
            ]);
        }

        $file = $request->file('file');
        $maxFilesOrder = (int) config('vendoria.attachments.max_files_per_order', 30);
        $maxTotalBytes = (int) config('vendoria.attachments.max_total_megabytes', 100) * 1024 * 1024;

        if ($order->attachments->count() + 1 > $maxFilesOrder) {
            throw ValidationException::withMessages([
                'file' => "Maksimal {$maxFilesOrder} file per pesanan.",
            ]);
        }

        if ($order->attachments->sum('size_bytes') + $file->getSize() > $maxTotalBytes) {
            throw ValidationException::withMessages([
                'file' => 'Total ukuran seluruh lampiran melebihi batas maksimal.',
            ]);
        }

        OrderAttachments::validateUploadedFile($file, $slot);

        $stored = OrderAttachments::storeFile($file, 'order-attachments/'.$order->order_number);

        $attachment = $order->attachments()->create([
            'slot_key' => $slot['key'],
            'original_name' => $stored['original_name'],
            'stored_path' => $stored['stored_path'],
            'mime_type' => $stored['mime_type'],
            'size_bytes' => $stored['size_bytes'],
            'uploaded_by' => $user->id,
            'is_post_submission' => true,
        ]);

        $order->vendorProfile->user->notify(
            new OrderAttachmentAdded($order, (string) $slot['label'], $attachment->original_name),
        );

        return back()->with('success', 'Lampiran berhasil ditambahkan.');
    }

    public function destroy(Request $request, Order $order, OrderAttachment $attachment): RedirectResponse
    {
        $user = $request->user();
        abort_unless(
            $attachment->order_id === $order->id
            && $user->role === UserRole::Customer
            && $order->customer_id === $user->id
            && $attachment->uploaded_by === $user->id,
            403,
        );

        if ($order->status !== OrderStatus::Pending) {
            throw ValidationException::withMessages([
                'attachment' => 'Lampiran hanya dapat dihapus sebelum pesanan dikonfirmasi vendor.',
            ]);
        }

        OrderAttachments::deleteStoredFile($attachment->stored_path);
        $attachment->delete();

        return back()->with('success', 'Lampiran berhasil dihapus.');
    }

    public function show(Request $request, Order $order, OrderAttachment $attachment): StreamedResponse
    {
        Gate::authorize('view', $order);
        abort_if($attachment->order_id !== $order->id, 404);

        return $this->streamFromDisk(
            $attachment->stored_path,
            $attachment->original_name,
            $attachment->mime_type,
            $request->boolean('download'),
        );
    }

    public function downloadZip(Order $order): BinaryFileResponse
    {
        Gate::authorize('view', $order);
        $order->load('attachments');

        abort_if($order->attachments->isEmpty(), 404, 'Belum ada lampiran untuk diunduh.');

        $zipPath = tempnam(sys_get_temp_dir(), 'vendoria_zip_');
        $zip = new ZipArchive;

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            abort(500, 'Gagal membuat arsip ZIP.');
        }

        $disk = Storage::disk(OrderAttachments::disk());

        foreach ($order->attachments as $attachment) {
            if (! $disk->exists($attachment->stored_path)) {
                continue;
            }

            $entryName = $attachment->slot_key.'/'.$attachment->id.'_'.$attachment->original_name;
            $zip->addFromString($entryName, (string) $disk->get($attachment->stored_path));
        }

        $zip->close();

        return response()
            ->download($zipPath, 'lampiran-'.$order->order_number.'.zip', ['Content-Type' => 'application/zip'])
            ->deleteFileAfterSend(true);
    }

    public function requestAttachment(Request $request, Order $order): RedirectResponse
    {
        Gate::authorize('update', $order);

        $validated = $request->validate([
            'slot_key' => ['required', 'string', 'max:80'],
        ]);

        $order->loadMissing(['service.category:id,slug', 'customer']);
        $slot = OrderAttachments::findSlot($order->service?->category?->slug, $validated['slot_key']);

        abort_if($slot === null, 404);

        $order->customer->notify(
            new OrderAttachmentRequested($order, (string) $slot['label']),
        );

        return back()->with('success', 'Permintaan lampiran telah dikirim ke pemesan.');
    }

    private function streamFromDisk(
        string $storedPath,
        string $originalName,
        string $mimeType,
        bool $forceDownload,
    ): StreamedResponse {
        $disk = Storage::disk(OrderAttachments::disk());
        abort_unless($disk->exists($storedPath), 404);

        $disposition = $forceDownload ? 'attachment' : 'inline';
        $safeName = str_replace(['"', '\\', '/'], '_', $originalName);

        return $disk->response($storedPath, $safeName, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => "{$disposition}; filename=\"{$safeName}\"",
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
