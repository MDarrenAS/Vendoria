import { Form, Head } from '@inertiajs/react';
import AdminShell, { AdminPagination, type PaginationLink } from '@/components/admin-shell';
import users from '@/routes/admin/users';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
};

type Role = { value: string; label: string };

export default function AdminUsers({ users: page, filters, roles }: {
    users: { data: User[]; links: PaginationLink[] };
    filters: { q?: string; role?: string; is_active?: boolean };
    roles: Role[];
}) {
    return (
        <AdminShell title="Kelola pengguna">
            <Head title="Kelola pengguna" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Pengguna</h2>
                    <p className="mt-2 text-muted-foreground">Cari akun dan nonaktifkan pengguna yang melanggar kebijakan.</p>
                </div>
                <Form {...users.index.form()} method="get" className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
                    <input name="q" defaultValue={filters.q} placeholder="Nama atau email" className="h-10 rounded-md border bg-background px-3 text-sm" />
                    <select name="role" defaultValue={filters.role ?? ''} className="h-10 rounded-md border bg-background px-3 text-sm">
                        <option value="">Semua peran</option>
                        {roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
                    </select>
                    <select name="is_active" defaultValue={filters.is_active === undefined ? '' : filters.is_active ? '1' : '0'} className="h-10 rounded-md border bg-background px-3 text-sm">
                        <option value="">Semua status</option><option value="1">Aktif</option><option value="0">Nonaktif</option>
                    </select>
                    <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground sm:col-span-3 sm:justify-self-end">Terapkan filter</button>
                </Form>
                {page.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Tidak ada pengguna yang cocok.</p>
                ) : (
                    <div className="grid gap-3">
                        {page.data.map((user) => (
                            <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-4">
                                <div>
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{user.email} · {roles.find(({ value }) => value === user.role)?.label ?? user.role} · {user.is_active ? 'Aktif' : 'Nonaktif'}</p>
                                </div>
                                <Form {...users.status.form(user.id)}>
                                    <input type="hidden" name="is_active" value={user.is_active ? '0' : '1'} />
                                    <button className={`h-10 rounded-md border px-3 text-sm font-medium ${user.is_active ? 'text-destructive' : 'text-primary'}`}>
                                        {user.is_active ? 'Nonaktifkan akun' : 'Aktifkan akun'}
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
