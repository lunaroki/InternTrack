import { AlarmClockIcon, MessagesSquareIcon, MailIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { APPLICATION_STATUSES } from '../types/internship';
import type { ApplicationStatus } from '../types/internship';
import type { EventType } from '../types/event';

export const statusStyles: Record<ApplicationStatus, {badge: string;dot: string;}> = {
  Saved: { badge: 'bg-status-saved-bg text-status-saved-fg', dot: 'bg-status-saved-dot' },
  Applied: { badge: 'bg-status-applied-bg text-status-applied-fg', dot: 'bg-status-applied-dot' },
  Interviewing: {
    badge: 'bg-status-interviewing-bg text-status-interviewing-fg',
    dot: 'bg-status-interviewing-dot'
  },
  Offered: { badge: 'bg-status-offered-bg text-status-offered-fg', dot: 'bg-status-offered-dot' },
  Rejected: { badge: 'bg-status-rejected-bg text-status-rejected-fg', dot: 'bg-status-rejected-dot' }
};

export const defaultNextAction: Record<ApplicationStatus, string> = {
  Saved: 'Submit application',
  Applied: 'Follow up with recruiter',
  Interviewing: 'Prepare for interview',
  Offered: 'Respond to offer',
  Rejected: 'Request feedback'
};

export const eventStyles: Record<EventType, {chip: string;dot: string;icon: LucideIcon;}> = {
  Deadline: { chip: 'bg-event-deadline-bg text-event-deadline-fg', dot: 'bg-event-deadline-dot', icon: AlarmClockIcon },
  Interview: {
    chip: 'bg-event-interview-bg text-event-interview-fg',
    dot: 'bg-event-interview-dot',
    icon: MessagesSquareIcon
  },
  'Follow-up': { chip: 'bg-event-followup-bg text-event-followup-fg', dot: 'bg-event-followup-dot', icon: MailIcon }
};

export function isApplicationStatus(value: string | null): value is ApplicationStatus {
  return value !== null && (APPLICATION_STATUSES as readonly string[]).includes(value);
}