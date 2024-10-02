import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';

acceptLanguage.languages(['fr', 'en']);

export function middleware(request: NextRequest) {

    
  const url = request.nextUrl.clone();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/marketing'
  const staticFileExtensions = ['jpg', 'jpeg', 'png', 'svg', 'woff', 'woff2', 'ttf'];

  // Check if the request is for a static file by matching the extension
  const isStaticFile = staticFileExtensions.some(ext => url.pathname.endsWith(`.${ext}`));

  if (isStaticFile) {
    url.pathname = `${basePath}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

