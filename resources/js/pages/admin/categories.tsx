import { Form, Head } from '@inertiajs/react';
import AdminShell from '@/components/admin-shell';
import categories from '@/routes/admin/categories';

type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    description: string | null;
    sort_order: number;
    is_active: boolean;
};

export default function AdminCategories({ categories: items }: { categories: Category[] }) {
    return (
        <AdminShell title="Kelola kategori">
            <Head title="Kelola kategori" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Kategori</h2>
                    <p className="mt-2 text-muted-foreground">Atur kategori yang digunakan pada katalog layanan.</p>
                </div>
                <Form {...categories.store.form()} className="grid gap-3 rounded-xl border bg-card p-5 sm:grid-cols-2">
                    <label className="grid gap-1 text-sm">Nama<input required name="name" maxLength={160} className="h-10 rounded-md border bg-background px-3" /></label>
                    <label className="grid gap-1 text-sm">Slug<input required name="slug" maxLength={180} className="h-10 rounded-md border bg-background px-3" /></label>
                    <label className="grid gap-1 text-sm">Ikon<input name="icon" maxLength={60} className="h-10 rounded-md border bg-background px-3" /></label>
                    <label className="grid gap-1 text-sm">Urutan<input required type="number" name="sort_order" min={0} defaultValue={0} className="h-10 rounded-md border bg-background px-3" /></label>
                    <label className="grid gap-1 text-sm sm:col-span-2">Deskripsi<textarea name="description" maxLength={1000} className="min-h-20 rounded-md border bg-background p-3" /></label>
                    <input type="hidden" name="is_active" value="1" />
                    <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground sm:col-span-2 sm:justify-self-end">Tambah kategori</button>
                </Form>
                {items.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Belum ada kategori.</p>
                ) : (
                    <div className="grid gap-4">
                        {items.map((category) => (
                            <article key={category.id} className="rounded-xl border bg-card p-5">
                                <Form {...categories.update.form(category.id)} className="grid gap-3 sm:grid-cols-2">
                                    <label className="grid gap-1 text-sm">Nama<input required name="name" defaultValue={category.name} maxLength={160} className="h-10 rounded-md border bg-background px-3" /></label>
                                    <label className="grid gap-1 text-sm">Slug<input required name="slug" defaultValue={category.slug} maxLength={180} className="h-10 rounded-md border bg-background px-3" /></label>
                                    <label className="grid gap-1 text-sm">Ikon<input name="icon" defaultValue={category.icon ?? ''} maxLength={60} className="h-10 rounded-md border bg-background px-3" /></label>
                                    <label className="grid gap-1 text-sm">Urutan<input required type="number" name="sort_order" min={0} defaultValue={category.sort_order} className="h-10 rounded-md border bg-background px-3" /></label>
                                    <label className="grid gap-1 text-sm sm:col-span-2">Deskripsi<textarea name="description" defaultValue={category.description ?? ''} maxLength={1000} className="min-h-20 rounded-md border bg-background p-3" /></label>
                                    <label className="grid gap-1 text-sm">Status
                                        <select name="is_active" defaultValue={category.is_active ? '1' : '0'} className="h-10 rounded-md border bg-background px-3">
                                            <option value="1">Aktif</option><option value="0">Nonaktif</option>
                                        </select>
                                    </label>
                                    <div className="flex flex-wrap gap-2 sm:col-span-2 sm:justify-end">
                                        <button className="h-10 rounded-md border px-4 font-medium">Simpan perubahan</button>
                                    </div>
                                </Form>
                                <Form {...categories.destroy.form(category.id)} className="mt-2 flex justify-end" onSubmit={(event) => {
                                    if (!window.confirm(`Hapus kategori "${category.name}"?`)) {
                                        event.preventDefault();
                                    }
                                }}>
                                    <button className="h-10 rounded-md border border-destructive px-4 text-sm font-medium text-destructive">Hapus kategori</button>
                                </Form>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </AdminShell>
    );
}
