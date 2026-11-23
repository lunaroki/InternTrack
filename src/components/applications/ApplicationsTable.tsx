import React from 'react';
import { EyeIcon, PencilIcon, SendIcon } from 'lucide-react';
import type { ApplicationStatus, Internship } from '../../types/internship';
import { CompanyAvatar } from '../ui/CompanyAvatar';
import { StatusSelect } from '../ui/StatusSelect';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/date';

interface ApplicationsTableProps {
  rows: Internship[];
  onView: (i: Internship) => void;
  onEdit: (i: Internship) => void;
  onRecord: (i: Internship) => void;
  onStatusChange: (i: Internship, status: ApplicationStatus) => void;
}

const iconBtn =
'grid h-8 w-8 place-items-center rounded-lg text-ink-subtle transition-colors duration-150 hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400';

function NextAction({ row }: {row: Internship;}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-ink">{row.nextAction || '—'}</p>
      {row.status === 'Saved' && <p className="text-xs text-ink-subtle">Due {formatDate(row.deadline, 'MMM d')}</p>}
    </div>);

}

export function ApplicationsTable({ rows, onView, onEdit, onRecord, onStatusChange }: ApplicationsTableProps) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs text-ink-subtle">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">Company Name</th>
              <th scope="col" className="px-4 py-3 font-medium">Position</th>
              <th scope="col" className="px-4 py-3 font-medium">Date Applied</th>
              <th scope="col" className="px-4 py-3 font-medium">Application Status</th>
              <th scope="col" className="px-4 py-3 font-medium">Next Action</th>
              <th scope="col" className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) =>
            <tr key={row.id} className="align-middle">
                <td className="px-6 py-3.5">
                  <button
                  type="button"
                  onClick={() => onView(row)}
                  className="flex items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
                  
                    <CompanyAvatar name={row.company} size="sm" />
                    <span>
                      <span className="block font-medium text-ink hover:text-brand-700">{row.company}</span>
                      <span className="block text-xs text-ink-subtle">{row.location}</span>
                    </span>
                  </button>
                </td>
                <td className="max-w-[220px] px-4 py-3.5 text-ink-muted">
                  <span className="line-clamp-2">{row.position}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-ink-muted">
                  {row.dateApplied ? formatDate(row.dateApplied) : <span className="text-ink-subtle">Not applied</span>}
                </td>
                <td className="px-4 py-3.5">
                  <StatusSelect
                  value={row.status}
                  label={`Application status for ${row.company}`}
                  onChange={(s) => onStatusChange(row, s)} />
                
                </td>
                <td className="max-w-[220px] px-4 py-3.5">
                  <NextAction row={row} />
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    {row.status === 'Saved' &&
                  <Button size="sm" variant="secondary" leftIcon={<SendIcon />} onClick={() => onRecord(row)}>
                        Record
                      </Button>
                  }
                    <button type="button" onClick={() => onView(row)} aria-label={`View ${row.company} details`} className={iconBtn}>
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onEdit(row)} aria-label={`Edit ${row.company} record`} className={iconBtn}>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {rows.map((row) =>
        <li key={row.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <button type="button" onClick={() => onView(row)} className="flex min-w-0 items-start gap-3 text-left">
                <CompanyAvatar name={row.company} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">{row.company}</span>
                  <span className="block truncate text-[13px] text-ink-muted">{row.position}</span>
                </span>
              </button>
              <StatusSelect value={row.status} label={`Status for ${row.company}`} onChange={(s) => onStatusChange(row, s)} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-xs text-ink-subtle">Date applied</p>
                <p className="text-ink">{row.dateApplied ? formatDate(row.dateApplied) : 'Not applied'}</p>
              </div>
              <div>
                <p className="text-xs text-ink-subtle">Next action</p>
                <NextAction row={row} />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              {row.status === 'Saved' &&
            <Button size="sm" variant="secondary" onClick={() => onRecord(row)}>
                  Record
                </Button>
            }
              <Button size="sm" variant="ghost" onClick={() => onView(row)}>
                View details
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onEdit(row)}>
                Edit
              </Button>
            </div>
          </li>
        )}
      </ul>
    </>);

}