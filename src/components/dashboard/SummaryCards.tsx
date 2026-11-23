import React from "react";
import { Link } from "react-router-dom";
import { AlarmClockIcon, AwardIcon, MessagesSquareIcon, SendIcon, BoxIcon } from "lucide-react";
import { Internship } from "../../types/internship";
import { CalendarEvent } from "../../types/event";
import { daysUntil, formatDate, relativeDayLabel } from "../../utils/date";
interface SummaryCardsProps {
  internships: Internship[];
  events: CalendarEvent[];
}
interface Metric {
  label: string;
  value: number;
  detail: string;
  to: string;
  icon: BoxIcon;
  iconClass: string;
}
export function SummaryCards({
  internships,
  events
}: SummaryCardsProps) {
  const applied = internships.filter((i) => i.status !== 'Saved');
  const saved = internships.length - applied.length;
  const interviews = events.filter((e) => e.type === 'Interview' && daysUntil(e.date) >= 0);
  const offers = internships.filter((i) => i.status === 'Offered');
  const deadlines = events.filter((e) => {
    const d = daysUntil(e.date);
    return e.type === 'Deadline' && d >= 0 && d <= 30;
  });
  const metrics: Metric[] = [{
    label: 'Total Applications',
    value: applied.length,
    detail: `${saved} saved, not yet applied`,
    to: '/applications',
    icon: SendIcon,
    iconClass: 'bg-brand-50 text-brand-700'
  }, {
    label: 'Interviews Scheduled',
    value: interviews.length,
    detail: interviews[0] ? `Next: ${interviews[0].company} · ${formatDate(interviews[0].date, 'MMM d')}` : 'None scheduled yet',
    to: '/calendar',
    icon: MessagesSquareIcon,
    iconClass: 'bg-event-interview-bg text-event-interview-fg'
  }, {
    label: 'Offers Received',
    value: offers.length,
    detail: offers.length ? offers.map((o) => o.company).join(', ') : 'Keep going — offers take time',
    to: '/applications?status=Offered',
    icon: AwardIcon,
    iconClass: 'bg-status-offered-bg text-status-offered-fg'
  }, {
    label: 'Upcoming Deadlines',
    value: deadlines.length,
    detail: deadlines[0] ? `Next: ${deadlines[0].company} · ${relativeDayLabel(deadlines[0].date)}` : 'Nothing due in the next 30 days',
    to: '/calendar',
    icon: AlarmClockIcon,
    iconClass: 'bg-event-deadline-bg text-event-deadline-fg'
  }];
  return <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Summary">
      {metrics.map((m) => <li key={m.label}>
          <Link to={m.to} className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-150 hover:border-brand-200 hover:shadow-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-ink-muted">{m.label}</span>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${m.iconClass}`}>
                <m.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
            </div>
            <span className="mt-2 text-[32px] font-semibold leading-none tracking-tight tabular-nums text-ink">
              {m.value}
            </span>
            <span className="mt-3 truncate text-[13px] text-ink-subtle">{m.detail}</span>
          </Link>
        </li>)}
    </ul>;
}