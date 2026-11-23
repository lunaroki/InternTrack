import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BookmarkIcon, CalendarDaysIcon, LayoutDashboardIcon, LogOutIcon, SendIcon, SettingsIcon, UserIcon, BoxIcon } from "lucide-react";
import { Logo } from "./Logo";
import { useAppData } from "../../hooks/useAppData";
import { daysUntil } from "../../utils/date";
interface NavItem {
  to: string;
  label: string;
  icon: BoxIcon;
  count?: number;
}
export function Sidebar() {
  const {
    user,
    logout,
    calendarEvents,
    internships
  } = useAppData();
  const navigate = useNavigate();
  const thisWeek = calendarEvents.filter((e) => {
    const d = daysUntil(e.date);
    return d >= 0 && d <= 7;
  }).length;
  const active = internships.filter((i) => i.status === 'Applied' || i.status === 'Interviewing').length;
  const primary: NavItem[] = [{
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  }, {
    to: '/internships',
    label: 'My Internships',
    icon: BookmarkIcon
  }, {
    to: '/applications',
    label: 'Applications',
    icon: SendIcon,
    count: active
  }, {
    to: '/calendar',
    label: 'Calendar & Reminders',
    icon: CalendarDaysIcon,
    count: thisWeek
  }];
  const account: NavItem[] = [{
    to: '/profile',
    label: 'My Profile',
    icon: UserIcon
  }, {
    to: '/settings',
    label: 'Settings',
    icon: SettingsIcon
  }];
  const handleLogout = () => {
    logout();
    toast('You have been logged out');
    navigate('/login');
  };
  const renderItem = (item: NavItem) => <li key={item.to}>
      <NavLink to={item.to} className={({
      isActive
    }) => `group flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-canvas hover:text-ink'}`}>
        <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 whitespace-nowrap">{item.label}</span>
        {item.count ? <span className="rounded-md bg-surface px-1.5 text-xs font-semibold tabular-nums text-ink-muted ring-1 ring-line" aria-label={`${item.count} items`}>
            {item.count}
          </span> : null}
      </NavLink>
    </li>;
  return <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">{primary.map(renderItem)}</ul>
        <p className="mb-1.5 mt-6 px-3 text-xs font-medium text-ink-subtle">Account</p>
        <ul className="space-y-0.5">{account.map(renderItem)}</ul>
      </nav>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
            {user.firstName[0]}
            {user.lastName[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-ink-subtle">{user.email}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="mt-1 flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink-muted transition-colors duration-150 hover:bg-canvas hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          <LogOutIcon className="h-4 w-4" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>;
}