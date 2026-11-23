import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { KeyRoundIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Field, describedBy } from '../components/ui/Field';
import { PasswordInput } from '../components/auth/PasswordInput';
import { useAppData } from '../hooks/useAppData';
import type { UserProfile } from '../types/user';
import { EMAIL_PATTERN, inputClass } from '../utils/formStyles';

type ProfileErrors = Partial<Record<keyof UserProfile, string>>;

interface PasswordValues {
  current: string;
  next: string;
  confirm: string;
}

const textFields: {key: keyof UserProfile;label: string;type?: string;autoComplete?: string;span?: boolean;}[] = [
{ key: 'firstName', label: 'First name', autoComplete: 'given-name' },
{ key: 'lastName', label: 'Last name', autoComplete: 'family-name' },
{ key: 'email', label: 'Email address', type: 'email', autoComplete: 'email', span: true },
{ key: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel' },
{ key: 'graduationYear', label: 'Expected graduation' },
{ key: 'university', label: 'University', autoComplete: 'organization' },
{ key: 'major', label: 'Major / degree' }];


export function Profile() {
  const { user, updateProfile, internships } = useAppData();
  const [values, setValues] = useState<UserProfile>(user);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [pw, setPw] = useState<PasswordValues>({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<Partial<PasswordValues>>({});

  useEffect(() => setValues(user), [user]);

  const dirty = (Object.keys(values) as (keyof UserProfile)[]).some((k) => values[k] !== user[k]);

  const saveProfile = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e: ProfileErrors = {};
    if (!values.firstName.trim()) e.firstName = 'First name is required.';
    if (!values.lastName.trim()) e.lastName = 'Last name is required.';
    if (!EMAIL_PATTERN.test(values.email.trim())) e.email = 'Enter a valid email address.';
    if (values.graduationYear && !/^\d{4}$/.test(values.graduationYear)) e.graduationYear = 'Use a 4-digit year, e.g. 2028.';
    setErrors(e);
    if (Object.keys(e).length) return;
    updateProfile({ ...values, email: values.email.trim() });
    toast.success('Profile saved');
  };

  const changePassword = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e: Partial<PasswordValues> = {};
    if (!pw.current) e.current = 'Enter your current password.';
    if (pw.next.length < 8) e.next = 'Use at least 8 characters.';else
    if (pw.next === pw.current) e.next = 'Choose a password you haven’t used here.';
    if (pw.confirm !== pw.next) e.confirm = "Passwords don't match.";
    setPwErrors(e);
    if (Object.keys(e).length) return;
    setPw({ current: '', next: '', confirm: '' });
    toast.success('Password updated', { description: "You'll stay signed in on this device." });
  };

  const applied = internships.filter((i) => i.status !== 'Saved').length;

  return (
    <div className="space-y-6">
      <PageHeader title="My Profile" description="Keep your contact details current so reminders reach you." />

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6 shadow-card">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-100 text-xl font-semibold text-brand-800">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
          <h2 className="mt-4 text-lg font-semibold text-ink">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-sm text-ink-muted">{user.email}</p>
          <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-subtle">University</dt>
              <dd className="text-right text-ink">{user.university || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-subtle">Class of</dt>
              <dd className="text-ink">{user.graduationYear || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-subtle">Applications</dt>
              <dd className="tabular-nums text-ink">{applied}</dd>
            </div>
          </dl>
        </aside>

        <div className="space-y-6">
          <form onSubmit={saveProfile} noValidate className="rounded-2xl border border-line bg-surface shadow-card">
            <div className="border-b border-line px-6 py-5">
              <h2 className="text-base font-semibold text-ink">Personal information</h2>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
              {textFields.map((f) =>
              <Field
                key={f.key}
                label={f.label}
                htmlFor={`p-${f.key}`}
                error={errors[f.key]}
                className={f.span ? 'sm:col-span-2' : ''}>
                
                  <input
                  id={`p-${f.key}`}
                  type={f.type ?? 'text'}
                  autoComplete={f.autoComplete}
                  value={values[f.key]}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [f.key]: e.target.value }));
                    if (errors[f.key]) setErrors((x) => ({ ...x, [f.key]: undefined }));
                  }}
                  className={inputClass(!!errors[f.key])}
                  aria-invalid={!!errors[f.key]}
                  aria-describedby={describedBy(`p-${f.key}`, errors[f.key])} />
                
                </Field>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-line px-6 py-4">
              {dirty && <span className="text-[13px] text-ink-subtle">Unsaved changes</span>}
              <Button variant="secondary" disabled={!dirty} onClick={() => {setValues(user);setErrors({});}}>
                Discard
              </Button>
              <Button type="submit" disabled={!dirty}>
                Save Changes
              </Button>
            </div>
          </form>

          <form onSubmit={changePassword} noValidate className="rounded-2xl border border-line bg-surface shadow-card">
            <div className="flex items-center gap-3 border-b border-line px-6 py-5">
              <KeyRoundIcon className="h-4 w-4 text-ink-subtle" aria-hidden="true" />
              <h2 className="text-base font-semibold text-ink">Change password</h2>
            </div>
            <div className="grid gap-5 px-6 py-6 sm:grid-cols-3">
              {(
              [
              ['current', 'Current password', 'current-password'],
              ['next', 'New password', 'new-password'],
              ['confirm', 'Confirm new password', 'new-password']] as
              const).
              map(([key, label, ac]) =>
              <Field key={key} label={label} htmlFor={`pw-${key}`} error={pwErrors[key]}>
                  <PasswordInput
                  id={`pw-${key}`}
                  autoComplete={ac}
                  value={pw[key]}
                  onChange={(e) => {
                    setPw((v) => ({ ...v, [key]: e.target.value }));
                    if (pwErrors[key]) setPwErrors((x) => ({ ...x, [key]: undefined }));
                  }}
                  hasError={!!pwErrors[key]}
                  aria-invalid={!!pwErrors[key]}
                  aria-describedby={describedBy(`pw-${key}`, pwErrors[key])} />
                
                </Field>
              )}
            </div>
            <div className="flex justify-end border-t border-line px-6 py-4">
              <Button type="submit" variant="secondary">
                Update password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>);

}