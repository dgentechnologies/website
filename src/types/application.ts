export interface JobApplication {
  id?: string;
  listingId: string;
  listingTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverLetter?: string;
  resumeUrl: string;
  resumeFileName: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt?: { seconds: number; nanoseconds: number } | Date;
}
