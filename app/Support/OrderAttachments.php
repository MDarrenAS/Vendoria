<?php

namespace App\Support;

use App\Models\Order;
use App\Models\OrderAttachment;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderAttachments
{
    public static function disk(): string
    {
        return (string) config('vendoria.attachments.disk', 'local');
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public static function slotsForCategory(?string $categorySlug): array
    {
        if ($categorySlug === null || $categorySlug === '') {
            return [];
        }

        $slots = config('vendoria.category_attachment_slots.'.$categorySlug, []);
        $typeGroups = config('vendoria.attachments.type_groups', []);

        return array_map(function (array $slot) use ($typeGroups): array {
            $extensions = [];
            $mimes = [];
            $labels = [];
            $maxMb = 0;

            foreach ($slot['accept'] ?? [] as $groupKey) {
                $group = $typeGroups[$groupKey] ?? null;

                if ($group === null) {
                    continue;
                }

                $extensions = array_merge($extensions, $group['extensions'] ?? []);
                $mimes = array_merge($mimes, $group['mimes'] ?? []);
                $labels[] = $group['label'] ?? $groupKey;
                $maxMb = max($maxMb, (int) ($group['max_mb'] ?? 5));
            }

            return [
                ...$slot,
                'accepted_extensions' => array_values(array_unique($extensions)),
                'accepted_mimes' => array_values(array_unique($mimes)),
                'accepted_label' => implode(', ', $labels),
                'max_size_mb' => $maxMb > 0 ? $maxMb : 5,
            ];
        }, $slots);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function findSlot(?string $categorySlug, string $slotKey): ?array
    {
        foreach (self::slotsForCategory($categorySlug) as $slot) {
            if ($slot['key'] === $slotKey) {
                return $slot;
            }
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $slot
     */
    public static function validateUploadedFile(UploadedFile $file, array $slot): void
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $mime = strtolower((string) ($file->getMimeType() ?: $file->getClientMimeType()));
        $typeGroups = config('vendoria.attachments.type_groups', []);

        $matchedGroup = null;

        foreach ($slot['accept'] ?? [] as $groupKey) {
            $group = $typeGroups[$groupKey] ?? null;

            if ($group === null) {
                continue;
            }

            $allowedExts = $group['extensions'] ?? [];
            $allowedMimes = $group['mimes'] ?? [];

            if (in_array($extension, $allowedExts, true) && in_array($mime, $allowedMimes, true)) {
                $matchedGroup = $group;

                break;
            }
        }

        if ($matchedGroup === null) {
            throw ValidationException::withMessages([
                'file' => 'Format file tidak didukung untuk slot '.$slot['label'].'. Gunakan: '.$slot['accepted_label'].'.',
            ]);
        }

        $maxBytes = ((int) ($matchedGroup['max_mb'] ?? 5)) * 1024 * 1024;

        if ($file->getSize() > $maxBytes) {
            throw ValidationException::withMessages([
                'file' => 'Ukuran file melebihi batas maksimal '.$matchedGroup['max_mb'].' MB untuk tipe file ini.',
            ]);
        }
    }

    /**
     * @return array{stored_path: string, original_name: string, mime_type: string, size_bytes: int}
     */
    public static function storeFile(UploadedFile $file, string $directory): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filename = (string) Str::uuid().($extension !== '' ? '.'.$extension : '');
        $storedPath = $file->storeAs($directory, $filename, [
            'disk' => self::disk(),
            'visibility' => 'private',
        ]);

        return [
            'stored_path' => (string) $storedPath,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => (string) ($file->getMimeType() ?: $file->getClientMimeType() ?: 'application/octet-stream'),
            'size_bytes' => (int) $file->getSize(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function serialize(OrderAttachment $attachment, Order $order): array
    {
        return [
            'id' => $attachment->id,
            'slot_key' => $attachment->slot_key,
            'original_name' => $attachment->original_name,
            'mime_type' => $attachment->mime_type,
            'size_bytes' => $attachment->size_bytes,
            'uploaded_by' => $attachment->uploaded_by,
            'is_post_submission' => $attachment->is_post_submission,
            'created_at' => $attachment->created_at?->toIso8601String(),
            'view_url' => route('orders.attachments.show', [$order, $attachment], absolute: false),
            'download_url' => route('orders.attachments.show', [$order, $attachment, 'download' => 1], absolute: false),
        ];
    }

    public static function deleteStoredFile(string $storedPath): void
    {
        if ($storedPath !== '' && Storage::disk(self::disk())->exists($storedPath)) {
            Storage::disk(self::disk())->delete($storedPath);
        }
    }
}
