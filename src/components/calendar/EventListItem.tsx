import React from 'react';
import type { CalendarEvent } from '../../types/event';
import { EventTypeBadge } from '../ui/EventTypeBadge';
import { daysUntil, formatDate, formatTime, relativeDayLabel } from '../../utils/date';

interface EventListItemProps {
  event: CalendarEvent;
  onSelect?: (event: CalendarEvent) => void;
  selected?: boolean;
}

export function EventListItem({ event, onSelect, selected }: EventListItemProps) {
  const d = daysUntil(event.date);
  const soon = d >= 0 && d <= 3;
  const content =
  <>
      <div className="flex w-11 shrink-0 flex-col items-center rounded-lg border border-line bg-surface py-1">
        <span className="text-[10px] font-semibold uppercase text-ink-subtle">{formatDate(event.date, 'MMM')}</span>
        <span className="text-base font-semibold leading-tight tabular-nums text-ink">{formatDate(event.date, 'd')}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{event.title}</p>
        <p className="truncate text-[13px] text-ink-muted">{event.company}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
          <EventTypeBadge type={event.type} />
          <span>{event.type === 'Deadline' && event.derived ? 'by 11:59 PM' : formatTime(event.time)}</span>
          <span aria-hidden="true">·</span>
          <span className={soon ? 'font-medium text-event-deadline-fg' : ''}>{relativeDayLabel(event.date)}</span>
        </div>
      </div>
    </>;


  if (!onSelect) return <div className="flex gap-3 px-3 py-3">{content}</div>;

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      aria-pressed={selected}
      className={`flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
      selected ? 'bg-brand-50' : 'hover:bg-canvas'}`
      }>
      
      {content}
    </button>);

}