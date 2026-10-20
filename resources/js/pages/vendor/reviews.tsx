import { Head } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import { AdminPagination, type PaginationLink } from '@/components/admin-shell';

type Review = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    customer: { name: string };
    service: { name: string; slug: string };
};

export default function VendorReviews({ reviews }: {
    reviews: { data: Review[]; links: PaginationLink[] };
}) {
    return (
        <VendorShell title="Ulasan">
            <Head title="Ulasan pelanggan" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Ulasan pelanggan</h2>
                    <p className="mt-2 text-muted-foreground">Ulasan yang diterima untuk layanan Anda.</p>
                </div>
                {reviews.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Belum ada ulasan.</p>
                ) : (
                    <div className="grid gap-4">
                        {reviews.data.map((review) => (
                            <article key={review.id} className="rounded-xl border bg-card p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <h3 className="font-semibold">{review.service.name}</h3>
                                    <span className="text-sm font-medium">★ {review.rating}/5</span>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{review.customer.name} · {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(review.created_at))}</p>
                                <p className="mt-3 whitespace-pre-line">{review.comment || 'Customer tidak menambahkan komentar.'}</p>
                            </article>
                        ))}
                    </div>
                )}
                <AdminPagination links={reviews.links} />
            </main>
        </VendorShell>
    );
}
