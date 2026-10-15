// Route protection by role (CLAUDE.md §5.1). Next 16 renamed middleware.ts → proxy.ts.
// This is a fast first gate that redirects before rendering; pages still check the
// session themselves via lib/authz.ts (defense in depth, as the Next docs recommend).
// TODO(auth): read the role from the Auth.js session instead of the mock cookie.
import { NextResponse, type NextRequest } from "next/server"

const AREA_ROLES: { prefix: string; roles: string[] }[] = [
  { prefix: "/candidato", roles: ["CANDIDATE", "CANDIDATE_INCOMPLETE"] },
  { prefix: "/empresa", roles: ["COMPANY"] },
  { prefix: "/admin", roles: ["ADMIN"] },
]

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const area = AREA_ROLES.find((a) => pathname === a.prefix || pathname.startsWith(`${a.prefix}/`))
  if (!area) return NextResponse.next()

  const role = request.cookies.get("mock_role")?.value ?? "GUEST"

  if (role === "GUEST") {
    const login = new URL("/login", request.url)
    login.searchParams.set("callbackUrl", `${pathname}${search}`)
    return NextResponse.redirect(login)
  }
  if (!area.roles.includes(role)) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/candidato/:path*", "/empresa/:path*", "/admin/:path*"],
}
