import { NextRequest, NextResponse } from 'next/server';

function isAllowedPdfSource(url: string): boolean {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'https:') return false;

    return (
      parsed.hostname === 'res.cloudinary.com' ||
      parsed.hostname.endsWith('.onrender.com') ||
      parsed.hostname === 'localhost'
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const filename = request.nextUrl.searchParams.get('filename')?.trim() || 'resume.pdf';
  const safeFilename = filename.replace(/[^\w\s.-]/g, '').trim() || 'resume.pdf';

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  if (!isAllowedPdfSource(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const upstream = await fetch(url, { cache: 'no-store' });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: 502 }
      );
    }

    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${safeFilename}"`,
        'Cache-Control': 'public, max-age=3600',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 502 });
  }
}
