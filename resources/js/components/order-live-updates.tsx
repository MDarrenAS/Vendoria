import { usePoll } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const orderStatusLabels: Record<string, string> = {
    pending: 'Menunggu konfirmasi',
    confirmed: 'Dikonfirmasi vendor',
    in_progress: 'Sedang diproses',
    completed: 'Selesai',
    rejected: 'Ditolak vendor',
    cancelled: 'Dibatalkan',
};

type Props = {
    orderNumber: string;
    orderStatus: string;
    paymentStatus: string;
};

export default function OrderLiveUpdates({
    orderNumber,
    orderStatus,
    paymentStatus,
}: Props) {
    const previousState = useRef({ orderStatus, paymentStatus });

    usePoll(
        5000,
        { only: ['order', 'unreadNotificationCount'] },
        { mode: 'rest', background: 'pause' },
    );

    useEffect(() => {
        const previous = previousState.current;

        if (previous.orderStatus !== orderStatus) {
            toast.info(
                `Pesanan ${orderNumber}: ${orderStatusLabels[orderStatus] ?? orderStatus}.`,
            );
        }

        if (
            previous.paymentStatus !== paymentStatus &&
            paymentStatus === 'paid'
        ) {
            toast.success(
                `Pembayaran pesanan ${orderNumber} telah dikonfirmasi.`,
            );
        }

        previousState.current = { orderStatus, paymentStatus };
    }, [orderNumber, orderStatus, paymentStatus]);

    return null;
}
