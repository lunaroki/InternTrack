import React, { useMemo } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek } from
'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { CalendarEvent } from '../../types/event';
import { eventStyles } from '../../utils/status';
import { TODAY_ISO, getToday, toISODate } from '../../utils/date';

interface MonthGridProps {
  month: Date;
  onMonthChange: (month: Date) => void;
  events: CalendarEvent[];
  selectedDate: string;
  selectedEventId: string | null;
  onSelectDate: (iso: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MonthGrid({
  month,
  onMonthChange,
  events,
  selectedDate,
  selectedEventId,
  onSelectDate,
  onSelectEvent
}: MonthGridProps) {
  const days = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(startOfMonth(month)), end: endOfWeek(endOfMonth(month)) }),
    [month]
  );
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => map.set(e.date, [...(map.get(e.date) ?? []), e]));
    return map;
  }, [events]);

  const navBtn =
  'grid h-9 w-9 place-items-center rounded-lg border border-line-strong bg-surface text-ink-muted transition-colors duration-150 hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400';

  return (
    <section aria-label="Monthly calendar" className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold text-ink" aria-live="polite">
          {format(month, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onMonthChange(startOfMonth(getToday()));
              onSelectDate(TODAY_ISO);
            }}
            className="h-9 rounded-lg border border-line-strong bg-surface px-3 text-sm font-medium text-ink transition-colors duration-150 hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
            
            Today
          </button>
          <button type="button" aria-label="Previous month" onClick={() => onMonthChange(addMonths(month, -1))} className={navBtn}>
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Next month" onClick={() => onMonthChange(addMonths(month, 1))} className={navBtn}>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-line bg-canvas text-center text-xs font-medium text-ink-subtle">
        {WEEKDAYS.map((d) =>
        <div key={d} className="py-2">
            <span className="sm:hidden">{d[0]}</span>
            <span className="hidden sm:inline">{d}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 border-t border-line">
        {days.map((day, idx) => {
          const iso = toISODate(day);
          const dayEvents = byDate.get(iso) ?? [];
          const inMonth = isSameMonth(day, month);
          const isToday = iso === TODAY_ISO;
          const isSelected = iso === selectedDate;
          const visible = dayEvents.slice(0, 2);
          const extra = dayEvents.length - visible.length;
          return (
            <div
              key={iso}
              className={`relative min-h-[68px] border-line p-1.5 sm:min-h-[112px] sm:p-2 ${
              idx % 7 !== 6 ? 'border-r' : ''} ${
              idx < days.length - 7 ? 'border-b' : ''} ${inMonth ? 'bg-surface' : 'bg-canvas/70'} ${
              isSelected ? 'ring-2 ring-inset ring-brand-400' : ''}`
              }>
              
              <button
                type="button"
                onClick={() => onSelectDate(iso)}
                aria-label={`${format(day, 'EEEE, MMMM d')}${dayEvents.length ? `, ${dayEvents.length} events` : ', no events'}`}
                aria-pressed={isSelected}
                className="absolute inset-0 transition-colors duration-150 hover:bg-brand-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500" />
              
              <span
                aria-hidden="true"
                className={`pointer-events-none relative grid h-6 w-6 place-items-center rounded-full text-xs font-medium tabular-nums sm:h-7 sm:w-7 sm:text-[13px] ${
                isToday ? 'bg-brand-600 text-white' : inMonth ? 'text-ink' : 'text-ink-subtle'}`
                }>
                
                {format(day, 'd')}
              </span>

              <div className="pointer-events-none relative mt-1 flex flex-wrap gap-1 sm:hidden">
                {dayEvents.slice(0, 3).map((e) =>
                <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${eventStyles[e.type].dot}`} />
                )}
              </div>

              <div className="relative mt-1 hidden space-y-1 sm:block">
                {visible.map((e) =>
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onSelectEvent(e)}
                  className={`flex w-full items-center gap-1.5 truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium transition-[box-shadow] duration-150 hover:ring-1 hover:ring-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  eventStyles[e.type].chip} ${
                  selectedEventId === e.id ? 'ring-1 ring-current' : ''}`}>
                  
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${eventStyles[e.type].dot}`} aria-hidden="true" />
                    <span className="truncate">
                      {e.company} · {e.type}
                    </span>
                  </button>
                )}
                {extra > 0 &&
                <button
                  type="button"
                  onClick={() => onSelectDate(iso)}
                  className="rounded px-1.5 text-[11px] font-medium text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
                  
                    +{extra} more
                  </button>
                }
              </div>
            </div>);

        })}
      </div>
    </section>);

}