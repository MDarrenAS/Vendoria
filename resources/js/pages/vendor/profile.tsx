import { Form, Head, Link } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import { update as updateProfile } from '@/routes/vendor/profile';

type Profile = {
    business_name: string;
    slug: string;
    description: string;
    city: string;
    province: string;
    address: string | null;
    whatsapp_number: string;
    contact_email: string | null;
    instagram: string | null;
    logo_url: string | null;
    cover_url: string | null;
};

export default function VendorProfilePage({ profile }: { profile: Profile }) {
    return (
        <VendorShell title="Profil Usaha">
            <Head title="Profil Usaha" />
            <main className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-3xl font-semibold">Profil Usaha</h2>
                        <p className="mt-2 text-muted-foreground">Perbarui informasi publik usaha Anda.</p>
                    </div>
                    <Link href={`/vendors/${profile.slug}`} className="text-sm font-medium text-primary hover:underline">Lihat halaman publik</Link>
                </div>
                <Form {...updateProfile.form()} encType="multipart/form-data" className="grid gap-5 rounded-xl border bg-card p-6">
                    {({ errors, processing }) => (
                        <>
                            <Field label="Nama usaha" name="business_name" defaultValue={profile.business_name} error={errors.business_name} required />
                            <TextArea label="Deskripsi" name="description" defaultValue={profile.description} error={errors.description} required />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Kota" name="city" defaultValue={profile.city} error={errors.city} required />
                                <Field label="Provinsi" name="province" defaultValue={profile.province} error={errors.province} required />
                            </div>
                            <Field label="Alamat" name="address" defaultValue={profile.address ?? ''} error={errors.address} />
                            <Field label="Nomor WhatsApp" name="whatsapp_number" defaultValue={profile.whatsapp_number} error={errors.whatsapp_number} required />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Email kontak" name="contact_email" defaultValue={profile.contact_email ?? ''} error={errors.contact_email} />
                                <Field label="Instagram" name="instagram" defaultValue={profile.instagram ?? ''} error={errors.instagram} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ImageField label="Logo usaha" name="logo" url={profile.logo_url} error={errors.logo} />
                                <ImageField label="Foto cover" name="cover" url={profile.cover_url} error={errors.cover} />
                            </div>
                            <button disabled={processing} className="h-11 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60">
                                {processing ? 'Menyimpan...' : 'Simpan perubahan'}
                            </button>
                        </>
                    )}
                </Form>
            </main>
        </VendorShell>
    );
}

function Field({
    label,
    name,
    defaultValue,
    error,
    required = false,
}: {
    label: string;
    name: string;
    defaultValue: string;
    error?: string;
    required?: boolean;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <input name={name} defaultValue={defaultValue} required={required} className="h-10 rounded-md border bg-background px-3 font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}

function TextArea({ label, name, defaultValue, error, required = false }: {
    label: string;
    name: string;
    defaultValue: string;
    error?: string;
    required?: boolean;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <textarea name={name} defaultValue={defaultValue} required={required} rows={5} className="rounded-md border bg-background p-3 font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}

function ImageField({ label, name, url, error }: { label: string; name: string; url: string | null; error?: string }) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label} (JPG, PNG, WebP; maks. 2 MB)
            {url && <img src={url} alt={`${label} saat ini`} className="h-28 w-full rounded-lg object-cover" />}
            <input type="file" name={name} accept="image/jpeg,image/png,image/webp" className="font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}
