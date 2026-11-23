import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, Building2Icon, CalendarIcon, ClockIcon, StickyNoteIcon, Trash2Icon, XIcon } from 'lucide-react';
import type { CalendarEvent } from '../../types/event';
import type { Internship } from '../../types/internship';
import { EventTypeBadge } from '../ui/EventTypeBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { formatDate, formatTime, relativeDayLabel } from '../../utils/date';

interface EventDetailPanelProps {
  event: CalendarEvent;
  internship?: Internship;
  onClose: () => void;
  onDelete: (event: CalendarEvent) => void;
}

export function EventDetailPanel({ event, internship, onClose, onDelete }: EventDetailPanelProps) {
  return (
    <section aria-labelledby="event-detail-title" className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <EventTypeBadge type={event.type} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="-mr-1.5 -mt-1 grid h-8 w-8 place-items-center rounded-lg text-ink-subtle transition-colors duration-150 hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <h2 id="event-detail-title" className="mt-3 text-lg font-semibold leading-snug text-ink">
        {event.title}
      </h2>

      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex gap-3">
          <dt className="sr-only">Company</dt>
          <Building2Icon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <dd className="flex flex-wrap items-center gap-2 text-ink">
            {event.company}
            {internship && <StatusBadge status={internship.status} />}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="sr-only">Date</dt>
          <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <dd className="text-ink">
            {formatDate(event.date, 'EEEE, MMMM d, yyyy')}
            <span className="block text-[13px] text-ink-subtle">{relativeDayLabel(event.date)}</span>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="sr-only">Time</dt>
          <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <dd className="text-ink">{event.derived ? 'Due by 11:59 PM' : formatTime(event.time)}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="sr-only">Notes</dt>
          <StickyNoteIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
          <dd className={`leading-relaxed ${event.notes ? 'text-ink-muted' : 'text-ink-subtle'}`}>
            {event.notes || 'No notes added.'}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
        {internship ?
        <Link
          to={event.derived ? '/internships' : `/applications?open=${internship.id}`}
          className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          
            {event.derived ? 'Open in My Internships' : 'View application'}
            <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link> :

        <span />
        }
        {event.derived ?
        <span className="text-xs text-ink-subtle">Clears once you apply</span> :

        <Button size="sm" variant="ghost" leftIcon={<Trash2Icon />} onClick={() => onDelete(event)} className="text-danger hover:bg-danger-soft hover:text-danger">
            Delete
          </Button>
        }
      </div>
    </section>);

}