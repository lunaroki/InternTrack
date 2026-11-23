import React from "react";
import { BoxIcon } from "lucide-react";
interface EmptyStateProps {
  icon: BoxIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact
}: EmptyStateProps) {
  return <div className={`flex flex-col items-center text-center ${compact ? 'px-4 py-8' : 'px-6 py-14'}`}>
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-ink-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>;
}