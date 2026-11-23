import type { Internship } from '../types/internship';
import type { CalendarEvent } from '../types/event';

function sortKey(event: CalendarEvent): string {
  return `${event.date}T${event.time || '23:59'}`;
}

export function compareEvents(a: CalendarEvent, b: CalendarEvent): number {
  return sortKey(a).localeCompare(sortKey(b));
}

/** Merges user reminders with application deadlines for internships the student hasn't applied to yet. */
export function buildCalendarEvents(internships: Internship[], events: CalendarEvent[]): CalendarEvent[] {
  const deadlines: CalendarEvent[] = internships.
  filter((i) => i.status === 'Saved').
  map((i) => ({
    id: `deadline-${i.id}`,
    internshipId: i.id,
    company: i.company,
    title: `${i.position} — application due`,
    type: 'Deadline',
    date: i.deadline,
    time: '23:59',
    notes: i.notes || 'Saved in My Internships. Submit before the deadline.',
    derived: true
  }));
  return [...deadlines, ...events].sort(compareEvents);
}