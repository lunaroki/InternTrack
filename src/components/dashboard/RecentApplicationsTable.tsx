import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { InboxIcon } from 'lucide-react';
import type { Internship } from '../../types/internship';
import { CompanyAvatar } from '../ui/CompanyAvatar';
import { StatusSelect } from '../ui/StatusSelect';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useAppData } from '../../hooks/useAppData';
import { formatDate } from '../../utils/date';

interface RecentApplicationsTableProps {
  rows: Internship[];
  onView: (id: string) => void;
}

export function RecentApplicationsTable({ rows, onView }: RecentApplicationsTableProps) {
  const { updateStatus } = useAppData();

  return (
    <section aria-labelledby="recent-heading" className="rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <div>
          <h2 id="recent-heading" className="text-base font-semibold text-ink">
            Recent Applications
          </h2>
          <p className="mt-1 text-sm text-ink-muted">Change a status right here — everything else updates.</p>
        </div>
        <Link
          to="/applications"
          className="shrink-0 whitespace-nowrap rounded text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          
          View all
        </Link>
      </div>
      {rows.length === 0 ?
      <EmptyState
        compact
        icon={InboxIcon}
        title="No applications yet"
        description="Record an application from My Internships to start tracking it." /> :


      <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-y border-line bg-canvas text-xs font-medium text-ink-subtle">
              <tr>
                <th scope="col" className="px-6 py-2.5 font-medium">Company</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Position</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Date Applied</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-6 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((row) =>
            <tr key={row.id}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <CompanyAvatar name={row.company} size="sm" />
                      <span className="font-medium text-ink">{row.company}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{row.position}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-ink-muted">
                    {row.dateApplied ? formatDate(row.dateApplied) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect
                  value={row.status}
                  label={`Status for ${row.company}`}
                  onChange={(s) => {
                    updateStatus(row.id, s);
                    toast.success(`${row.company} moved to ${s}`);
                  }} />
                
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onView(row.id)} aria-label={`View ${row.company} application`}>
                      View details
                    </Button>
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </section>);

}