import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { APPLICATION_STATUSES } from '../../types/internship';
import { SelectInput } from '../ui/SelectInput';
import { inputClass } from '../../utils/formStyles';

export type DeadlineFilter = 'any' | 'week' | 'month' | 'passed';

export interface InternshipFilterValues {
  query: string;
  location: string;
  deadline: DeadlineFilter;
  status: string;
}

interface InternshipFiltersProps {
  values: InternshipFilterValues;
  onChange: (values: InternshipFilterValues) => void;
  locations: string[];
}

export const defaultFilters: InternshipFilterValues = { query: '', location: 'all', deadline: 'any', status: 'all' };

export function InternshipFilters({ values, onChange, locations }: InternshipFiltersProps) {
  const set = <K extends keyof InternshipFilterValues,>(key: K, value: InternshipFilterValues[K]) =>
  onChange({ ...values, [key]: value });
  const active =
  values.query !== '' || values.location !== 'all' || values.deadline !== 'any' || values.status !== 'all';

  return (
    <div role="search" className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
          aria-hidden="true" />
        
        <label htmlFor="internship-search" className="sr-only">
          Search by company or position
        </label>
        <input
          id="internship-search"
          type="search"
          value={values.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="Search company or position…"
          className={`${inputClass()} pl-9`} />
        
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:items-center">
        <div className="lg:w-44">
          <label htmlFor="filter-location" className="sr-only">
            Location
          </label>
          <SelectInput id="filter-location" value={values.location} onChange={(e) => set('location', e.target.value)}>
            <option value="all">All locations</option>
            {locations.map((l) =>
            <option key={l} value={l}>
                {l}
              </option>
            )}
          </SelectInput>
        </div>
        <div className="lg:w-44">
          <label htmlFor="filter-deadline" className="sr-only">
            Application deadline
          </label>
          <SelectInput
            id="filter-deadline"
            value={values.deadline}
            onChange={(e) => set('deadline', e.target.value as DeadlineFilter)}>
            
            <option value="any">Any deadline</option>
            <option value="week">Due in 7 days</option>
            <option value="month">Due in 30 days</option>
            <option value="passed">Deadline passed</option>
          </SelectInput>
        </div>
        <div className="col-span-2 sm:col-span-1 lg:w-40">
          <label htmlFor="filter-status" className="sr-only">
            Internship status
          </label>
          <SelectInput id="filter-status" value={values.status} onChange={(e) => set('status', e.target.value)}>
            <option value="all">All statuses</option>
            {APPLICATION_STATUSES.map((s) =>
            <option key={s} value={s}>
                {s}
              </option>
            )}
          </SelectInput>
        </div>
        {active &&
        <button
          type="button"
          onClick={() => onChange(defaultFilters)}
          className="col-span-2 inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:col-span-3 lg:col-span-1">
          
            <XIcon className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
        }
      </div>
    </div>);

}