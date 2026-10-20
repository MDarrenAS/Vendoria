import { Form, Head } from '@inertiajs/react';
import { update as updateOnboarding } from '@/routes/vendor/onboarding';

type Profile = {
    business_name?: string;
    description?: string;
    city?: string;
    province?: string;
    address?: string | null;
    whatsapp_number?: string;
    contact_email?: string | null;
    instagram?: string | null;
};

export default function VendorOnboarding({ profile }: { profile: Profile | null }) {
    return (
        <>
            <Head title="Lengkapi Profil Vendor" />
            <main className="mx-auto max-w-2xl space-y-6 px-5 py-10">
                <img src="/images/VendoriaLogo.png" alt="Logo Vendoria" className="h-12 w-auto" />
                <div>
                    <h1 className="text-3xl font-semibold">Lengkapi profil usaha</h1>
                    <p className="mt-2 text-muted-foreground">Lengkapi informasi dasar sebelum mengelola layanan.</p>
                </div>
                <Form {...updateOnboarding.form()} encType="multipart/form-data" className="grid gap-5 rounded-xl border bg-card p-6">
                    {({ errors, processing }) => (
                        <>
                            <Field label="Nama usaha" name="business_name" defaultValue={profile?.business_name ?? ''} error={errors.business_name} required />
                            <TextArea label="Deskripsi usaha" name="description" defaultValue={profile?.description ?? ''} error={errors.description} required />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Kota" name="city" defaultValue={profile?.city ?? ''} error={errors.city} required />
                                <Field label="Provinsi" name="province" defaultValue={profile?.province ?? ''} error={errors.province} required />
                            </div>
                            <Field label="Nomor WhatsApp" name="whatsapp_number" defaultValue={profile?.whatsapp_number ?? ''} error={errors.whatsapp_number} placeholder="08xxxxxxxxxx" required />
                            <Field label="Alamat" name="address" defaultValue={profile?.address ?? ''} error={errors.address} />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <FileField label="Logo usaha" name="logo" error={errors.logo} />
                                <FileField label="Foto cover usaha" name="cover" error={errors.cover} />
                            </div>
                            <button disabled={processing} className="h-11 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60">
                                {processing ? 'Menyimpan...' : 'Simpan dan lanjutkan'}
                            </button>
                        </>
                    )}
                </Form>
            </main>
        </>
    );
}

function Field({
    label,
    name,
    defaultValue,
    error,
    required = false,
    placeholder,
}: {
    label: string;
    name: string;
    defaultValue: string;
    error?: string;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <input name={name} defaultValue={defaultValue} required={required} placeholder={placeholder} className="h-10 rounded-md border bg-background px-3 font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}

function TextArea({
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
            <textarea name={name} defaultValue={defaultValue} required={required} rows={4} className="rounded-md border bg-background p-3 font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}

function FileField({ label, name, error }: { label: string; name: string; error?: string }) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label} (JPG, PNG, WebP; maks. 2 MB)
            <input type="file" name={name} accept="image/jpeg,image/png,image/webp" className="text-sm font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}
