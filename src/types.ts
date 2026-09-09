export type JobStatus = 'Saved' | 'Applied' | 'Interview' | 'Rejected' | 'Offer';

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  status: JobStatus;
  applicationDate: string;
  notes?: string;
}
