import type { CalendarEvent } from '../types/event';

export const initialEvents: CalendarEvent[] = [
{
  id: 'evt-stripe-screen',
  internshipId: 'int-stripe',
  company: 'Stripe',
  title: 'Recruiter phone screen',
  type: 'Interview',
  date: '2026-10-08',
  time: '13:00',
  notes: '30 min call with Jordan Lee. Went well — moving to technical round.'
},
{
  id: 'evt-microsoft-followup',
  internshipId: 'int-microsoft',
  company: 'Microsoft',
  title: 'Email recruiter for status update',
  type: 'Follow-up',
  date: '2026-10-21',
  time: '09:00',
  notes: 'Mention the career fair conversation about the Teams PM role.'
},
{
  id: 'evt-stripe-tech',
  internshipId: 'int-stripe',
  company: 'Stripe',
  title: 'Technical interview',
  type: 'Interview',
  date: '2026-10-22',
  time: '10:00',
  notes: '60 min pair-programming over Zoom. Practice API design and debugging questions.'
},
{
  id: 'evt-stripe-thanks',
  internshipId: 'int-stripe',
  company: 'Stripe',
  title: 'Send thank-you note',
  type: 'Follow-up',
  date: '2026-10-23',
  time: '09:00',
  notes: ''
},
{
  id: 'evt-jpl-panel',
  internshipId: 'int-jpl',
  company: 'NASA JPL',
  title: 'Panel interview',
  type: 'Interview',
  date: '2026-10-27',
  time: '14:00',
  notes: 'Three engineers from Mission Systems. Bring examples from the CubeSat club project.'
},
{
  id: 'evt-salesforce-followup',
  internshipId: 'int-salesforce',
  company: 'Salesforce',
  title: 'Check application status',
  type: 'Follow-up',
  date: '2026-10-29',
  time: '10:00',
  notes: ''
},
{
  id: 'evt-spotify-offer',
  internshipId: 'int-spotify',
  company: 'Spotify',
  title: 'Offer response due',
  type: 'Deadline',
  date: '2026-11-01',
  time: '17:00',
  notes: 'Decide before Stripe final round if possible. Talk to career services about negotiating.'
}];