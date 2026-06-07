import { AnalyticsEventType } from '@prisma/client';
import type { Request, Response } from 'express';

import { VISITOR_COOKIE, VISITOR_SESSION_MS } from '../../constants/analytics.constants.js';
import { analyticsRepository } from '../../repositories/analytics.repository.js';
import { env } from '../../config/env.js';
import type {
  AnalyticsOverviewDto,
  PublicVisitorStatsDto,
  RecordVisitResultDto,
} from './analytics.dto.js';
import type { AnalyticsOverviewQueryInput, RecordVisitInput } from './analytics.validator.js';

function getRangeStart(range: AnalyticsOverviewQueryInput['range']): Date | null {
  if (range === 'all') return null;

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const start = new Date();
  start.setDate(start.getDate() - days);
  return start;
}

function getVisitorCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: VISITOR_SESSION_MS,
    path: env.AUTH_COOKIE_PATH,
  } as const;
}

function shouldCountVisit(req: Request): boolean {
  const raw = req.cookies?.[VISITOR_COOKIE] as string | undefined;
  if (!raw) return true;

  const lastCountedAt = Number.parseInt(raw, 10);
  if (!Number.isFinite(lastCountedAt)) return true;

  return Date.now() - lastCountedAt >= VISITOR_SESSION_MS;
}

export class AnalyticsService {
  async getPublicStats(): Promise<PublicVisitorStatsDto> {
    const [visitors, pageViews] = await Promise.all([
      analyticsRepository.countByType(AnalyticsEventType.VISIT),
      analyticsRepository.countByType(AnalyticsEventType.PAGE_VIEW),
    ]);

    return { visitors, pageViews };
  }

  async recordVisit(
    input: RecordVisitInput,
    req: Request,
    res: Response
  ): Promise<RecordVisitResultDto> {
    const counted = shouldCountVisit(req);

    if (counted) {
      await analyticsRepository.create({
        type: AnalyticsEventType.VISIT,
        path: input.path ?? null,
        referrer: input.referrer ?? null,
        metadata: {
          ipAddress: req.ip ?? req.socket.remoteAddress ?? null,
          userAgent: req.get('user-agent') ?? null,
        },
      });

      res.cookie(VISITOR_COOKIE, String(Date.now()), getVisitorCookieOptions());
    }

    if (input.path) {
      await analyticsRepository.create({
        type: AnalyticsEventType.PAGE_VIEW,
        path: input.path,
        referrer: input.referrer ?? null,
      });
    }

    const stats = await this.getPublicStats();
    return { ...stats, counted };
  }

  async getOverview(query: AnalyticsOverviewQueryInput): Promise<AnalyticsOverviewDto> {
    const since = getRangeStart(query.range);

    const count = (type: AnalyticsEventType) =>
      since
        ? analyticsRepository.countByTypeSince(type, since)
        : analyticsRepository.countByType(type);

    const [visitors, pageViews, contactRequests, downloads, topPaths] = await Promise.all([
      count(AnalyticsEventType.VISIT),
      count(AnalyticsEventType.PAGE_VIEW),
      count(AnalyticsEventType.CONTACT_REQUEST),
      count(AnalyticsEventType.DOWNLOAD),
      since ? analyticsRepository.topPathsSince(since) : analyticsRepository.topPathsSince(new Date(0)),
    ]);

    return {
      visitors,
      pageViews,
      contactRequests,
      downloads,
      topPaths,
      range: query.range,
    };
  }
}

export const analyticsService = new AnalyticsService();
