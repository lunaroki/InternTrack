import React, { createContext, useCallback, useMemo, useState } from 'react';
import { initialInternships } from '../data/internships';
import { initialEvents } from '../data/events';
import { demoUser } from '../data/user';
import type { ApplicationRecordInput, ApplicationStatus, Internship, InternshipInput } from '../types/internship';
import type { CalendarEvent, CalendarEventInput } from '../types/event';
import type { UserProfile } from '../types/user';
import { buildCalendarEvents } from '../utils/events';
import { createId } from '../utils/id';
import { TODAY_ISO } from '../utils/date';
import { defaultNextAction } from '../utils/status';

export interface AppDataValue {
  isAuthenticated: boolean;
  user: UserProfile;
  login: (email: string) => void;
  register: (profile: Pick<UserProfile, 'firstName' | 'lastName' | 'email'>) => void;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
  internships: Internship[];
  addInternship: (input: InternshipInput) => Internship;
  updateInternship: (id: string, patch: Partial<Internship>) => void;
  deleteInternship: (id: string) => void;
  recordApplication: (id: string, record: ApplicationRecordInput) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  calendarEvents: CalendarEvent[];
  addEvent: (input: CalendarEventInput) => CalendarEvent;
  deleteEvent: (id: string) => void;
}

export const AppDataContext = createContext<AppDataValue | null>(null);

interface AppDataProviderProps {
  children: React.ReactNode;
  initialAuthenticated?: boolean;
}

export function AppDataProvider({ children, initialAuthenticated = false }: AppDataProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [user, setUser] = useState<UserProfile>(demoUser);
  const [internships, setInternships] = useState<Internship[]>(initialInternships);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const login = useCallback((email: string) => {
    setUser((u) => ({ ...u, email }));
    setIsAuthenticated(true);
  }, []);

  const register = useCallback((profile: Pick<UserProfile, 'firstName' | 'lastName' | 'email'>) => {
    setUser({ ...demoUser, ...profile });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => setIsAuthenticated(false), []);

  const updateProfile = useCallback((profile: UserProfile) => setUser(profile), []);

  const addInternship = useCallback((input: InternshipInput) => {
    const internship: Internship = {
      ...input,
      id: createId('int'),
      status: 'Saved',
      dateApplied: null,
      nextAction: defaultNextAction.Saved,
      notes: ''
    };
    setInternships((prev) => [internship, ...prev]);
    return internship;
  }, []);

  const updateInternship = useCallback((id: string, patch: Partial<Internship>) => {
    setInternships((prev) => prev.map((i) => i.id === id ? { ...i, ...patch } : i));
    if (patch.company) {
      setEvents((prev) => prev.map((e) => e.internshipId === id ? { ...e, company: patch.company as string } : e));
    }
  }, []);

  const deleteInternship = useCallback((id: string) => {
    setInternships((prev) => prev.filter((i) => i.id !== id));
    setEvents((prev) => prev.filter((e) => e.internshipId !== id));
  }, []);

  const recordApplication = useCallback((id: string, record: ApplicationRecordInput) => {
    setInternships((prev) =>
    prev.map((i) =>
    i.id === id ?
    {
      ...i,
      status: 'Applied',
      dateApplied: record.dateApplied,
      nextAction: record.nextAction || defaultNextAction.Applied,
      notes: record.notes || i.notes
    } :
    i
    )
    );
  }, []);

  const updateStatus = useCallback((id: string, status: ApplicationStatus) => {
    setInternships((prev) =>
    prev.map((i) => {
      if (i.id !== id || i.status === status) return i;
      const dateApplied = status === 'Saved' ? null : i.dateApplied ?? TODAY_ISO;
      return { ...i, status, dateApplied, nextAction: defaultNextAction[status] };
    })
    );
  }, []);

  const addEvent = useCallback((input: CalendarEventInput) => {
    const event: CalendarEvent = { ...input, id: createId('evt') };
    setEvents((prev) => [...prev, event]);
    return event;
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const calendarEvents = useMemo(() => buildCalendarEvents(internships, events), [internships, events]);

  const value = useMemo<AppDataValue>(
    () => ({
      isAuthenticated,
      user,
      login,
      register,
      logout,
      updateProfile,
      internships,
      addInternship,
      updateInternship,
      deleteInternship,
      recordApplication,
      updateStatus,
      calendarEvents,
      addEvent,
      deleteEvent
    }),
    [
    isAuthenticated,
    user,
    login,
    register,
    logout,
    updateProfile,
    internships,
    addInternship,
    updateInternship,
    deleteInternship,
    recordApplication,
    updateStatus,
    calendarEvents,
    addEvent,
    deleteEvent]

  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}