export interface Resume {
  id: string;
  title: string;
  fileUrl: string;
  version: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface ResumeListResult {
  items: Resume[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateResumePayload {
  title: string;
  fileUrl: string;
  version: string;
  isActive?: boolean;
}

export type UpdateResumePayload = Partial<CreateResumePayload>;
