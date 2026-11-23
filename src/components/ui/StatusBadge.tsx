import React from 'react';
import type { ApplicationStatus } from '../../types/internship';
import { statusStyles } from '../../utils/status';

export function StatusBadge({ status }: {status: ApplicationStatus;}) {
  const s = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>
      
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {status}
    </span>);

}