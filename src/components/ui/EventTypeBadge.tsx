import React from 'react';
import type { EventType } from '../../types/event';
import { eventStyles } from '../../utils/status';

export function EventTypeBadge({ type }: {type: EventType;}) {
  const { chip, icon: Icon } = eventStyles[type];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ${chip}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {type}
    </span>);

}