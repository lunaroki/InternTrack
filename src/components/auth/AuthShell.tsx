import React from 'react';
import { Logo } from '../layout/Logo';
import { StatusBadge } from '../ui/StatusBadge';
import type { ApplicationStatus } from '../../types/internship';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

const preview: {company: string;role: string;status: ApplicationStatus;when: string;}[] = [
{ company: 'Stripe', role: 'Software Engineering Intern', status: 'Interviewing', when: 'Interview · Oct 22' },
{ company: 'Figma', role: 'Product Design Intern', status: 'Saved', when: 'Due · Nov 8' },
{ company: 'Spotify', role: 'Data Science Intern', status: 'Offered', when: 'Respond · Nov 1' }];


export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen w-full bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section
        aria-hidden="true"
        className="relative hidden flex-col justify-between overflow-hidden border-r border-line bg-brand-50 p-12 lg:flex">
        
        <Logo />
        <div className="max-w-md">
          <h2 className="text-[32px] font-semibold leading-tight tracking-tight text-ink">
            Every application, deadline, and interview — in one place.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Replace the spreadsheet, sticky notes, and five calendar apps. InternTrack keeps your internship search
            organized from first save to signed offer.
          </p>
          <div className="mt-10 rounded-2xl border border-line bg-surface p-2 shadow-card">
            {preview.map((p, idx) =>
            <div
              key={p.company}
              className={`flex items-center justify-between gap-4 px-4 py-3 ${idx > 0 ? 'border-t border-line' : ''}`}>
              
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{p.company}</p>
                  <p className="truncate text-xs text-ink-subtle">{p.role}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={p.status} />
                  <span className="text-xs text-ink-subtle">{p.when}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-ink-subtle">Offered in partnership with your university career services office.</p>
      </section>

      <section className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 text-center text-sm text-ink-muted">{footer}</div>
          </div>
        </div>
      </section>
    </div>);

}