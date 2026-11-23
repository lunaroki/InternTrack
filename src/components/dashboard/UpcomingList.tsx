import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheckIcon } from 'lucide-react';
import type { CalendarEvent } from '../../types/event';
import { EventListItem } from '../calendar/EventListItem';
import { EmptyState } from '../ui/EmptyState';

interface UpcomingListProps {
  events: CalendarEvent[];
  onSelect: (event: CalendarEvent) => void;
}

export function UpcomingList({ events, onSelect }: UpcomingListProps) {
  return (
    <section
      aria-labelledby="upcoming-heading"
      className="flex h-full flex-col rounded-2xl border border-line bg-surface shadow-card">
      
      <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-5 sm:px-6">
        <h2 id="upcoming-heading" className="text-base font-semibold text-ink">
          Upcoming Deadlines & Interviews
        </h2>
        <Link
          to="/calendar"
          className="shrink-0 whitespace-nowrap text-sm font-medium text-brand-700 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded">
          
          Calendar
        </Link>
      </div>
      {events.length === 0 ?
      <EmptyState
        compact
        icon={CalendarCheckIcon}
        title="You're all caught up"
        description="No deadlines or interviews coming up. Add a reminder from the calendar." /> :


      <ul className="px-2 pb-3 sm:px-3">
          {events.map((e) =>
        <li key={e.id}>
              <EventListItem event={e} onSelect={onSelect} />
            </li>
        )}
        </ul>
      }
    </section>);

}