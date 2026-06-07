export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';
export type LeadSource = 'CONTACT' | 'HIRE_ME' | 'CONSULTATION';

export interface LeadNote {
  id: string;
  content: string;
  authorId: string | null;
  author: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  projectType: string | null;
  timeline: string | null;
  preferredTime: string | null;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  adminEmailSent: boolean;
  confirmationEmailSent: boolean;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadPipelineItem {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string | null;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadPipeline {
  NEW: LeadPipelineItem[];
  CONTACTED: LeadPipelineItem[];
  IN_PROGRESS: LeadPipelineItem[];
  CLOSED: LeadPipelineItem[];
}

export interface LeadListParams {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  projectType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LeadListResult {
  items: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface LeadStats {
  total: number;
  newLeads: number;
  closedLeads: number;
  monthlyLeads: number;
  conversionRate: number;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  company?: string | null;
  budget?: string | null;
  projectType?: string | null;
  timeline?: string | null;
  preferredTime?: string | null;
  message: string;
  source?: LeadSource;
  status?: LeadStatus;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
}

export interface CreateLeadNotePayload {
  content: string;
}
