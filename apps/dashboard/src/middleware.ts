import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from '@/app/i18n/settings'

acceptLanguage.languages(languages)


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
 
  ]
}

export function middleware(req: NextRequest) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/admin'
  
  let lng
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng
 
  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`${basePath}/${lng}${req.nextUrl.pathname}`, req.url))
  }
  const refererHeader = req.headers.get('referer')
  if (refererHeader) {
    const refererUrl = new URL(refererHeader)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`${basePath}/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
}