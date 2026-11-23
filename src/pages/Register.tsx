import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordInput } from '../components/auth/PasswordInput';
import { Field, describedBy } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAppData } from '../hooks/useAppData';
import { EMAIL_PATTERN, inputClass } from '../utils/formStyles';

interface Values {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
}

type Errors = Partial<Record<keyof Values, string>>;

function passwordStrength(pw: string): {label: string;score: number;} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const label = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score];
  return { label, score };
}

export function Register() {
  const { isAuthenticated, register } = useAppData();
  const navigate = useNavigate();
  const [values, setValues] = useState<Values>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    agree: false
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const set = <K extends keyof Values,>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const strength = passwordStrength(values.password);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!values.firstName.trim()) e.firstName = 'Enter your first name.';
    if (!values.lastName.trim()) e.lastName = 'Enter your last name.';
    if (!values.email.trim()) e.email = 'Enter your university email.';else
    if (!EMAIL_PATTERN.test(values.email.trim())) e.email = 'Enter a valid email, like name@university.edu.';
    if (values.password.length < 8) e.password = 'Use at least 8 characters.';
    if (!values.confirm) e.confirm = 'Re-enter your password.';else
    if (values.confirm !== values.password) e.confirm = "Passwords don't match.";
    if (!values.agree) e.agree = 'Please accept the terms to continue.';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    window.setTimeout(() => {
      register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim()
      });
      toast.success('Your account is ready', { description: "We've loaded sample internships so you can explore." });
      navigate('/dashboard');
    }, 700);
  };

  const meterColor = ['bg-line', 'bg-status-rejected-dot', 'bg-status-interviewing-dot', 'bg-brand-500', 'bg-status-offered-dot'][
  strength.score];


  return (
    <AuthShell
      title="Create your account"
      subtitle="Free for students. Takes less than a minute."
      footer={
      <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
            Log in
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="reg-first" error={errors.firstName}>
            <input
              id="reg-first"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              className={inputClass(!!errors.firstName)}
              aria-invalid={!!errors.firstName}
              aria-describedby={describedBy('reg-first', errors.firstName)} />
            
          </Field>
          <Field label="Last name" htmlFor="reg-last" error={errors.lastName}>
            <input
              id="reg-last"
              autoComplete="family-name"
              value={values.lastName}
              onChange={(e) => set('lastName', e.target.value)}
              className={inputClass(!!errors.lastName)}
              aria-invalid={!!errors.lastName}
              aria-describedby={describedBy('reg-last', errors.lastName)} />
            
          </Field>
        </div>
        <Field label="University email" htmlFor="reg-email" error={errors.email}>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="name@university.edu"
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('reg-email', errors.email)} />
          
        </Field>
        <Field label="Password" htmlFor="reg-password" error={errors.password}>
          <PasswordInput
            id="reg-password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => set('password', e.target.value)}
            hasError={!!errors.password}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'reg-password-error' : 'reg-password-strength'} />
          
          {!errors.password &&
          <div id="reg-password-strength" className="flex items-center gap-3 pt-0.5">
              <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden="true">
                {[1, 2, 3, 4].map((n) =>
              <span key={n} className={`h-1 rounded-full transition-colors duration-150 ${n <= strength.score ? meterColor : 'bg-line'}`} />
              )}
              </div>
              <span className="w-16 text-right text-xs text-ink-subtle">
                {values.password ? strength.label : '8+ characters'}
              </span>
            </div>
          }
        </Field>
        <Field label="Confirm password" htmlFor="reg-confirm" error={errors.confirm}>
          <PasswordInput
            id="reg-confirm"
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => set('confirm', e.target.value)}
            hasError={!!errors.confirm}
            aria-invalid={!!errors.confirm}
            aria-describedby={describedBy('reg-confirm', errors.confirm)} />
          
        </Field>
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={values.agree}
              onChange={(e) => set('agree', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-brand-600"
              aria-invalid={!!errors.agree}
              aria-describedby={errors.agree ? 'reg-agree-error' : undefined} />
            
            I agree to the Terms of Use and understand authorized career services staff may view my progress.
          </label>
          {errors.agree &&
          <p id="reg-agree-error" className="mt-1.5 text-[13px] text-danger">
              {errors.agree}
            </p>
          }
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>);

}