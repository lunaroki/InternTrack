import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CalendarPlusIcon, CheckIcon, ExternalLinkIcon, PencilIcon, XCircleIcon } from 'lucide-react';
import type { ApplicationStatus, Internship } from '../../types/internship';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Field } from '../ui/Field';
import { StatusSelect } from '../ui/StatusSelect';
import { EventListItem } from '../calendar/EventListItem';
import { useAppData } from '../../hooks/useAppData';
import { inputClass, textareaClass } from '../../utils/formStyles';
import { TODAY_ISO, formatDate } from '../../utils/date';

interface ApplicationDetailDrawerProps {
  internshipId: string | null;
  onClose: () => void;
  onEdit: (i: Internship) => void;
  onAddEvent: (i: Internship) => void;
  onStatusChange: (i: Internship, status: ApplicationStatus) => void;
}

const stages: ApplicationStatus[] = ['Saved', 'Applied', 'Interviewing', 'Offered'];

export function ApplicationDetailDrawer({
  internshipId,
  onClose,
  onEdit,
  onAddEvent,
  onStatusChange
}: ApplicationDetailDrawerProps) {
  const { internships, calendarEvents, updateInternship } = useAppData();
  const current = internships.find((i) => i.id === internshipId) ?? null;
  const lastRef = useRef<Internship | null>(null);
  if (current) lastRef.current = current;
  const item = current ?? lastRef.current;

  const [dateApplied, setDateApplied] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!current) return;
    setDateApplied(current.dateApplied ?? '');
    setNextAction(current.nextAction);
    setNotes(current.notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, current?.status]);

  if (!item) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;

  const related = calendarEvents.filter((e) => e.internshipId === item.id);
  const stageIndex = stages.indexOf(item.status);
  const dirty =
  dateApplied !== (item.dateApplied ?? '') || nextAction !== item.nextAction || notes !== item.notes;

  const save = () => {
    updateInternship(item.id, { dateApplied: dateApplied || null, nextAction: nextAction.trim(), notes: notes.trim() });
    toast.success('Application details saved');
  };

  return (
    <Drawer
      open={Boolean(current)}
      onClose={onClose}
      title={item.company}
      subtitle={item.position}
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={save} disabled={!dirty}>
            Save changes
          </Button>
        </>
      }>
      
      <div className="space-y-6">
        <section aria-label="Progress">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-ink">Status</h3>
            <StatusSelect
              value={item.status}
              label={`Application status for ${item.company}`}
              onChange={(s) => onStatusChange(item, s)} />
            
          </div>
          {item.status === 'Rejected' ?
          <div className="mt-3 flex items-start gap-3 rounded-xl bg-status-rejected-bg px-4 py-3 text-sm text-status-rejected-fg">
              <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Not selected this cycle. Note what you learned and consider reapplying next season.
            </div> :

          <ol className="mt-4 grid grid-cols-4 gap-1.5">
              {stages.map((s, idx) => {
              const done = idx <= stageIndex;
              return (
                <li key={s} aria-current={idx === stageIndex ? 'step' : undefined}>
                    <div className={`h-1.5 rounded-full ${done ? 'bg-brand-500' : 'bg-line'}`} />
                    <span className={`mt-2 flex items-center gap-1 text-xs ${done ? 'font-medium text-ink' : 'text-ink-subtle'}`}>
                      {idx < stageIndex && <CheckIcon className="h-3 w-3 text-brand-600" aria-hidden="true" />}
                      {s}
                    </span>
                  </li>);

            })}
            </ol>
          }
        </section>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl border border-line bg-canvas p-4 text-sm">
          <div>
            <dt className="text-xs text-ink-subtle">Location</dt>
            <dd className="mt-0.5 text-ink">
              {item.location} · {item.workMode}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Deadline</dt>
            <dd className="mt-0.5 text-ink">{formatDate(item.deadline)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-ink-subtle">Application link</dt>
            <dd className="mt-0.5">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 truncate font-medium text-brand-700 hover:text-brand-800">
                
                <span className="truncate">{item.url.replace(/^https?:\/\//, '')}</span>
                <ExternalLinkIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
            </dd>
          </div>
          {item.description &&
          <div className="col-span-2">
              <dt className="text-xs text-ink-subtle">Description</dt>
              <dd className="mt-0.5 leading-relaxed text-ink-muted">{item.description}</dd>
            </div>
          }
        </dl>

        <div className="space-y-4">
          <Field label="Date applied" htmlFor="d-date" hint={item.status === 'Saved' ? 'Set a status other than Saved to log this.' : undefined}>
            <input
              id="d-date"
              type="date"
              max={TODAY_ISO}
              value={dateApplied}
              disabled={item.status === 'Saved'}
              onChange={(e) => setDateApplied(e.target.value)}
              className={`${inputClass()} disabled:bg-canvas disabled:text-ink-subtle`} />
            
          </Field>
          <Field label="Next action" htmlFor="d-next">
            <input id="d-next" value={nextAction} onChange={(e) => setNextAction(e.target.value)} className={inputClass()} />
          </Field>
          <Field label="Notes" htmlFor="d-notes">
            <textarea id="d-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className={textareaClass()} />
          </Field>
        </div>

        <section aria-labelledby="related-heading">
          <div className="flex items-center justify-between gap-3">
            <h3 id="related-heading" className="text-sm font-medium text-ink">
              Interviews & reminders
            </h3>
            <Button size="sm" variant="secondary" leftIcon={<CalendarPlusIcon />} onClick={() => onAddEvent(item)}>
              Add
            </Button>
          </div>
          {related.length === 0 ?
          <p className="mt-3 rounded-xl border border-dashed border-line-strong px-4 py-5 text-center text-sm text-ink-muted">
              Nothing scheduled for this application yet.
            </p> :

          <ul className="-mx-3 mt-2">
              {related.map((e) =>
            <li key={e.id}>
                  <EventListItem event={e} />
                </li>
            )}
            </ul>
          }
        </section>

        <Button variant="ghost" size="sm" leftIcon={<PencilIcon />} onClick={() => onEdit(item)} className="-ml-3">
          Edit internship details
        </Button>
      </div>
    </Drawer>);

}