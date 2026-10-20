import { Form, Head } from '@inertiajs/react';
import AdminShell, { AdminPagination, type PaginationLink } from '@/components/admin-shell';
import vendors from '@/routes/admin/vendors';

type Vendor = {
    slug: string;
    business_name: string;
    city: string;
    is_verified: boolean;
    is_active: boolean;
    services_count: number;
    user: { name: string; email: string };
};

export default function AdminVendors({ vendors: page }: {
    vendors: { data: Vendor[]; links: PaginationLink[] };
}) {
    return (
        <AdminShell title="Kelola vendor">
            <Head title="Kelola vendor" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Vendor</h2>
                    <p className="mt-2 text-muted-foreground">Verifikasi usaha dan atur status publikasi vendor.</p>
                </div>
                {page.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Belum ada vendor.</p>
                ) : (
                    <div className="grid gap-4">
                        {page.data.map((vendor) => (
                            <article key={vendor.slug} className="grid gap-4 rounded-xl border bg-card p-5 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div>
                                    <h3 className="font-semibold">{vendor.business_name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{vendor.user.name} · {vendor.user.email}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{vendor.city} · {vendor.services_count} layanan</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Form {...vendors.update.form(vendor.slug)} className="flex items-center gap-2">
                                        <input type="hidden" name="is_verified" value={vendor.is_verified ? '0' : '1'} />
                                        <button className="min-h-10 rounded-md border px-3 text-sm font-medium hover:bg-muted">
                                            {vendor.is_verified ? 'Batalkan verifikasi' : 'Verifikasi'}
                                        </button>
                                    </Form>
                                    <Form {...vendors.update.form(vendor.slug)} className="flex items-center gap-2">
                                        <input type="hidden" name="is_active" value={vendor.is_active ? '0' : '1'} />
                                        <button className={`min-h-10 rounded-md border px-3 text-sm font-medium ${vendor.is_active ? 'text-destructive' : 'text-primary'}`}>
                                            {vendor.is_active ? 'Nonaktifkan vendor' : 'Aktifkan vendor'}
                                        </button>
                                    </Form>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                <AdminPagination links={page.links} />
            </main>
        </AdminShell>
    );
}
