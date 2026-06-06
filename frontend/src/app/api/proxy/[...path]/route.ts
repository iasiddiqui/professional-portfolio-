import { NextRequest, NextResponse } from 'next/server';

const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

const FORWARD_REQUEST_HEADERS = ['content-type', 'accept', 'cookie', 'authorization'];

const FORWARD_RESPONSE_HEADERS = [
  'content-type',
  'set-cookie',
  'cache-control',
  'etag',
  'location',
];

function buildUpstreamUrl(pathSegments: string[], search: string): string {
  const path = pathSegments.join('/');
  const baseUrl = SERVER_API_URL.replace(/\/$/, '');
  // Browser calls /api/proxy/v1/... — strip the duplicate v1 prefix before joining with /api/v1 base.
  const upstreamPath = path.startsWith('v1/') ? path.slice(3) : path;
  return `${baseUrl}/${upstreamPath}${search}`;
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const targetUrl = buildUpstreamUrl(pathSegments, request.nextUrl.search);

  const headers = new Headers();

  for (const headerName of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (!['GET', 'HEAD'].includes(request.method)) {
    // Preserve binary bodies (multipart file uploads, etc.) — request.text() corrupts images.
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    if (FORWARD_RESPONSE_HEADERS.includes(key.toLowerCase())) {
      responseHeaders.append(key, value);
    }
  });

  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
