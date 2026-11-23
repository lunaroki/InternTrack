import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, describedBy } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { useAppData } from '../../hooks/useAppData';
import { WORK_MODES } from '../../types/internship';
import type { Internship, InternshipInput, WorkMode } from '../../types/internship';
import { inputClass, textareaClass } from '../../utils/formStyles';
import { formatDate } from '../../utils/date';

interface InternshipFormModalProps {
  open: boolean;
  onClose: () => void;
  internship?: Internship | null;
}

type Errors = Partial<Record<keyof InternshipInput, string>>;

const empty: InternshipInput = {
  company: '',
  position: '',
  location: '',
  workMode: 'Hybrid',
  description: '',
  url: '',
  deadline: ''
};

const DESCRIPTION_LIMIT = 500;

export function InternshipFormModal({ open, onClose, internship }: InternshipFormModalProps) {
  const { addInternship, updateInternship } = useAppData();
  const navigate = useNavigate();
  const [values, setValues] = useState<InternshipInput>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const isEdit = Boolean(internship);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setValues(
      internship ?
      {
        company: internship.company,
        position: internship.position,
        location: internship.location,
        workMode: internship.workMode,
        description: internship.description,
        url: internship.url,
        deadline: internship.deadline
      } :
      empty
    );
  }, [open, internship]);

  const set = <K extends keyof InternshipInput,>(key: K, value: InternshipInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!values.company.trim()) e.company = 'Enter the company name.';
    if (!values.position.trim()) e.position = 'Enter the position title.';
    if (!values.location.trim()) e.location = 'Enter a city, state, or "Remote".';
    if (!values.deadline) e.deadline = 'Choose the application deadline.';
    if (!values.url.trim()) e.url = 'Paste the link to the application.';else
    if (!/^https?:\/\/\S+\.\S+/.test(values.url.trim())) e.url = 'Enter a full URL starting with https://';
    if (values.description.length > DESCRIPTION_LIMIT) e.description = `Keep it under ${DESCRIPTION_LIMIT} characters.`;
    return e;
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    const clean: InternshipInput = {
      ...values,
      company: values.company.trim(),
      position: values.position.trim(),
      location: values.location.trim(),
      url: values.url.trim(),
      description: values.description.trim()
    };
    if (internship) {
      updateInternship(internship.id, clean);
      toast.success('Internship updated', { description: `${clean.company} · ${clean.position}` });
    } else {
      addInternship(clean);
      toast.success(`${clean.company} saved to My Internships`, {
        description: `Deadline ${formatDate(clean.deadline)} added to your calendar.`,
        action: { label: 'View', onClick: () => navigate('/internships') }
      });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit internship' : 'Add internship'}
      description={
      isEdit ? 'Update the details for this opportunity.' : 'Save an opportunity so you never miss its deadline.'
      }
      onSubmit={handleSubmit}
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save changes' : 'Save internship'}</Button>
        </>
      }>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company name" htmlFor="f-company" error={errors.company} required>
          <input
            id="f-company"
            value={values.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="e.g. Figma"
            className={inputClass(!!errors.company)}
            aria-invalid={!!errors.company}
            aria-describedby={describedBy('f-company', errors.company)} />
          
        </Field>
        <Field label="Position title" htmlFor="f-position" error={errors.position} required>
          <input
            id="f-position"
            value={values.position}
            onChange={(e) => set('position', e.target.value)}
            placeholder="e.g. Product Design Intern"
            className={inputClass(!!errors.position)}
            aria-invalid={!!errors.position}
            aria-describedby={describedBy('f-position', errors.position)} />
          
        </Field>
        <Field label="Location" htmlFor="f-location" error={errors.location} required>
          <input
            id="f-location"
            value={values.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. New York, NY"
            className={inputClass(!!errors.location)}
            aria-invalid={!!errors.location}
            aria-describedby={describedBy('f-location', errors.location)} />
          
        </Field>
        <Field label="Work arrangement" htmlFor="f-mode">
          <SelectInput
            id="f-mode"
            value={values.workMode}
            onChange={(e) => set('workMode', e.target.value as WorkMode)}>
            
            {WORK_MODES.map((m) =>
            <option key={m}>{m}</option>
            )}
          </SelectInput>
        </Field>
        <Field label="Application deadline" htmlFor="f-deadline" error={errors.deadline} required>
          <input
            id="f-deadline"
            type="date"
            value={values.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className={inputClass(!!errors.deadline)}
            aria-invalid={!!errors.deadline}
            aria-describedby={describedBy('f-deadline', errors.deadline)} />
          
        </Field>
        <Field label="Application URL" htmlFor="f-url" error={errors.url} required>
          <input
            id="f-url"
            type="url"
            inputMode="url"
            value={values.url}
            onChange={(e) => set('url', e.target.value)}
            placeholder="https://"
            className={inputClass(!!errors.url)}
            aria-invalid={!!errors.url}
            aria-describedby={describedBy('f-url', errors.url)} />
          
        </Field>
        <Field
          label="Internship description"
          htmlFor="f-description"
          error={errors.description}
          hint="Team, responsibilities, requirements — anything you'll want to remember."
          className="sm:col-span-2"
          trailing={
          <span
            className={`text-xs tabular-nums ${
            values.description.length > DESCRIPTION_LIMIT ? 'text-danger' : 'text-ink-subtle'}`
            }>
            
              {values.description.length}/{DESCRIPTION_LIMIT}
            </span>
          }>
          
          <textarea
            id="f-description"
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            placeholder="Design end-to-end features for FigJam alongside senior designers…"
            className={textareaClass(!!errors.description)}
            aria-invalid={!!errors.description}
            aria-describedby={describedBy('f-description', errors.description, 'hint')} />
          
        </Field>
      </div>
    </Modal>);

}