import React from 'react';
import { CalendarIcon, ExternalLinkIcon, MapPinIcon, PencilIcon, SendIcon, Trash2Icon } from 'lucide-react';
import type { Internship } from '../../types/internship';
import { CompanyAvatar } from '../ui/CompanyAvatar';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { daysUntil, formatDate, relativeDayLabel } from '../../utils/date';

interface InternshipCardProps {
  internship: Internship;
  onEdit: (i: Internship) => void;
  onDelete: (i: Internship) => void;
  onRecord: (i: Internship) => void;
  onView: (i: Internship) => void;
}

const iconBtn =
'grid h-8 w-8 place-items-center rounded-lg text-ink-subtle transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400';

export function InternshipCard({ internship: i, onEdit, onDelete, onRecord, onView }: InternshipCardProps) {
  const d = daysUntil(i.deadline);
  const isOpen = i.status === 'Saved';
  const deadlineTone = !isOpen ?
  'text-ink-muted' :
  d < 0 ?
  'text-danger font-medium' :
  d <= 7 ?
  'text-event-deadline-fg font-medium' :
  'text-ink-muted';
  const deadlineNote = isOpen ? d < 0 ? 'Deadline passed' : relativeDayLabel(i.deadline) : null;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <CompanyAvatar name={i.company} />
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold text-ink">{i.company}</h3>
            <p className="truncate text-sm text-ink-muted">{i.position}</p>
          </div>
        </div>
        <StatusBadge status={i.status} />
      </div>

      <dl className="mt-4 space-y-2 text-[13px]">
        <div className="flex items-center gap-2 text-ink-muted">
          <dt className="sr-only">Location</dt>
          <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
          <dd className="truncate">
            {i.location} · {i.workMode}
          </dd>
        </div>
        <div className={`flex items-center gap-2 ${deadlineTone}`}>
          <dt className="sr-only">Deadline</dt>
          <CalendarIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <dd>
            Due {formatDate(i.deadline)}
            {deadlineNote && <span> · {deadlineNote}</span>}
          </dd>
        </div>
      </dl>

      <p className="mb-5 mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
        {i.description || 'No description added.'}
      </p>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4">
        <a
          href={i.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          
          Application link
          <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">for {i.company} (opens in new tab)</span>
        </a>
        <div className="flex items-center gap-1">
          {isOpen ?
          <Button size="sm" variant="secondary" leftIcon={<SendIcon />} onClick={() => onRecord(i)}>
              Mark applied
            </Button> :

          <Button size="sm" variant="ghost" onClick={() => onView(i)}>
              Track
            </Button>
          }
          <button
            type="button"
            onClick={() => onEdit(i)}
            aria-label={`Edit ${i.company} internship`}
            className={`${iconBtn} hover:bg-canvas hover:text-ink`}>
            
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(i)}
            aria-label={`Delete ${i.company} internship`}
            className={`${iconBtn} hover:bg-danger-soft hover:text-danger`}>
            
            <Trash2Icon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>);

}