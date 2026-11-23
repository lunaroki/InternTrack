import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays } from 'date-fns';
import { toast } from 'sonner';
import { BookmarkIcon } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, describedBy } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { CompanyAvatar } from '../ui/CompanyAvatar';
import { EmptyState } from '../ui/EmptyState';
import { useAppData } from '../../hooks/useAppData';
import { inputClass, textareaClass } from '../../utils/formStyles';
import { TODAY_ISO, formatDate, getToday, toISODate } from '../../utils/date';

interface RecordApplicationModalProps {
  open: boolean;
  onClose: () => void;
  internshipId?: string | null;
}

interface Errors {
  internship?: string;
  dateApplied?: string;
  followUpDate?: string;
}

export function RecordApplicationModal({ open, onClose, internshipId }: RecordApplicationModalProps) {
  const { internships, recordApplication, addEvent } = useAppData();
  const navigate = useNavigate();
  const saved = internships.filter((i) => i.status === 'Saved');
  const [selectedId, setSelectedId] = useState('');
  const [dateApplied, setDateApplied] = useState(TODAY_ISO);
  const [nextAction, setNextAction] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!open) return;
    setSelectedId(internshipId ?? saved[0]?.id ?? '');
    setDateApplied(TODAY_ISO);
    setNextAction('Follow up with recruiter');
    setFollowUpDate(toISODate(addDays(getToday(), 7)));
    setNotes('');
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, internshipId]);

  const selected = internships.find((i) => i.id === selectedId);
  const locked = Boolean(internshipId);

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!selected) e.internship = 'Choose which internship you applied to.';
    if (!dateApplied) e.dateApplied = 'Enter the date you applied.';else
    if (dateApplied > TODAY_ISO) e.dateApplied = "Date applied can't be in the future.";
    if (followUpDate && dateApplied && followUpDate < dateApplied)
    e.followUpDate = 'Follow-up should be on or after the date applied.';
    setErrors(e);
    if (Object.keys(e).length || !selected) return;

    recordApplication(selected.id, { dateApplied, nextAction: nextAction.trim(), notes: notes.trim() });
    if (followUpDate) {
      addEvent({
        internshipId: selected.id,
        company: selected.company,
        title: nextAction.trim() || 'Follow up on application',
        type: 'Follow-up',
        date: followUpDate,
        time: '09:00',
        notes: ''
      });
    }
    toast.success(`Application to ${selected.company} recorded`, {
      description: followUpDate ?
      `Status set to Applied. Follow-up reminder on ${formatDate(followUpDate, 'MMM d')}.` :
      'Status set to Applied.'
    });
    onClose();
  };

  if (open && saved.length === 0 && !locked) {
    return (
      <Modal open={open} onClose={onClose} title="Record an application">
        <EmptyState
          compact
          icon={BookmarkIcon}
          title="No saved internships to apply to"
          description="Save an opportunity in My Internships first, then record your application here."
          action={
          <Button
            onClick={() => {
              onClose();
              navigate('/internships');
            }}>
            
              Go to My Internships
            </Button>
          } />
        
      </Modal>);

  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record an application"
      description="Log when you applied and what happens next. The status moves to Applied."
      onSubmit={handleSubmit}
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Record application</Button>
        </>
      }>
      
      <div className="space-y-4">
        {locked && selected ?
        <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
            <CompanyAvatar name={selected.company} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{selected.company}</p>
              <p className="truncate text-[13px] text-ink-muted">{selected.position}</p>
            </div>
          </div> :

        <Field label="Internship" htmlFor="r-internship" error={errors.internship} required>
            <SelectInput
            id="r-internship"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            hasError={!!errors.internship}
            aria-describedby={describedBy('r-internship', errors.internship)}>
            
              {saved.map((i) =>
            <option key={i.id} value={i.id}>
                  {i.company} — {i.position}
                </option>
            )}
            </SelectInput>
          </Field>
        }
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date applied" htmlFor="r-date" error={errors.dateApplied} required>
            <input
              id="r-date"
              type="date"
              max={TODAY_ISO}
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              className={inputClass(!!errors.dateApplied)}
              aria-invalid={!!errors.dateApplied}
              aria-describedby={describedBy('r-date', errors.dateApplied)} />
            
          </Field>
          <Field
            label="Follow-up reminder"
            htmlFor="r-followup"
            error={errors.followUpDate}
            hint="Optional — added to your calendar.">
            
            <input
              id="r-followup"
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className={inputClass(!!errors.followUpDate)}
              aria-invalid={!!errors.followUpDate}
              aria-describedby={describedBy('r-followup', errors.followUpDate, 'hint')} />
            
          </Field>
        </div>
        <Field label="Next action" htmlFor="r-next">
          <input
            id="r-next"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="e.g. Follow up with recruiter"
            className={inputClass()} />
          
        </Field>
        <Field label="Notes" htmlFor="r-notes">
          <textarea
            id="r-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Referral, recruiter name, resume version…"
            className={textareaClass()} />
          
        </Field>
      </div>
    </Modal>);

}