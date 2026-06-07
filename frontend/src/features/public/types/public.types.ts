export interface PublicMedia {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
}

export interface PublicProjectSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  techStack: string[];
  featured: boolean;
  category: PublicCategory | null;
  thumbnail: PublicMedia | null;
  liveUrl: string | null;
  githubUrl: string | null;
}

export interface PublicProject extends PublicProjectSummary {
  description: string;
  architecture: string;
  gallery: PublicMedia[];
}

export interface PublicBlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  readingTimeMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
  category: PublicCategory | null;
  author: { id: string; name: string } | null;
  tags: { id: string; name: string; slug: string }[];
}

export interface PublicBlogPost extends PublicBlogPostSummary {
  content: string;
  contentFormat: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface PublicSite {
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
  contactEmail: string | null;
  socialLinks: Record<string, string> | null;
}

export interface PublicAboutSection {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface PublicAbout {
  site: PublicSite;
  sections: PublicAboutSection[];
}

export interface PublicService {
  id: string;
  title: string;
  content: string;
}

export interface PublicTestimonial {
  id: string;
  clientName: string;
  company: string | null;
  designation: string | null;
  content: string;
  rating: number | null;
}

export interface PublicResume {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  version: string;
  updatedAt: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  projectType?: string;
  message: string;
}

export interface HireMeFormPayload extends ContactFormPayload {
  timeline?: string;
}

export interface ConsultationFormPayload {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  preferredTime?: string;
  message: string;
}

export interface LeadSubmissionResponse {
  id: string;
  message: string;
  emailSent: boolean;
}

/** @deprecated Use LeadSubmissionResponse */
export type ContactSubmissionResponse = LeadSubmissionResponse;
