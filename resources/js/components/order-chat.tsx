import { useForm } from '@inertiajs/react';
import { MessageCircle, Send, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    index as getOrderMessages,
    store as sendOrderMessage,
} from '@/actions/App/Http/Controllers/OrderMessageController';

export type OrderChatMessage = {
    id: number;
    body: string;
    created_at: string;
    sender_id: number;
    sender_name: string;
};

type Props = {
    orderNumber: string;
    initialMessages: OrderChatMessage[];
    currentUserId: number;
    counterpartName: string;
    canSend: boolean;
};

export default function OrderChat({
    orderNumber,
    initialMessages,
    currentUserId,
    counterpartName,
    canSend,
}: Props) {
    const form = useForm({ body: '' });
    const [messages, setMessages] = useState(initialMessages);
    const [connectionError, setConnectionError] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);
    const isRefreshing = useRef(false);
    const lastMessageId = useRef(initialMessages.at(-1)?.id ?? 0);

    useEffect(() => {
        setMessages((currentMessages) =>
            mergeMessages(currentMessages, initialMessages),
        );
        lastMessageId.current = Math.max(
            lastMessageId.current,
            initialMessages.at(-1)?.id ?? 0,
        );
    }, [initialMessages]);

    useEffect(() => {
        let isActive = true;
        const abortController = new AbortController();

        async function refreshMessages(): Promise<void> {
            if (
                document.visibilityState !== 'visible' ||
                isRefreshing.current
            ) {
                return;
            }

            isRefreshing.current = true;

            try {
                const response = await fetch(
                    getOrderMessages.url(orderNumber, {
                        query: { after_id: lastMessageId.current },
                    }),
                    {
                        headers: { Accept: 'application/json' },
                        credentials: 'same-origin',
                        signal: abortController.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        `Chat refresh failed with status ${response.status}`,
                    );
                }

                const result = (await response.json()) as {
                    messages: OrderChatMessage[];
                };

                if (!isActive) {
                    return;
                }

                setMessages((currentMessages) =>
                    mergeMessages(currentMessages, result.messages),
                );
                lastMessageId.current = Math.max(
                    lastMessageId.current,
                    ...result.messages.map(({ id }) => id),
                );
                setConnectionError(false);
            } catch (error) {
                if (
                    isActive &&
                    !(
                        error instanceof DOMException &&
                        error.name === 'AbortError'
                    )
                ) {
                    setConnectionError(true);
                }
            } finally {
                isRefreshing.current = false;
            }
        }

        void refreshMessages();
        const intervalId = window.setInterval(() => {
            void refreshMessages();
        }, 3000);

        return () => {
            isActive = false;
            abortController.abort();
            window.clearInterval(intervalId);
        };
    }, [orderNumber]);

    useEffect(() => {
        const messageList = messageListRef.current;

        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]);

    function submitMessage(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (!form.data.body.trim() || form.processing || !canSend) {
            return;
        }

        form.transform((data) => ({ body: data.body.trim() }));
        form.post(sendOrderMessage.url(orderNumber), {
            preserveScroll: true,
            onSuccess: () => form.reset('body'),
        });
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-primary">
                        <MessageCircle aria-hidden="true" className="size-5" />
                    </span>
                    <div className="min-w-0">
                        <h2 className="font-semibold">Chat pesanan</h2>
                        <p className="truncate text-xs text-muted-foreground">
                            Dengan {counterpartName}
                        </p>
                    </div>
                </div>
                <div
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        connectionError
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                            : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                    }`}
                    aria-live="polite"
                >
                    {connectionError ? (
                        <WifiOff aria-hidden="true" className="size-3.5" />
                    ) : (
                        <Wifi aria-hidden="true" className="size-3.5" />
                    )}
                    {connectionError ? 'Menyambungkan ulang' : 'Sinkron aktif'}
                </div>
            </header>

            <div
                ref={messageListRef}
                aria-label="Riwayat percakapan"
                aria-live="polite"
                className="flex h-[min(56vh,440px)] min-h-64 flex-col gap-4 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-5 dark:bg-slate-950/40"
            >
                <div className="mx-auto max-w-[85%] rounded-full border border-blue-100 bg-white px-3 py-1.5 text-center text-[11px] leading-4 text-muted-foreground shadow-sm dark:border-blue-900 dark:bg-slate-900">
                    Percakapan ini tersimpan pada pesanan {orderNumber}. Hindari
                    membagikan kata sandi atau kode OTP.
                </div>

                {messages.length === 0 ? (
                    <div className="m-auto grid max-w-xs justify-items-center gap-2 text-center">
                        <span className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-slate-900">
                            <MessageCircle
                                aria-hidden="true"
                                className="size-5"
                            />
                        </span>
                        <p className="text-sm font-semibold">
                            Mulai percakapan
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                            Tanyakan detail layanan, jadwal, atau kebutuhan
                            acara kepada {counterpartName}.
                        </p>
                    </div>
                ) : (
                    messages.map((message) => {
                        const isOwnMessage =
                            message.sender_id === currentUserId;

                        return (
                            <article
                                key={message.id}
                                className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%] ${
                                    isOwnMessage ? 'self-end' : 'self-start'
                                }`}
                            >
                                {!isOwnMessage && (
                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-primary dark:bg-blue-950 dark:text-blue-200">
                                        {getInitials(message.sender_name)}
                                    </span>
                                )}
                                <div
                                    className={`min-w-0 rounded-2xl px-3.5 py-2.5 shadow-sm ${
                                        isOwnMessage
                                            ? 'rounded-br-md bg-blue-600 text-white dark:bg-blue-500'
                                            : 'rounded-bl-md border border-slate-200 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
                                    }`}
                                >
                                    {!isOwnMessage && (
                                        <p className="mb-1 text-[10px] font-semibold text-primary">
                                            {message.sender_name}
                                        </p>
                                    )}
                                    <p className="text-sm break-words whitespace-pre-wrap">
                                        {message.body}
                                    </p>
                                    <time
                                        dateTime={message.created_at}
                                        className={`mt-1 block text-right text-[10px] ${
                                            isOwnMessage
                                                ? 'text-blue-100'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {formatMessageTime(message.created_at)}
                                    </time>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>

            <div className="border-t border-border/70 bg-card p-3 sm:p-4">
                {canSend ? (
                    <>
                        <form
                            onSubmit={submitMessage}
                            className="flex items-end gap-2"
                        >
                            <label
                                className="sr-only"
                                htmlFor={`message-${orderNumber}`}
                            >
                                Tulis pesan
                            </label>
                            <textarea
                                id={`message-${orderNumber}`}
                                value={form.data.body}
                                onChange={(event) =>
                                    form.setData('body', event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === 'Enter' &&
                                        !event.shiftKey &&
                                        !event.nativeEvent.isComposing
                                    ) {
                                        event.preventDefault();
                                        event.currentTarget.form?.requestSubmit();
                                    }
                                }}
                                maxLength={2000}
                                rows={1}
                                placeholder="Tulis pesan..."
                                disabled={form.processing}
                                className="max-h-28 min-h-11 flex-1 resize-y rounded-xl border border-border bg-background px-3.5 py-3 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
                            />
                            <button
                                type="submit"
                                disabled={
                                    form.processing || !form.data.body.trim()
                                }
                                aria-label="Kirim pesan"
                                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Send aria-hidden="true" className="size-4" />
                            </button>
                        </form>
                        {form.errors.body && (
                            <p
                                role="alert"
                                className="mt-2 text-xs text-destructive"
                            >
                                {form.errors.body}
                            </p>
                        )}
                        {connectionError && (
                            <p className="mt-2 text-xs text-amber-800 dark:text-amber-200">
                                Pesan baru belum dapat dimuat. Sistem akan
                                mencoba kembali secara otomatis.
                            </p>
                        )}
                    </>
                ) : (
                    <p className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs leading-5 text-muted-foreground">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        Percakapan hanya dapat dibaca karena pesanan sudah
                        ditutup.
                    </p>
                )}
            </div>
        </section>
    );
}

function mergeMessages(
    currentMessages: OrderChatMessage[],
    incomingMessages: OrderChatMessage[],
): OrderChatMessage[] {
    const messagesById = new Map(
        currentMessages.map((message) => [message.id, message]),
    );

    incomingMessages.forEach((message) => {
        messagesById.set(message.id, message);
    });

    return [...messagesById.values()].sort(
        (first, second) => first.id - second.id,
    );
}

function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
}

function formatMessageTime(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));
}
