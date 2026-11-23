import React from 'react';

const tones = [
'bg-brand-50 text-brand-700',
'bg-status-saved-bg text-status-saved-fg',
'bg-event-interview-bg text-event-interview-fg',
'bg-event-followup-bg text-event-followup-fg'];


export function CompanyAvatar({ name, size = 'md' }: {name: string;size?: 'sm' | 'md' | 'lg';}) {
  const initials = name.
  split(/\s+/).
  filter(Boolean).
  slice(0, 2).
  map((w) => w[0]?.toUpperCase()).
  join('');
  const tone = tones[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % tones.length];
  const dims = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm';
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-xl font-semibold ${dims} ${tone}`}>
      
      {initials}
    </span>);

}