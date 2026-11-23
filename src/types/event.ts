export const EVENT_TYPES = ['Deadline', 'Interview', 'Follow-up'] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface CalendarEvent {
  id: string;
  internshipId: string | null;
  company: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  notes: string;
  derived?: boolean;
}

export type CalendarEventInput = Omit<CalendarEvent, 'id' | 'derived'>;