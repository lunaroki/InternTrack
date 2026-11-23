import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../types/internship';
import type { ApplicationStatus } from '../../types/internship';
import { statusStyles } from '../../utils/status';

interface StatusSelectProps {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  label: string;
}

export function StatusSelect({ value, onChange, label }: StatusSelectProps) {
  const s = statusStyles[value];
  return (
    <div className="relative inline-flex">
      <span className={`pointer-events-none absolute left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${s.dot}`} />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as ApplicationStatus)}
        className={`cursor-pointer appearance-none rounded-full py-1 pl-6 pr-7 text-xs font-medium transition-[box-shadow] duration-150 hover:ring-2 hover:ring-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${s.badge}`}>
        
        {APPLICATION_STATUSES.map((status) =>
        <option key={status} value={status}>
            {status}
          </option>
        )}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-70"
        aria-hidden="true" />
      
    </div>);

}