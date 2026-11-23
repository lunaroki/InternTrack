import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { startOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { CalendarPlusIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { MonthGrid } from '../components/calendar/MonthGrid';
import { EventDetailPanel } from '../components/calendar/EventDetailPanel';
import { EventListItem } from '../components/calendar/EventListItem';
import { ReminderFormModal } from '../components/calendar/ReminderFormModal';
import type { ReminderDefaults } from '../components/calendar/ReminderFormModal';
import { useAppData } from '../hooks/useAppData';
import { EVENT_TYPES } from '../types/event';
import type { CalendarEvent, EventType } from '../types/event';
import { eventStyles } from '../utils/status';
import { TODAY_ISO, daysUntil, formatDate, getToday, parseISODate } from '../utils/date';

export function Calendar() {
  const { calendarEvents, internships, deleteEvent } = useAppData();
  const [params, setParams] = useSearchParams();
  const [month, setMonth] = useState(() => startOfMonth(getToday()));
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [visibleTypes, setVisibleTypes] = useState<EventType[]>([...EVENT_TYPES]);
  const [reminderDefaults, setReminderDefaults] = useState<ReminderDefaults | null>(null);

  const selectEvent = (e: CalendarEvent) => {
    setSelectedEventId(e.id);
    setSelectedDate(e.date);
    setMonth(startOfMonth(parseISODate(e.date)));
  };

  useEffect(() => {
    const id = params.get('event');
    if (!id) return;
    const e = calendarEvents.find((x) => x.id === id);
    if (e) selectEvent(e);
    setParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const filtered = useMemo(
    () => calendarEvents.filter((e) => visibleTypes.includes(e.type)),
    [calendarEvents, visibleTypes]
  );
  const selectedEvent = calendarEvents.find((e) => e.id === selectedEventId) ?? null;
  const dayEvents = filtered.filter((e) => e.date === selectedDate);
  const upcoming = filtered.filter((e) => daysUntil(e.date) >= 0).slice(0, 8);

  const toggleType = (t: EventType) =>
  setVisibleTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const handleDelete = (e: CalendarEvent) => {
    deleteEvent(e.id);
    setSelectedEventId(null);
    toast.success('Reminder deleted', { description: `${e.title} · ${e.company}` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar & Reminders"
        description="Deadlines from saved internships appear automatically. Add interviews and follow-ups yourself."
        actions={
        <Button leftIcon={<PlusIcon />} onClick={() => setReminderDefaults({ date: selectedDate })}>
            Add Reminder
          </Button>
        } />
      

      <div role="group" aria-label="Show event types" className="flex flex-wrap items-center gap-2">
        {EVENT_TYPES.map((t) => {
          const on = visibleTypes.includes(t);
          const count = calendarEvents.filter((e) => e.type === t && daysUntil(e.date) >= 0).length;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => toggleType(t)}
              className={`inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
              on ? 'border-line-strong bg-surface text-ink' : 'border-dashed border-line-strong bg-transparent text-ink-subtle'}`
              }>
              
              <span className={`h-2 w-2 rounded-full ${on ? eventStyles[t].dot : 'bg-line-strong'}`} aria-hidden="true" />
              {t === 'Deadline' ? 'Application deadlines' : t === 'Interview' ? 'Interviews' : 'Follow-ups'}
              <span className="text-xs tabular-nums text-ink-subtle">{count}</span>
            </button>);

        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <MonthGrid
          month={month}
          onMonthChange={setMonth}
          events={filtered}
          selectedDate={selectedDate}
          selectedEventId={selectedEventId}
          onSelectDate={(iso) => {
            setSelectedDate(iso);
            setSelectedEventId(null);
          }}
          onSelectEvent={selectEvent} />
        

        <div className="space-y-6">
          {selectedEvent ?
          <EventDetailPanel
            event={selectedEvent}
            internship={internships.find((i) => i.id === selectedEvent.internshipId)}
            onClose={() => setSelectedEventId(null)}
            onDelete={handleDelete} /> :


          <section aria-labelledby="day-heading" className="rounded-2xl border border-line bg-surface shadow-card">
              <div className="flex items-center justify-between gap-3 px-5 pb-2 pt-5">
                <div>
                  <h2 id="day-heading" className="text-base font-semibold text-ink">
                    {formatDate(selectedDate, 'EEEE, MMM d')}
                  </h2>
                  <p className="text-[13px] text-ink-subtle">
                    {dayEvents.length ? `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : 'Nothing scheduled'}
                  </p>
                </div>
                <Button
                size="sm"
                variant="secondary"
                leftIcon={<CalendarPlusIcon />}
                onClick={() => setReminderDefaults({ date: selectedDate })}>
                
                  Add
                </Button>
              </div>
              {dayEvents.length > 0 ?
            <ul className="px-2 pb-3">
                  {dayEvents.map((e) =>
              <li key={e.id}>
                      <EventListItem event={e} onSelect={selectEvent} />
                    </li>
              )}
                </ul> :

            <p className="px-5 pb-5 pt-1 text-sm text-ink-muted">Select an event to see its details, or add a reminder for this day.</p>
            }
            </section>
          }

          <section aria-labelledby="upcoming-cal-heading" className="rounded-2xl border border-line bg-surface shadow-card">
            <h2 id="upcoming-cal-heading" className="px-5 pb-2 pt-5 text-base font-semibold text-ink">
              Upcoming events
            </h2>
            {upcoming.length === 0 ?
            <p className="px-5 pb-5 text-sm text-ink-muted">No upcoming events for the selected types.</p> :

            <ul className="px-2 pb-3">
                {upcoming.map((e) =>
              <li key={e.id}>
                    <EventListItem event={e} onSelect={selectEvent} selected={e.id === selectedEventId} />
                  </li>
              )}
              </ul>
            }
          </section>
        </div>
      </div>

      <ReminderFormModal
        open={reminderDefaults !== null}
        onClose={() => setReminderDefaults(null)}
        defaults={reminderDefaults ?? undefined} />
      
    </div>);

}