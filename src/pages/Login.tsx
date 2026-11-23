import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { PasswordInput } from '../components/auth/PasswordInput';
import { Field, describedBy } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAppData } from '../hooks/useAppData';
import { demoCredentials } from '../data/user';
import { EMAIL_PATTERN, inputClass } from '../utils/formStyles';

interface Errors {
  email?: string;
  password?: string;
}

export function Login() {
  const { isAuthenticated, login } = useAppData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = (): Errors => {
    const e: Errors = {};
    if (!email.trim()) e.email = 'Enter your email address.';else
    if (!EMAIL_PATTERN.test(email.trim())) e.email = 'Enter a valid email, like name@university.edu.';
    if (!password) e.password = 'Enter your password.';else
    if (password.length < 8) e.password = 'Passwords are at least 8 characters.';
    return e;
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    window.setTimeout(() => {
      login(email.trim());
      toast.success('Welcome back!');
      navigate('/dashboard');
    }, 600);
  };

  const handleForgot = () => {
    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setErrors({ email: 'Enter your email above and we’ll send a reset link.' });
      return;
    }
    toast.success('Password reset link sent', { description: `Check ${email.trim()} for instructions.` });
  };

  return (
    <AuthShell
      title="Log in to InternTrack"
      subtitle="Pick up your internship search right where you left off."
      footer={
      <>
          New to InternTrack?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:text-brand-800">
            Create an account
          </Link>
        </>
      }>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field label="Email address" htmlFor="login-email" error={errors.email}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
            }}
            placeholder="name@university.edu"
            className={inputClass(!!errors.email)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy('login-email', errors.email)} />
          
        </Field>
        <Field
          label="Password"
          htmlFor="login-password"
          error={errors.password}
          trailing={
          <button
            type="button"
            onClick={handleForgot}
            className="rounded text-[13px] font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
            
              Forgot password?
            </button>
          }>
          
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((x) => ({ ...x, password: undefined }));
            }}
            hasError={!!errors.password}
            aria-invalid={!!errors.password}
            aria-describedby={describedBy('login-password', errors.password)} />
          
        </Field>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded accent-brand-600" />
          
          Keep me signed in on this device
        </label>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting && <Loader2Icon className="animate-spin" aria-hidden="true" />}
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
        <div className="rounded-xl border border-dashed border-line-strong bg-canvas px-4 py-3 text-[13px] text-ink-muted">
          Exploring the prototype?{' '}
          <button
            type="button"
            onClick={() => {
              setEmail(demoCredentials.email);
              setPassword(demoCredentials.password);
              setErrors({});
            }}
            className="rounded font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
            
            Fill in the demo student account
          </button>
        </div>
      </form>
    </AuthShell>);

}