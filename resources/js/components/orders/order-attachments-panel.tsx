import { router } from '@inertiajs/react';
import {
    Download,
    ExternalLink,
    FolderArchive,
    Paperclip,
    Plus,
    Send,
    Trash2,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import { useState } from 'react';
import {
    FileTypeIcon,
    formatBytes,
    type AttachmentSlot,
} from '@/components/orders/order-attachment-uploader';

export type OrderAttachmentItem = {
    id: number;
    slot_key: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
    uploaded_by: number;
    is_post_submission: boolean;
    created_at: string | null;
    view_url: string;
    download_url: string;
};

export default function OrderAttachmentsPanel({
    orderNumber,
    slots,
    attachments,
    role,
    currentUserId,
    canAddAttachments = false,
    canDeleteAttachments = false,
}: {
    orderNumber: string;
    slots: AttachmentSlot[];
    attachments: OrderAttachmentItem[];
    role: 'customer' | 'vendor';
    currentUserId: number;
    canAddAttachments?: boolean;
    canDeleteAttachments?: boolean;
}) {
    const [lightboxItem, setLightboxItem] = useState<OrderAttachmentItem | null>(null);
    const [zoom, setZoom] = useState(1);
    const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

    if (slots.length === 0 && attachments.length === 0) {
        return null;
    }

    const slotMap = new Map(slots.map((slot) => [slot.key, slot]));
    const extraKeys = attachments
        .map((a) => a.slot_key)
        .filter((key, idx, arr) => !slotMap.has(key) && arr.indexOf(key) === idx);

    const orderedKeys = [...slots.map((s) => s.key), ...extraKeys];

    function handleUpload(slotKey: string, files: FileList | null) {
        if (!files || files.length === 0) {
            return;
        }
        setUploadingSlot(slotKey);
        router.post(
            `/orders/${orderNumber}/attachments`,
            {
                slot_key: slotKey,
                file: files[0],
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onFinish: () => setUploadingSlot(null),
            },
        );
    }

    function handleDelete(attachmentId: number) {
        router.delete(`/orders/${orderNumber}/attachments/${attachmentId}`, {
            preserveScroll: true,
        });
    }

    function handleRequestAttachment(slotKey: string) {
        router.post(
            `/orders/${orderNumber}/attachments/request`,
            { slot_key: slotKey },
            { preserveScroll: true },
        );
    }

    return (
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Paperclip className="size-5" />
                    </span>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {role === 'vendor' ? 'Lampiran dari pemesan' : 'Lampiran pendukung'}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {attachments.length} file terlampir sesuai kategori layanan
                        </p>
                    </div>
                </div>

                {attachments.length > 0 && (
                    <a
                        href={`/orders/${orderNumber}/attachments-zip`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-secondary"
                    >
                        <FolderArchive className="size-4" />
                        <span>Unduh semua (ZIP)</span>
                    </a>
                )}
            </div>

            <div className="mt-5 space-y-5">
                {orderedKeys.map((slotKey) => {
                    const slot = slotMap.get(slotKey);
                    const items = attachments.filter((a) => a.slot_key === slotKey);
                    const isRequired = slot?.required ?? false;
                    const maxFiles = slot?.max_files ?? 5;
                    const canUploadMore =
                        role === 'customer' &&
                        canAddAttachments &&
                        slot !== undefined &&
                        items.length < maxFiles;

                    return (
                        <div
                            key={slotKey}
                            className="rounded-xl border border-border/70 bg-background/60 p-4"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-sm font-semibold">
                                        {slot?.label ?? slotKey}
                                    </h4>
                                    {slot && (
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                isRequired
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {isRequired ? 'Wajib' : 'Opsional'}
                                        </span>
                                    )}
                                </div>

                                {canUploadMore && (
                                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10">
                                        <Plus className="size-3.5" />
                                        <span>
                                            {uploadingSlot === slotKey
                                                ? 'Mengunggah...'
                                                : 'Tambah file'}
                                        </span>
                                        <input
                                            type="file"
                                            accept={slot.accepted_extensions
                                                .map((ext) => `.${ext}`)
                                                .join(',')}
                                            className="sr-only"
                                            disabled={uploadingSlot === slotKey}
                                            onChange={(e) => {
                                                handleUpload(slotKey, e.target.files);
                                                e.target.value = '';
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            {items.length === 0 ? (
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3.5 py-2.5 text-xs text-muted-foreground">
                                    <span>Belum ada lampiran.</span>
                                    {role === 'vendor' && isRequired && (
                                        <button
                                            type="button"
                                            onClick={() => handleRequestAttachment(slotKey)}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900 hover:bg-amber-200"
                                        >
                                            <Send className="size-3" />
                                            <span>Minta lampiran</span>
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    {items.map((item) => {
                                        const isImage = item.mime_type.startsWith('image/');
                                        const isPdf = item.mime_type === 'application/pdf';
                                        const canDelete =
                                            role === 'customer' &&
                                            canDeleteAttachments &&
                                            item.uploaded_by === currentUserId;

                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-2.5"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    {isImage ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setZoom(1);
                                                                setLightboxItem(item);
                                                            }}
                                                            className="group relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/60"
                                                            title="Klik untuk memperbesar"
                                                        >
                                                            <img
                                                                src={item.view_url}
                                                                alt={item.original_name}
                                                                className="size-full object-cover transition-transform group-hover:scale-105"
                                                            />
                                                        </button>
                                                    ) : (
                                                        <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-secondary/50">
                                                            <FileTypeIcon
                                                                mimeType={item.mime_type}
                                                                name={item.original_name}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="truncate text-xs font-semibold">
                                                                {item.original_name}
                                                            </p>
                                                            {item.is_post_submission && (
                                                                <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                                                                    Baru
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                            {formatBytes(item.size_bytes)}
                                                        </p>
                                                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                                            {isImage ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setZoom(1);
                                                                        setLightboxItem(item);
                                                                    }}
                                                                    className="text-[11px] font-semibold text-primary hover:underline"
                                                                >
                                                                    Lihat penuh
                                                                </button>
                                                            ) : (
                                                                isPdf && (
                                                                    <a
                                                                        href={item.view_url}
                                                                        target="_blank"
                                                                        rel="noreferrer noopener"
                                                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                                                                    >
                                                                        <span>Buka</span>
                                                                        <ExternalLink className="size-3" />
                                                                    </a>
                                                                )
                                                            )}
                                                            <a
                                                                href={item.download_url}
                                                                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                                                            >
                                                                <Download className="size-3" />
                                                                <span>Unduh</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                        title="Hapus lampiran"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {lightboxItem && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex flex-col bg-black/85 p-4"
                >
                    <div className="flex items-center justify-between gap-4 text-white">
                        <p className="truncate text-sm font-medium">
                            {lightboxItem.original_name}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                                className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                                title="Perkecil"
                            >
                                <ZoomOut className="size-4" />
                            </button>
                            <span className="min-w-12 text-center text-xs">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                type="button"
                                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                                className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                                title="Perbesar"
                            >
                                <ZoomIn className="size-4" />
                            </button>
                            <a
                                href={lightboxItem.download_url}
                                className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                                title="Unduh"
                            >
                                <Download className="size-4" />
                            </a>
                            <button
                                type="button"
                                onClick={() => setLightboxItem(null)}
                                className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                                title="Tutup"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    </div>
                    <div
                        className="mt-4 flex flex-1 items-center justify-center overflow-auto"
                        onClick={() => setLightboxItem(null)}
                    >
                        <img
                            src={lightboxItem.view_url}
                            alt={lightboxItem.original_name}
                            onClick={(e) => e.stopPropagation()}
                            style={{ transform: `scale(${zoom})` }}
                            className="max-h-full max-w-full rounded-lg object-contain transition-transform"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
