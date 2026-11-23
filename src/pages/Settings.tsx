import React, { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Switch } from '../components/ui/Switch';
import { Field } from '../components/ui/Field';
import { SelectInput } from '../components/ui/SelectInput';

interface Prefs {
  deadlineEmails: boolean;
  interviewEmails: boolean;
  weeklySummary: boolean;
  shareWithAdvisor: boolean;
  leadTime: string;
}

const initial: Prefs = {
  deadlineEmails: true,
  interviewEmails: true,
  weeklySummary: false,
  shareWithAdvisor: true,
  leadTime: '3'
};

export function Settings() {
  const [saved, setSaved] = useState<Prefs>(initial);
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const dirty = JSON.stringify(prefs) !== JSON.stringify(saved);
  const set = <K extends keyof Prefs,>(key: K, value: Prefs[K]) => setPrefs((p) => ({ ...p, [key]: value }));

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Choose how and when InternTrack reminds you." />

      <section aria-labelledby="notif-heading" className="rounded-2xl border border-line bg-surface shadow-card">
        <h2 id="notif-heading" className="border-b border-line px-6 py-5 text-base font-semibold text-ink">
          Reminders & notifications
        </h2>
        <div className="divide-y divide-line px-6">
          <Switch
            id="s-deadlines"
            label="Deadline reminders"
            description="Email me before a saved internship's application closes."
            checked={prefs.deadlineEmails}
            onChange={(v) => set('deadlineEmails', v)} />
          
          <Switch
            id="s-interviews"
            label="Interview reminders"
            description="Email me the day before and the morning of each interview."
            checked={prefs.interviewEmails}
            onChange={(v) => set('interviewEmails', v)} />
          
          <Switch
            id="s-weekly"
            label="Weekly progress summary"
            description="A Monday email with your pipeline and what's due this week."
            checked={prefs.weeklySummary}
            onChange={(v) => set('weeklySummary', v)} />
          
          <div className="py-4 sm:max-w-xs">
            <Field label="Remind me about deadlines" htmlFor="s-lead">
              <SelectInput id="s-lead" value={prefs.leadTime} onChange={(e) => set('leadTime', e.target.value)}>
                <option value="1">1 day before</option>
                <option value="3">3 days before</option>
                <option value="7">1 week before</option>
              </SelectInput>
            </Field>
          </div>
        </div>
      </section>

      <section aria-labelledby="privacy-heading" className="rounded-2xl border border-line bg-surface shadow-card">
        <h2 id="privacy-heading" className="border-b border-line px-6 py-5 text-base font-semibold text-ink">
          Privacy
        </h2>
        <div className="px-6">
          <Switch
            id="s-advisor"
            label="Share progress with career services"
            description="Authorized advisors at your university can view your application statuses to support you. They can't edit anything."
            checked={prefs.shareWithAdvisor}
            onChange={(v) => set('shareWithAdvisor', v)} />
          
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" disabled={!dirty} onClick={() => setPrefs(saved)}>
          Discard
        </Button>
        <Button
          disabled={!dirty}
          onClick={() => {
            setSaved(prefs);
            toast.success('Settings saved');
          }}>
          
          Save Changes
        </Button>
      </div>
    </div>);

}