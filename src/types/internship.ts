export const APPLICATION_STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offered', 'Rejected'] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const WORK_MODES = ['On-site', 'Hybrid', 'Remote'] as const;

export type WorkMode = (typeof WORK_MODES)[number];

export interface Internship {
  id: string;
  company: string;
  position: string;
  location: string;
  workMode: WorkMode;
  description: string;
  url: string;
  deadline: string;
  status: ApplicationStatus;
  dateApplied: string | null;
  nextAction: string;
  notes: string;
}

export type InternshipInput = Pick<
  Internship,
  'company' | 'position' | 'location' | 'workMode' | 'description' | 'url' | 'deadline'>;


export interface ApplicationRecordInput {
  dateApplied: string;
  nextAction: string;
  notes: string;
}