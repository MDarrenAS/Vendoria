import { Form, Head } from '@inertiajs/react';
import AdminShell, { AdminPagination, type PaginationLink } from '@/components/admin-shell';
import reviews from '@/routes/admin/reviews';

type Review = {
    id: number;
    rating: number;
    comment: string | null;
    is_visible: boolean;
    order: { order_number: string };
    customer: { name: string; email: string };
    vendor_profile: { business_name: string };
    service: { name: string };
};

export default function AdminReviews({ reviews: page }: {
    reviews: { data: Review[]; links: PaginationLink[] };
}) {
    return (
        <AdminShell title="Moderasi ulasan">
            <Head title="Moderasi ulasan" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Moderasi ulasan</h2>
                    <p className="mt-2 text-muted-foreground">Sembunyikan atau tampilkan ulasan tanpa menghapus riwayatnya.</p>
                </div>
                {page.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Belum ada ulasan.</p>
                ) : (
                    <div className="grid gap-4">
                        {page.data.map((review) => (
                            <article key={review.id} className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">{review.order.order_number} · {review.customer.name} · {review.customer.email}</p>
                                    <h3 className="mt-1 font-semibold">{review.service.name} · {review.vendor_profile.business_name}</h3>
                                    <p className="mt-2 text-sm">★ {review.rating}/5 · {review.comment || 'Tidak ada komentar.'}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Status: {review.is_visible ? 'Tampil' : 'Disembunyikan'}</p>
                                </div>
                                <Form {...reviews.update.form(review.id)}>
                                    <input type="hidden" name="is_visible" value={review.is_visible ? '0' : '1'} />
                                    <button className="h-10 rounded-md border px-3 text-sm font-medium">
                                        {review.is_visible ? 'Sembunyikan' : 'Tampilkan'}
                                    </button>
                                </Form>
                            </article>
                        ))}
                    </div>
                )}
                <AdminPagination links={page.links} />
            </main>
        </AdminShell>
    );
}
