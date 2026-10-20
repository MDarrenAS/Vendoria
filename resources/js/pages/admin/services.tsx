import { Form, Head, Link } from '@inertiajs/react';
import AdminShell, { AdminPagination, type PaginationLink } from '@/components/admin-shell';
import { show as vendorShow } from '@/actions/App/Http/Controllers/Public/VendorController';
import serviceRoutes from '@/routes/admin/services';

type Service = {
    slug: string;
    name: string;
    is_active: boolean;
    category: { name: string };
    vendor_profile: { business_name: string; slug: string };
};

export default function AdminServices({ services }: {
    services: { data: Service[]; links: PaginationLink[] };
}) {
    return (
        <AdminShell title="Kelola layanan">
            <Head title="Kelola layanan" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Layanan</h2>
                    <p className="mt-2 text-muted-foreground">Nonaktifkan layanan yang tidak sesuai kebijakan.</p>
                </div>
                {services.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Belum ada layanan.</p>
                ) : (
                    <div className="grid gap-3">
                        {services.data.map((service) => (
                            <article key={service.slug} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
                                <div>
                                    <h3 className="font-semibold">{service.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {service.category.name} · <Link href={vendorShow(service.vendor_profile.slug)} className="hover:text-primary hover:underline">{service.vendor_profile.business_name}</Link>
                                    </p>
                                </div>
                                <Form {...serviceRoutes.status.form(service.slug)}>
                                    <input type="hidden" name="is_active" value={service.is_active ? '0' : '1'} />
                                    <button className={`min-h-10 rounded-md border px-3 text-sm font-medium ${service.is_active ? 'text-destructive' : 'text-primary'}`}>
                                        {service.is_active ? 'Nonaktifkan layanan' : 'Aktifkan layanan'}
                                    </button>
                                </Form>
                            </article>
                        ))}
                    </div>
                )}
                <AdminPagination links={services.links} />
            </main>
        </AdminShell>
    );
}
