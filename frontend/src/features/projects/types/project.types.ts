export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProjectMedia {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  architecture: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: ProjectStatus;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  thumbnail: ProjectMedia | null;
  gallery: ProjectMedia[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  search?: string;
  featured?: boolean;
}

export interface ProjectListResult {
  items: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateProjectPayload {
  title: string;
  slug?: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  architecture: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  status?: ProjectStatus;
  categoryId?: string | null;
  thumbnailMediaId?: string | null;
  galleryMediaIds?: string[];
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  removeMediaIds?: string[];
}

export interface UpdateProjectStatusPayload {
  status: ProjectStatus;
}
