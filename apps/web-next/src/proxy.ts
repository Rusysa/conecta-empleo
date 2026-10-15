// Route protection (CLAUDE.md §5.1). Next 16 renamed middleware.ts → proxy.ts.
// This is a fast first gate: without a session cookie, private areas redirect to login
// before rendering. The cookie is only verified by the API, so roles are still checked
// in each page via lib/authz.ts (defense in depth, as the Next docs recommend).
import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIES = ["__Host-conecta_session", "conecta_session"]

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (SESSION_COOKIES.some((name) => request.cookies.has(name))) return NextResponse.next()

  const login = new URL("/login", request.url)
  login.searchParams.set("callbackUrl", `${pathname}${search}`)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ["/candidato/:path*", "/empresa/:path*", "/admin/:path*"],
}
