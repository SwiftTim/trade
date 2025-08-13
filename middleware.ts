import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { apiRateLimiter, signalsRateLimiter, authRateLimiter } from "@/lib/rate-limiter"
import { performanceMonitor } from "@/lib/performance-monitor"

export function middleware(request: NextRequest) {
  const endTimer = performanceMonitor.startTimer("middleware")

  try {
    const { pathname } = request.nextUrl
    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    // Apply rate limiting based on route
    let rateLimiter = apiRateLimiter

    if (pathname.startsWith("/api/signals")) {
      rateLimiter = signalsRateLimiter
    } else if (pathname.startsWith("/api/auth") || pathname.includes("login") || pathname.includes("register")) {
      rateLimiter = authRateLimiter
    }

    if (!rateLimiter.isAllowed(clientIP)) {
      endTimer(false, { reason: "rate_limit", ip: clientIP })
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((rateLimiter.getResetTime(clientIP) - Date.now()) / 1000),
        },
        { status: 429 },
      )
    }

    // Add rate limit headers
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Remaining", rateLimiter.getRemainingRequests(clientIP).toString())
    response.headers.set("X-RateLimit-Reset", rateLimiter.getResetTime(clientIP).toString())

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

    endTimer(true)
    return response
  } catch (error) {
    endTimer(false, { error: error.message })
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
