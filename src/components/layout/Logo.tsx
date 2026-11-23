import React from 'react';
import { BriefcaseIcon } from 'lucide-react';

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
        <BriefcaseIcon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-[17px] font-semibold tracking-tight text-ink">
        Intern<span className="text-brand-600">Track</span>
      </span>
    </span>);

}