import { Router } from 'express';

import { aiAdminRouter, aiPublicRouter } from '../../modules/ai/ai.routes.js';
import { analyticsRouter } from '../../modules/analytics/analytics.routes.js';
import { authRouter } from '../../modules/auth/auth.routes.js';
import { blogCategoriesRouter } from '../../modules/blog-categories/blog-categories.routes.js';
import { blogRouter } from '../../modules/blog/blog.routes.js';
import { knowledgeBaseRouter } from '../../modules/knowledge-base/knowledge-base.routes.js';
import { leadsRouter } from '../../modules/leads/leads.routes.js';
import { mediaRouter } from '../../modules/media/media.routes.js';
import { projectsRouter } from '../../modules/projects/projects.routes.js';
import { publicRouter } from '../../modules/public/public.routes.js';
import { resumeRouter } from '../../modules/resume/resume.routes.js';
import { settingsRouter } from '../../modules/settings/settings.routes.js';
import { tagsRouter } from '../../modules/tags/tags.routes.js';
import { testimonialsRouter } from '../../modules/testimonials/testimonials.routes.js';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/public/ai', aiPublicRouter);
v1Router.use('/ai', aiAdminRouter);
v1Router.use('/public', publicRouter);
v1Router.use('/projects', projectsRouter);
v1Router.use('/media', mediaRouter);
v1Router.use('/blog/categories', blogCategoriesRouter);
v1Router.use('/blog', blogRouter);
v1Router.use('/leads', leadsRouter);
v1Router.use('/testimonials', testimonialsRouter);
v1Router.use('/resume', resumeRouter);
v1Router.use('/knowledge-base', knowledgeBaseRouter);
v1Router.use('/analytics', analyticsRouter);
v1Router.use('/settings', settingsRouter);
v1Router.use('/tags', tagsRouter);

export { v1Router };
