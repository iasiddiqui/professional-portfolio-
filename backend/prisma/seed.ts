import 'dotenv/config';

import { RoleName } from '@prisma/client';

import { ROLE_LABELS, ROLE_PERMISSIONS } from '../src/constants/permissions.js';
import { prisma } from '../src/lib/prisma.js';
import { DEFAULT_SITE_EMAIL_TEMPLATES } from '../src/services/email/email-templates.defaults.js';
import { hashPassword } from '../src/utils/password.js';
import {
  ABOUT_INTRO_BODY,
  AI_KNOWLEDGE_ENTRIES,
  SITE_PROFILE_DESCRIPTION,
} from './data/ai-knowledge-base.js';

async function seedRoles(): Promise<void> {
  for (const name of Object.values(RoleName)) {
    await prisma.role.upsert({
      where: { name },
      create: {
        name,
        label: ROLE_LABELS[name],
        description: `${ROLE_LABELS[name]} role`,
        permissions: ROLE_PERMISSIONS[name],
      },
      update: {
        label: ROLE_LABELS[name],
        permissions: ROLE_PERMISSIONS[name],
      },
    });
  }

  console.log('Roles seeded: ADMIN, EDITOR, USER');
}

async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Skipping admin user seed (ADMIN_EMAIL / ADMIN_PASSWORD not set)');
    return;
  }

  const adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });

  if (!adminRole) {
    throw new Error('Admin role not found');
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    create: {
      name: 'Administrator',
      email: email.toLowerCase(),
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
    update: {
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log(`Admin user seeded: ${email}`);
}

async function seedSiteSettings(): Promise<void> {
  const emailTemplates = DEFAULT_SITE_EMAIL_TEMPLATES;

  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      siteName: 'Ishan Ahmad Siddiqui',
      siteDescription: SITE_PROFILE_DESCRIPTION,
      emailTemplates,
      maintenanceMode: false,
    },
    update: {
      siteName: 'Ishan Ahmad Siddiqui',
      siteDescription: SITE_PROFILE_DESCRIPTION,
      emailTemplates,
    },
  });

  console.log('Site settings seeded (including email templates)');
}

const ABOUT_SECTIONS = [
  {
    id: 'about-intro',
    title: 'About Me',
    category: 'about',
    content: JSON.stringify({
      format: 'text',
      body: ABOUT_INTRO_BODY,
    }),
  },
  {
    id: 'about-experience',
    title: 'Experience',
    category: 'about',
    content: JSON.stringify({
      format: 'timeline',
      entries: [
        {
          role: 'Full-stack Developer',
          organization: 'APPIT Software Inc.',
          period: 'Jun 2024 – Dec 2024 · Hyderabad, Telangana, India',
          content: `Designed and developed full-stack web applications using React.js, Material UI, and CSS for the frontend, and Node.js with Express.js for backend services.
Integrated MongoDB for efficient data storage and retrieval, ensuring scalable and maintainable application architecture.
Delivered high-impact projects including the Workisy hiring platform and the Climate Summit 2024 website.
Strengthened skills in modern web technologies and cross-functional collaboration.`,
        },
        {
          role: 'Web Dev Intern',
          organization: 'Tryidol Technologies',
          period: 'Jun 2023 – Dec 2023 · India',
          content: `Built and maintained web applications as part of an engineering team focused on client-facing digital products.
Gained hands-on experience with full-stack development workflows, deployment, and iterative feature delivery.`,
        },
        {
          role: 'Graphic Designer',
          organization: 'Forture Info Tech Pvt Ltd',
          period: 'Feb 2021 – Apr 2021 · Bengaluru, Karnataka, India',
          content: `Delivered high-quality designs including logos and social media posts that met or exceeded client expectations.
Managed multiple design projects simultaneously in a fast-paced environment while meeting deadlines.`,
        },
      ],
    }),
  },
  {
    id: 'about-education',
    title: 'Education',
    category: 'about',
    content: JSON.stringify({
      format: 'timeline',
      entries: [
        {
          role: 'Bachelor of Technology (B.Tech) · Computer Science & IT',
          organization: 'Maulana Azad National Urdu University, Hyderabad',
          period: '2021 – 2024',
          content: `Lateral entry program · Grade: A+
Focused on software engineering, web development, and computer science fundamentals.`,
        },
        {
          role: 'Diploma · Computer Science & Engineering',
          organization: 'Maulana Azad National Urdu University, Bangalore',
          period: '2018 – 2021',
          content: '',
        },
      ],
    }),
  },
] as const;

async function seedAboutContent(): Promise<void> {
  for (const section of ABOUT_SECTIONS) {
    await prisma.knowledgeBase.upsert({
      where: { id: section.id },
      create: {
        id: section.id,
        title: section.title,
        content: section.content,
        category: section.category,
        active: true,
      },
      update: {
        title: section.title,
        content: section.content,
        category: section.category,
        active: true,
      },
    });
  }

  console.log('About sections seeded (About Me, Experience, Education)');
}

async function seedAiKnowledgeBase(): Promise<void> {
  for (const entry of AI_KNOWLEDGE_ENTRIES) {
    await prisma.knowledgeBase.upsert({
      where: { id: entry.id },
      create: {
        id: entry.id,
        title: entry.title,
        content: entry.content,
        category: entry.category,
        active: true,
      },
      update: {
        title: entry.title,
        content: entry.content,
        category: entry.category,
        active: true,
      },
    });
  }

  console.log('AI knowledge base seeded (profile, skills, services, experience, projects, FAQ)');
}

async function main(): Promise<void> {
  await seedRoles();
  await seedAdminUser();
  await seedSiteSettings();
  await seedAboutContent();
  await seedAiKnowledgeBase();
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
