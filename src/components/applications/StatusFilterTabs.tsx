import React from 'react';
import { APPLICATION_STATUSES } from '../../types/internship';
import type { ApplicationStatus } from '../../types/internship';
import { statusStyles } from '../../utils/status';

export type StatusFilter = ApplicationStatus | 'All';

interface StatusFilterTabsProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  counts: Record<StatusFilter, number>;
}

export function StatusFilterTabs({ value, onChange, counts }: StatusFilterTabsProps) {
  const options: StatusFilter[] = ['All', ...APPLICATION_STATUSES];
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div role="group" aria-label="Filter by status" className="inline-flex gap-1 rounded-xl border border-line bg-surface p-1">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt)}
              className={`inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              selected ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-canvas hover:text-ink'}`
              }>
              
              {opt !== 'All' &&
              <span className={`h-2 w-2 rounded-full ${statusStyles[opt].dot}`} aria-hidden="true" />
              }
              {opt}
              <span className={`text-xs tabular-nums ${selected ? 'text-brand-700' : 'text-ink-subtle'}`}>
                {counts[opt]}
              </span>
            </button>);

        })}
      </div>
    </div>);

}