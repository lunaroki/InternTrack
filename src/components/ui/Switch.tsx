import React from 'react';

interface SwitchProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ id, label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <p id={`${id}-desc`} className="mt-0.5 text-sm text-ink-muted">
          {description}
        </p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-desc`}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
        checked ? 'bg-brand-600' : 'bg-line-strong'}`
        }>
        
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ease-out ${
          checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`
          } />
        
      </button>
    </div>);

}