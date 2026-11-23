import React from 'react';
import { AlertCircleIcon } from 'lucide-react';

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, error, hint, required, trailing, children, className = '' }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
          {label}
          {required &&
          <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          }
        </label>
        {trailing}
      </div>
      {children}
      {error ?
      <p id={`${htmlFor}-error`} className="flex items-center gap-1.5 text-[13px] text-danger">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p> :

      hint &&
      <p id={`${htmlFor}-hint`} className="text-[13px] text-ink-subtle">
            {hint}
          </p>

      }
    </div>);

}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}