export interface CareerListing {
  id?: string;
  position: string;
  category: string;
  topic: string;
  type: 'job' | 'internship';
  workMode: 'remote' | 'onsite' | 'hybrid';
  compensation: 'paid' | 'unpaid';
  amount?: string;
  amountSpan?: 'per month' | 'per year' | 'per week' | 'fixed';
  duration: string;
  description: string;
  requirements: string;
  isActive: boolean;
  createdAt?: { seconds: number; nanoseconds: number } | Date;
  updatedAt?: { seconds: number; nanoseconds: number } | Date;
}
