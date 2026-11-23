import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { InboxIcon, SearchIcon, SendIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusFilterTabs } from '../components/applications/StatusFilterTabs';
import type { StatusFilter } from '../components/applications/StatusFilterTabs';
import { ApplicationsTable } from '../components/applications/ApplicationsTable';
import { ApplicationDetailDrawer } from '../components/applications/ApplicationDetailDrawer';
import { RecordApplicationModal } from '../components/applications/RecordApplicationModal';
import { InternshipFormModal } from '../components/internships/InternshipFormModal';
import { ReminderFormModal } from '../components/calendar/ReminderFormModal';
import type { ReminderDefaults } from '../components/calendar/ReminderFormModal';
import { useAppData } from '../hooks/useAppData';
import { APPLICATION_STATUSES } from '../types/internship';
import type { ApplicationStatus, Internship } from '../types/internship';
import { isApplicationStatus } from '../utils/status';
import { inputClass } from '../utils/formStyles';

export function Applications() {
  const { internships, updateStatus } = useAppData();
  const [params, setParams] = useSearchParams();
  const statusParam = params.get('status');
  const filter: StatusFilter = isApplicationStatus(statusParam) ? statusParam : 'All';
  const openId = params.get('open');

  const [query, setQuery] = useState('');
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Internship | null>(null);
  const [reminderDefaults, setReminderDefaults] = useState<ReminderDefaults | null>(null);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);else
    next.delete(key);
    setParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const c = { All: internships.length } as Record<StatusFilter, number>;
    APPLICATION_STATUSES.forEach((s) => c[s] = internships.filter((i) => i.status === s).length);
    return c;
  }, [internships]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return internships.
    filter((i) => filter === 'All' ? true : i.status === filter).
    filter((i) => !q || `${i.company} ${i.position}`.toLowerCase().includes(q)).
    sort((a, b) => {
      if (a.dateApplied && b.dateApplied) return b.dateApplied.localeCompare(a.dateApplied);
      if (a.dateApplied) return -1;
      if (b.dateApplied) return 1;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [internships, filter, query]);

  const handleStatusChange = (i: Internship, status: ApplicationStatus) => {
    if (i.status === status) return;
    updateStatus(i.id, status);
    toast.success(`${i.company} moved to ${status}`, {
      description: i.status === 'Saved' ? 'Date applied set to today.' : undefined,
      action:
      status === 'Interviewing' ?
      { label: 'Add interview', onClick: () => setReminderDefaults({ internshipId: i.id, type: 'Interview' }) } :
      undefined
    });
  };

  const appliedCount = internships.filter((i) => i.status !== 'Saved').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description={`${appliedCount} submitted · ${counts.Interviewing} interviewing · ${counts.Offered} offer${
        counts.Offered === 1 ? '' : 's'}`
        }
        actions={
        <Button
          leftIcon={<SendIcon />}
          onClick={() => {
            setRecordId(null);
            setRecordOpen(true);
          }}>
          
            Record Application
          </Button>
        } />
      

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <StatusFilterTabs value={filter} onChange={(v) => setParam('status', v === 'All' ? null : v)} counts={counts} />
        <div className="relative lg:w-72">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
          <label htmlFor="app-search" className="sr-only">
            Search applications
          </label>
          <input
            id="app-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications…"
            className={`${inputClass()} pl-9`} />
          
        </div>
      </div>

      <section aria-label="Application records" className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {rows.length === 0 ?
        <EmptyState
          icon={InboxIcon}
          title={filter === 'All' ? 'No applications found' : `No ${filter.toLowerCase()} applications`}
          description={
          query ? 'Try a different search term.' : 'When an application reaches this stage, it will show up here.'
          }
          action={
          filter !== 'All' ?
          <Button variant="secondary" onClick={() => setParam('status', null)}>
                  Show all applications
                </Button> :
          undefined
          } /> :


        <ApplicationsTable
          rows={rows}
          onView={(i) => setParam('open', i.id)}
          onEdit={setEditing}
          onRecord={(i) => {
            setRecordId(i.id);
            setRecordOpen(true);
          }}
          onStatusChange={handleStatusChange} />

        }
      </section>

      <ApplicationDetailDrawer
        internshipId={openId}
        onClose={() => setParam('open', null)}
        onEdit={setEditing}
        onAddEvent={(i) => setReminderDefaults({ internshipId: i.id, type: 'Interview' })}
        onStatusChange={handleStatusChange} />
      
      <RecordApplicationModal open={recordOpen} onClose={() => setRecordOpen(false)} internshipId={recordId} />
      <InternshipFormModal open={editing !== null} onClose={() => setEditing(null)} internship={editing} />
      <ReminderFormModal
        open={reminderDefaults !== null}
        onClose={() => setReminderDefaults(null)}
        defaults={reminderDefaults ?? undefined} />
      
    </div>);

}