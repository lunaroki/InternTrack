import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { StatusChart } from '../components/dashboard/StatusChart';
import { UpcomingList } from '../components/dashboard/UpcomingList';
import { RecentApplicationsTable } from '../components/dashboard/RecentApplicationsTable';
import { InternshipFormModal } from '../components/internships/InternshipFormModal';
import { useAppData } from '../hooks/useAppData';
import { TODAY_ISO, daysUntil, formatDate } from '../utils/date';

export function Dashboard() {
  const { user, internships, calendarEvents } = useAppData();
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);

  const upcoming = useMemo(() => calendarEvents.filter((e) => daysUntil(e.date) >= 0).slice(0, 6), [calendarEvents]);
  const recent = useMemo(
    () =>
    internships.
    filter((i) => i.dateApplied).
    sort((a, b) => (b.dateApplied ?? '').localeCompare(a.dateApplied ?? '')).
    slice(0, 5),
    [internships]
  );

  return (
    <div className="space-y-6 lg:space-y-8">
      <PageHeader
        title={`Welcome to InternTrack, ${user.firstName}!`}
        description={`${formatDate(TODAY_ISO, 'EEEE, MMMM d')} — here's where your internship search stands.`}
        actions={
        <Button leftIcon={<PlusIcon />} onClick={() => setAddOpen(true)}>
            Add Internship
          </Button>
        } />
      

      <SummaryCards internships={internships} events={calendarEvents} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <StatusChart internships={internships} />
        </div>
        <div className="lg:col-span-2">
          <UpcomingList events={upcoming} onSelect={(e) => navigate(`/calendar?event=${e.id}`)} />
        </div>
      </div>

      <RecentApplicationsTable rows={recent} onView={(id) => navigate(`/applications?open=${id}`)} />

      <InternshipFormModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>);

}