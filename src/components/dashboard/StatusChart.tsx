import React from 'react';
import { Link } from 'react-router-dom';
import { APPLICATION_STATUSES } from '../../types/internship';
import type { Internship } from '../../types/internship';
import { statusStyles } from '../../utils/status';

export function StatusChart({ internships }: {internships: Internship[];}) {
  const total = internships.length;
  const counts = APPLICATION_STATUSES.map((status) => ({
    status,
    count: internships.filter((i) => i.status === status).length
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));
  const inProgress = internships.filter((i) => i.status === 'Applied' || i.status === 'Interviewing').length;
  const responded = internships.filter((i) => ['Interviewing', 'Offered', 'Rejected'].includes(i.status)).length;
  const appliedTotal = internships.filter((i) => i.status !== 'Saved').length;
  const responseRate = appliedTotal ? Math.round(responded / appliedTotal * 100) : 0;

  return (
    <section
      aria-labelledby="pipeline-heading"
      className="h-full rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="pipeline-heading" className="text-base font-semibold text-ink">
            Applications by status
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            {total} opportunities tracked · {inProgress} in progress
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold tabular-nums text-ink">{responseRate}%</p>
          <p className="text-xs text-ink-subtle">response rate</p>
        </div>
      </div>

      <div
        className="mt-6 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-canvas"
        role="img"
        aria-label={`Status breakdown: ${counts.map((c) => `${c.status} ${c.count}`).join(', ')}`}>
        
        {counts.
        filter((c) => c.count > 0).
        map((c) =>
        <div
          key={c.status}
          className={`h-full transition-[width] duration-300 ease-out ${statusStyles[c.status].dot}`}
          style={{ width: `${c.count / Math.max(1, total) * 100}%` }} />

        )}
      </div>

      <ul className="mt-5 space-y-0.5">
        {counts.map((c) =>
        <li key={c.status}>
            <Link
            to={`/applications?status=${c.status}`}
            aria-label={`${c.status}: ${c.count}. View ${c.status.toLowerCase()} applications`}
            className="group -mx-2 grid grid-cols-[112px_minmax(0,1fr)_32px] items-center gap-4 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
            
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[c.status].dot}`} aria-hidden="true" />
                {c.status}
              </span>
              <span className="h-2 overflow-hidden rounded-full bg-canvas group-hover:bg-line" aria-hidden="true">
                <span
                className={`block h-full rounded-full transition-[width] duration-300 ease-out ${statusStyles[c.status].dot}`}
                style={{ width: `${c.count / max * 100}%` }} />
              
              </span>
              <span className="text-right text-sm font-semibold tabular-nums text-ink">{c.count}</span>
            </Link>
          </li>
        )}
      </ul>
    </section>);

}