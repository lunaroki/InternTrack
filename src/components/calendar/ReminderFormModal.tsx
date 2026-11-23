import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, describedBy } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { useAppData } from '../../hooks/useAppData';
import { EVENT_TYPES } from '../../types/event';
import type { EventType } from '../../types/event';
import { eventStyles } from '../../utils/status';
import { inputClass, textareaClass } from '../../utils/formStyles';
import { TODAY_ISO, formatDate } from '../../utils/date';

export interface ReminderDefaults {
  internshipId?: string;
  type?: EventType;
  date?: string;
}

interface ReminderFormModalProps {
  open: boolean;
  onClose: () => void;
  defaults?: ReminderDefaults;
}

const titlePlaceholder: Record<EventType, string> = {
  Interview: 'Technical interview',
  Deadline: 'Application deadline',
  'Follow-up': 'Send thank-you email'
};

interface Errors {
  company?: string;
  date?: string;
}

export function ReminderFormModal({ open, onClose, defaults }: ReminderFormModalProps) {
  const { internships, addEvent, updateStatus } = useAppData();
  const [internshipId, setInternshipId] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState<EventType>('Interview');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(TODAY_ISO);
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [advanceStatus, setAdvanceStatus] = useState(true);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setInternshipId(defaults?.internshipId ?? '');
    setCompany('');
    setType(defaults?.type ?? 'Interview');
    setTitle('');
    setDate(defaults?.date ?? TODAY_ISO);
    setTime('10:00');
    setNotes('');
    setAdvanceStatus(true);
    setErrors({});
  }, [open, defaults]);

  const linked = internships.find((i) => i.id === internshipId);
  const canAdvance = type === 'Interview' && linked && (linked.status === 'Saved' || linked.status === 'Applied');

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!linked && !company.trim()) e.company = 'Choose an internship or enter a company name.';
    if (!date) e.date = 'Choose a date.';
    setErrors(e);
    if (Object.keys(e).length) return;

    const companyName = linked ? linked.company : company.trim();
    addEvent({
      internshipId: linked?.id ?? null,
      company: companyName,
      title: title.trim() || titlePlaceholder[type],
      type,
      date,
      time,
      notes: notes.trim()
    });
    if (canAdvance && advanceStatus && linked) updateStatus(linked.id, 'Interviewing');
    toast.success(`${type} added for ${formatDate(date, 'EEE, MMM d')}`, {
      description:
      canAdvance && advanceStatus ? `${companyName} moved to Interviewing.` : `${companyName} · on your calendar`
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add reminder"
      description="Schedule an interview, a deadline, or a follow-up."
      onSubmit={handleSubmit}
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add to calendar</Button>
        </>
      }>
      
      <div className="space-y-4">
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">Event type</legend>
          <div className="grid grid-cols-3 gap-2">
            {EVENT_TYPES.map((t) => {
              const Icon = eventStyles[t].icon;
              const checked = type === t;
              return (
                <label key={t} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="event-type"
                    value={t}
                    checked={checked}
                    onChange={() => setType(t)}
                    className="peer sr-only" />
                  
                  <span
                    className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-400 ${
                    checked ?
                    'border-brand-500 bg-brand-50 text-brand-700' :
                    'border-line-strong text-ink-muted hover:bg-canvas'}`
                    }>
                    
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {t}
                  </span>
                </label>);

            })}
          </div>
        </fieldset>

        <Field label="Related internship" htmlFor="m-internship">
          <SelectInput id="m-internship" value={internshipId} onChange={(e) => setInternshipId(e.target.value)}>
            <option value="">None — general reminder</option>
            {internships.map((i) =>
            <option key={i.id} value={i.id}>
                {i.company} — {i.position}
              </option>
            )}
          </SelectInput>
        </Field>

        {!linked &&
        <Field label="Company or organization" htmlFor="m-company" error={errors.company} required>
            <input
            id="m-company"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              if (errors.company) setErrors((x) => ({ ...x, company: undefined }));
            }}
            placeholder="e.g. Fall Career Fair"
            className={inputClass(!!errors.company)}
            aria-invalid={!!errors.company}
            aria-describedby={describedBy('m-company', errors.company)} />
          
          </Field>
        }

        <Field label="Title" htmlFor="m-title">
          <input
            id="m-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder[type]}
            className={inputClass()} />
          
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" htmlFor="m-date" error={errors.date} required>
            <input
              id="m-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass(!!errors.date)}
              aria-invalid={!!errors.date}
              aria-describedby={describedBy('m-date', errors.date)} />
            
          </Field>
          <Field label="Time" htmlFor="m-time">
            <input id="m-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass()} />
          </Field>
        </div>

        <Field label="Notes" htmlFor="m-notes">
          <textarea
            id="m-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Interviewer names, meeting link, what to prepare…"
            className={textareaClass()} />
          
        </Field>

        {canAdvance &&
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
            <input
            type="checkbox"
            checked={advanceStatus}
            onChange={(e) => setAdvanceStatus(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-line-strong text-brand-600 accent-brand-600" />
          
            <span className="text-sm text-ink">
              Move {linked?.company} to <span className="font-medium">Interviewing</span>
              <span className="block text-[13px] text-ink-muted">Currently {linked?.status}.</span>
            </span>
          </label>
        }
      </div>
    </Modal>);

}