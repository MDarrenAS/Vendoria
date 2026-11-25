import {
    FileArchive,
    FileSpreadsheet,
    FileText,
    LoaderCircle,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';

export type AttachmentSlot = {
    key: string;
    label: string;
    hint: string;
    required: boolean;
    accept: string[];
    max_files: number;
    accepted_extensions: string[];
    accepted_mimes: string[];
    accepted_label: string;
    max_size_mb: number;
};

export type DraftAttachment = {
    temp_id: string;
    slot_key: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
    preview_url: string;
};

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileTypeIcon({ mimeType, name }: { mimeType: string; name: string }) {
    const lower = name.toLowerCase();
    if (mimeType.includes('spreadsheet') || lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) {
        return <FileSpreadsheet className="size-6 text-emerald-600" />;
    }
    if (mimeType.includes('zip') || lower.endsWith('.zip') || lower.endsWith('.ai') || lower.endsWith('.psd') || lower.endsWith('.cdr')) {
        return <FileArchive className="size-6 text-teal-600" />;
    }
    return <FileText className="size-6 text-rose-600" />;
}

export default function OrderAttachmentUploader({
    serviceId,
    slots,
    attachments,
    onChange,
    errors,
}: {
    serviceId: number;
    slots: AttachmentSlot[];
    attachments: DraftAttachment[];
    onChange: (next: DraftAttachment[]) => void;
    errors: Record<string, string | undefined>;
}) {
    const [progressBySlot, setProgressBySlot] = useState<Record<string, number | null>>({});
    const [slotErrors, setSlotErrors] = useState<Record<string, string>>({});
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

    if (slots.length === 0) {
        return null;
    }

    function uploadFile(slot: AttachmentSlot, file: File) {
        setSlotErrors((prev) => ({ ...prev, [slot.key]: '' }));
        setProgressBySlot((prev) => ({ ...prev, [slot.key]: 0 }));

        const formData = new FormData();
        formData.append('service_id', String(serviceId));
        formData.append('slot_key', slot.key);
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/order/draft/attachments');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-XSRF-TOKEN', getCsrfToken());

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                setProgressBySlot((prev) => ({ ...prev, [slot.key]: percent }));
            }
        };

        xhr.onload = () => {
            setProgressBySlot((prev) => ({ ...prev, [slot.key]: null }));
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText) as { attachment: DraftAttachment };
                    onChange([...attachments, data.attachment]);
                } catch {
                    setSlotErrors((prev) => ({
                        ...prev,
                        [slot.key]: 'Gagal membaca respons server.',
                    }));
                }
                return;
            }

            try {
                const err = JSON.parse(xhr.responseText) as {
                    message?: string;
                    errors?: Record<string, string[]>;
                };
                const firstError =
                    err.errors?.file?.[0] ??
                    err.errors?.slot_key?.[0] ??
                    err.message ??
                    'Gagal mengunggah file.';
                setSlotErrors((prev) => ({ ...prev, [slot.key]: firstError }));
            } catch {
                setSlotErrors((prev) => ({
                    ...prev,
                    [slot.key]: 'Gagal mengunggah file. Pastikan ukuran dan format sesuai.',
                }));
            }
        };

        xhr.onerror = () => {
            setProgressBySlot((prev) => ({ ...prev, [slot.key]: null }));
            setSlotErrors((prev) => ({
                ...prev,
                [slot.key]: 'Koneksi terputus saat mengunggah file.',
            }));
        };

        xhr.send(formData);
    }

    function handleFiles(slot: AttachmentSlot, fileList: FileList | null) {
        if (!fileList || fileList.length === 0) {
            return;
        }
        const existingCount = attachments.filter((a) => a.slot_key === slot.key).length;
        const remaining = slot.max_files - existingCount;
        if (remaining <= 0) {
            setSlotErrors((prev) => ({
                ...prev,
                [slot.key]: `Maksimal ${slot.max_files} file untuk slot ini.`,
            }));
            return;
        }

        const filesToUpload = Array.from(fileList).slice(0, remaining);
        for (const file of filesToUpload) {
            uploadFile(slot, file);
        }
    }

    async function removeAttachment(tempId: string) {
        await fetch(`/order/draft/attachments/${encodeURIComponent(tempId)}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
        });
        onChange(attachments.filter((item) => item.temp_id !== tempId));
    }

    return (
        <div className="space-y-4 rounded-xl border border-border/70 bg-secondary/25 p-4">
            <div>
                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    Lampiran pendukung
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Unggah file pendukung agar vendor langsung memahami kebutuhan Anda tanpa perlu bolak-balik chat.
                </p>
            </div>

            <div className="space-y-4">
                {slots.map((slot) => {
                    const slotItems = attachments.filter((a) => a.slot_key === slot.key);
                    const progress = progressBySlot[slot.key];
                    const acceptAttr = slot.accepted_extensions.map((ext) => `.${ext}`).join(',');
                    const errorMsg = slotErrors[slot.key] || errors[`attachments.${slot.key}`];
                    const isFull = slotItems.length >= slot.max_files;

                    return (
                        <div
                            key={slot.key}
                            className="rounded-xl border border-border/70 bg-background p-3.5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-semibold">
                                            {slot.label}
                                        </span>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                slot.required
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : 'bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {slot.required ? 'Wajib' : 'Opsional'}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {slot.hint}
                                    </p>
                                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                                        Format: {slot.accepted_label} · Maks {slot.max_size_mb} MB/file · ({slotItems.length}/{slot.max_files})
                                    </p>
                                </div>
                            </div>

                            {!isFull && (
                                <label
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setDragOverSlot(slot.key);
                                    }}
                                    onDragLeave={() => setDragOverSlot(null)}
                                    onDrop={(event) => {
                                        event.preventDefault();
                                        setDragOverSlot(null);
                                        handleFiles(slot, event.dataTransfer.files);
                                    }}
                                    className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-4 py-4 text-center transition-colors ${
                                        dragOverSlot === slot.key
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/60 hover:bg-secondary/30'
                                    }`}
                                >
                                    <input
                                        type="file"
                                        multiple={slot.max_files > 1}
                                        accept={acceptAttr}
                                        className="sr-only"
                                        onChange={(event) => {
                                            handleFiles(slot, event.target.files);
                                            event.target.value = '';
                                        }}
                                    />
                                    {progress !== null && progress !== undefined ? (
                                        <div className="flex w-full max-w-xs flex-col items-center gap-1.5">
                                            <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                                <LoaderCircle className="size-4 animate-spin" />
                                                <span>Mengunggah... {progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className="h-full bg-primary transition-all"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="size-5 text-muted-foreground" />
                                            <span className="text-xs font-medium text-foreground">
                                                Tarik & lepas file ke sini, atau{' '}
                                                <span className="text-primary underline">pilih file</span>
                                            </span>
                                        </>
                                    )}
                                </label>
                            )}

                            {slotItems.length > 0 && (
                                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {slotItems.map((item) => {
                                        const isImage = item.mime_type.startsWith('image/');
                                        return (
                                            <li
                                                key={item.temp_id}
                                                className="flex items-center justify-between gap-2.5 rounded-lg border border-border/70 bg-secondary/20 p-2"
                                            >
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    {isImage ? (
                                                        <img
                                                            src={item.preview_url}
                                                            alt={item.original_name}
                                                            className="size-10 shrink-0 rounded-md object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-background">
                                                            <FileTypeIcon
                                                                mimeType={item.mime_type}
                                                                name={item.original_name}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate text-xs font-medium">
                                                            {item.original_name}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground">
                                                            {formatBytes(item.size_bytes)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(item.temp_id)}
                                                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                    title="Hapus lampiran"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {errorMsg && <InputError message={errorMsg} className="mt-2" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
