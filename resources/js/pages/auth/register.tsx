import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
    draftOrderLocked: boolean;
    draftOrderSummary?: {
        service: string;
        package: string | null;
        event_date: string;
    } | null;
};

export default function Register({ passwordRules, draftOrderLocked, draftOrderSummary }: Props) {
    return (
        <>
            <Head title="Daftar" />
            {draftOrderSummary && (
                <aside className="mb-5 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                    <p className="font-semibold">Pesanan Anda belum hilang</p>
                    <p className="mt-1 text-muted-foreground">
                        {draftOrderSummary.service}
                        {draftOrderSummary.package ? ` – ${draftOrderSummary.package}` : ''}
                        {' – '}
                        {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(`${draftOrderSummary.event_date}T12:00:00`))}
                    </p>
                    {draftOrderLocked && <p className="mt-2">Pendaftaran dilanjutkan sebagai akun Panitia.</p>}
                </aside>
            )}
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {draftOrderLocked ? (
                                <input type="hidden" name="role" value="customer" />
                            ) : (
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Jenis akun</Label>
                                    <select
                                        id="role"
                                        name="role"
                                        required
                                        defaultValue="customer"
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                                    >
                                        <option value="customer">Saya Panitia / Pencari Vendor</option>
                                        <option value="vendor">Saya Vendor</option>
                                    </select>
                                    <InputError message={errors.role} />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="name">Nama lengkap</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nama lengkap"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Alamat email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Kata sandi</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Konfirmasi kata sandi
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Buat akun
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Sudah punya akun?{' '}
                            <TextLink href={login()} tabIndex={6}>
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Buat akun Vendoria',
    description: 'Masukkan data Anda untuk membuat akun Vendoria.',
};
