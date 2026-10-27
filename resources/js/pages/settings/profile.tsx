import { Form, Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
import { send } from '@/routes/verification';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    if (user === null) {
        return null;
    }

    return (
        <>
            <Head title="Pengaturan profil" />

            <h1 className="sr-only">Pengaturan profil</h1>

            <div className="space-y-6">
                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-7"
                >
                    {({ processing, errors }) => (
                        <>
                            <Heading
                                variant="small"
                                title="Profil"
                                description="Perbarui nama, email, nomor telepon, dan foto profil Anda."
                            />

                            <div className="grid gap-2">
                                <Label htmlFor="avatar">
                                    Foto profil (maksimal 2 MB)
                                </Label>
                                <div className="flex flex-wrap items-center gap-4">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={`Foto profil ${user.name}`}
                                            className="size-16 rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <span
                                            aria-hidden="true"
                                            className="flex size-16 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground"
                                        >
                                            {user.name
                                                .split(/\s+/)
                                                .slice(0, 2)
                                                .map((part) => part[0])
                                                .join('')
                                                .toUpperCase()}
                                        </span>
                                    )}
                                    <Input
                                        id="avatar"
                                        type="file"
                                        name="avatar"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="min-w-0 flex-1"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Format JPG, PNG, atau WebP.
                                </p>
                                <InputError message={errors.avatar} />
                                {user.avatar_url && (
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            name="remove_avatar"
                                            value="1"
                                        />
                                        Hapus foto profil
                                    </label>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block h-11 w-full rounded-lg"
                                    defaultValue={user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Nama lengkap"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat email</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block h-11 w-full rounded-lg"
                                    defaultValue={user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder="Alamat email"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Nomor WhatsApp</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    defaultValue={user.phone ?? ''}
                                    autoComplete="tel"
                                    placeholder="08xxxxxxxxxx"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            Alamat email Anda belum
                                            diverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 hover:decoration-current!"
                                            >
                                                Kirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                Tautan verifikasi baru telah
                                                dikirim ke email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Simpan perubahan
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-7">
                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
