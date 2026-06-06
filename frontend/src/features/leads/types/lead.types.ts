export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';

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
  message: string;
  status: LeadStatus;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadListParams {
  page?: number;
  limit?: number;
  status?: LeadStatus;
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
  message: string;
  status?: LeadStatus;
}

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
}

export interface CreateLeadNotePayload {
  content: string;
}
