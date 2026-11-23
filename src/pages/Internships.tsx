import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BookmarkPlusIcon, PlusIcon, SearchXIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { InternshipCard } from '../components/internships/InternshipCard';
import { InternshipFilters, defaultFilters } from '../components/internships/InternshipFilters';
import type { InternshipFilterValues } from '../components/internships/InternshipFilters';
import { InternshipFormModal } from '../components/internships/InternshipFormModal';
import { RecordApplicationModal } from '../components/applications/RecordApplicationModal';
import { useAppData } from '../hooks/useAppData';
import type { Internship } from '../types/internship';
import { daysUntil } from '../utils/date';

export function Internships() {
  const { internships, deleteInternship } = useAppData();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<InternshipFilterValues>(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Internship | null>(null);
  const [deleting, setDeleting] = useState<Internship | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const locations = useMemo(() => [...new Set(internships.map((i) => i.location))].sort(), [internships]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return internships.
    filter((i) => {
      if (q && !`${i.company} ${i.position}`.toLowerCase().includes(q)) return false;
      if (filters.location !== 'all' && i.location !== filters.location) return false;
      if (filters.status !== 'all' && i.status !== filters.status) return false;
      const d = daysUntil(i.deadline);
      if (filters.deadline === 'week' && (d < 0 || d > 7)) return false;
      if (filters.deadline === 'month' && (d < 0 || d > 30)) return false;
      if (filters.deadline === 'passed' && d >= 0) return false;
      return true;
    }).
    sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [internships, filters]);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteInternship(deleting.id);
    toast.success(`${deleting.company} removed`, { description: 'Its reminders were removed from your calendar.' });
    setDeleting(null);
  };

  const savedCount = internships.filter((i) => i.status === 'Saved').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Internships"
        description={`${internships.length} opportunities saved · ${savedCount} still waiting on your application`}
        actions={
        <Button leftIcon={<PlusIcon />} onClick={openAdd}>
            Add Internship
          </Button>
        } />
      

      <InternshipFilters values={filters} onChange={setFilters} locations={locations} />

      <p className="text-sm text-ink-muted" aria-live="polite">
        Showing {filtered.length} of {internships.length} · sorted by deadline
      </p>

      {internships.length === 0 ?
      <div className="rounded-2xl border border-line bg-surface shadow-card">
          <EmptyState
          icon={BookmarkPlusIcon}
          title="Save your first internship"
          description="Add opportunities you're interested in and we'll keep track of every deadline."
          action={
          <Button leftIcon={<PlusIcon />} onClick={openAdd}>
                Add Internship
              </Button>
          } />
        
        </div> :
      filtered.length === 0 ?
      <div className="rounded-2xl border border-line bg-surface shadow-card">
          <EmptyState
          icon={SearchXIcon}
          title="No internships match"
          description="Try a different search term or clear your filters."
          action={
          <Button variant="secondary" onClick={() => setFilters(defaultFilters)}>
                Clear filters
              </Button>
          } />
        
        </div> :

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) =>
        <li key={i.id}>
              <InternshipCard
            internship={i}
            onEdit={(x) => {
              setEditing(x);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
            onRecord={(x) => setRecordingId(x.id)}
            onView={(x) => navigate(`/applications?open=${x.id}`)} />
          
            </li>
        )}
        </ul>
      }

      <InternshipFormModal open={formOpen} onClose={() => setFormOpen(false)} internship={editing} />
      <RecordApplicationModal open={recordingId !== null} onClose={() => setRecordingId(null)} internshipId={recordingId} />
      <ConfirmDialog
        open={deleting !== null}
        title={`Delete ${deleting?.company ?? ''} internship?`}
        message={`This removes "${deleting?.position ?? ''}" and any related interviews or reminders. This can't be undone.`}
        confirmLabel="Delete internship"
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)} />
      
    </div>);

}