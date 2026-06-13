import { AiFeatureType } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';

import {
  aiInteractionRepository,
  knowledgeBaseRepository,
} from '../../repositories/ai.repository.js';
import { siteContentRepository } from '../../repositories/site-content.repository.js';
import { generateGeminiResponse } from '../../lib/gemini.js';
import type { AskIshanResponseDto } from './ai.dto.js';
import type { AskIshanInput } from './ai.validator.js';

const ASK_ISHAN_CATEGORIES = ['about', 'profile', 'services', 'faq', 'skills', 'experience', 'projects', 'ai'];

function getRequestMeta(req: Request) {
  return {
    ipAddress: req.ip ?? req.socket.remoteAddress ?? null,
    userAgent: req.get('user-agent') ?? null,
  };
}

async function buildKnowledgeContext(categories?: string[]): Promise<string> {
  const entries = categories?.length
    ? await knowledgeBaseRepository.findByCategories(categories)
    : await knowledgeBaseRepository.findAllActive();

  if (entries.length === 0) {
    return 'No knowledge base entries are available yet.';
  }

  return entries
    .map((entry) => `### ${entry.title} (${entry.category})\n${entry.content}`)
    .join('\n\n');
}

async function buildSiteContext(): Promise<string> {
  const site = await siteContentRepository.getSiteSettings();
  if (!site) return '';

  const parts = [
    site.siteName ? `Site name: ${site.siteName}` : null,
    site.siteDescription ? `Description: ${site.siteDescription}` : null,
    site.contactEmail ? `Contact email: ${site.contactEmail}` : null,
  ].filter(Boolean);

  return parts.join('\n');
}

function buildConversationHistory(
  records: Array<{ prompt: string; response: string }>
): string {
  if (records.length === 0) return '';

  const chronological = [...records].reverse();
  return chronological
    .map((record, index) => `Turn ${index + 1}\nUser: ${record.prompt}\nAssistant: ${record.response}`)
    .join('\n\n');
}

export class AiService {
  async askIshan(input: AskIshanInput, req: Request): Promise<AskIshanResponseDto> {
    const sessionId = input.sessionId ?? randomUUID();
    const startedAt = Date.now();
    const meta = getRequestMeta(req);

    const [siteContext, knowledgeContext, historyRecords] = await Promise.all([
      buildSiteContext(),
      buildKnowledgeContext(ASK_ISHAN_CATEGORIES),
      input.sessionId
        ? aiInteractionRepository.findRecentBySession(sessionId, AiFeatureType.ASK_ISHAN, 4)
        : Promise.resolve([]),
    ]);

    const systemPrompt = [
      'You are "Ask Ishan AI", a helpful AI assistant on Ishan\'s professional portfolio website.',
      '',
      'Primary role — portfolio questions:',
      '- Answer questions about Ishan\'s skills, services, experience, projects, availability, and how to collaborate.',
      '- For anything about Ishan, use ONLY the knowledge base and site context below.',
      '- Do not invent credentials, rates, timelines, or project details. If information is missing, say so and suggest contacting Ishan.',
      '',
      'General help — other topics:',
      '- You may also answer general questions: programming concepts, web dev, tech recommendations, learning paths, brief how-tos, and reasonable everyday questions.',
      '- For general topics, use your own knowledge. You do not need to force every answer back to Ishan unless it is naturally relevant.',
      '- If a message mixes portfolio and general topics, answer both parts clearly.',
      '- Decline harmful, illegal, or inappropriate requests politely.',
      '- For medical, legal, or financial advice, keep it general and suggest consulting a qualified professional.',
      '',
      'Tone: concise, professional, warm, and helpful. When relevant, suggest portfolio pages or contacting Ishan directly.',
      '',
      'Reply formatting rules (always follow):',
      '- Write in clear, scannable Markdown.',
      '- Open with a brief 1–2 sentence summary before any list.',
      '- Use bullet lists for 3 or more items. Put each item on its own line starting with "- ".',
      '- Never cram multiple bullets on one line or use inline asterisks like "* item * item".',
      '- For portfolio items, bold names with **Name**: then add a short description on the same line.',
      '- Put technologies in parentheses at the end of portfolio items, e.g. (Node.js, MongoDB).',
      '- Do not use markdown headings (#). Keep paragraphs short (2–3 sentences max).',
      '- Limit lists to the 4–6 most relevant items unless the user asks for everything.',
      '- End with one helpful next step when appropriate.',
      '',
      'Site context:',
      siteContext || 'Not available.',
      '',
      'Knowledge base:',
      knowledgeContext,
    ].join('\n');

    const history = buildConversationHistory(historyRecords);
    const userPrompt = [
      history ? `Previous conversation:\n${history}\n` : '',
      `User question:\n${input.message}`,
    ]
      .filter(Boolean)
      .join('\n');

    const { text, model } = await generateGeminiResponse({ systemPrompt, userPrompt });

    const record = await aiInteractionRepository.create({
      feature: AiFeatureType.ASK_ISHAN,
      prompt: input.message,
      response: text,
      systemPrompt,
      sessionId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      model,
      latencyMs: Date.now() - startedAt,
      metadata: {
        knowledgeCategories: ASK_ISHAN_CATEGORIES,
        historyCount: historyRecords.length,
      },
    });

    return {
      id: record.id,
      sessionId,
      message: input.message,
      reply: text,
      model,
    };
  }

  async listInteractions(query: { page: number; limit: number; skip: number; feature?: AiFeatureType }) {
    return aiInteractionRepository.findMany(query);
  }
}

export const aiService = new AiService();
