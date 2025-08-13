// Rate limiting service for API protection
interface RateLimitEntry {
  count: number
  resetTime: number
}

export class RateLimiter {
  private limits = new Map<string, RateLimitEntry>()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs = 60 * 1000, maxRequests = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      // New window or expired entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return true
    }

    if (entry.count >= this.maxRequests) {
      return false
    }

    entry.count++
    return true
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return Date.now() + this.windowMs
    }
    return entry.resetTime
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key)
      }
    }
  }
}

// Different rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter(60 * 1000, 100) // 100 requests per minute
export const signalsRateLimiter = new RateLimiter(60 * 1000, 30) // 30 requests per minute for signals
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 5) // 5 auth attempts per 15 minutes

// Auto-cleanup every 5 minutes
setInterval(
  () => {
    apiRateLimiter.cleanup()
    signalsRateLimiter.cleanup()
    authRateLimiter.cleanup()
  },
  5 * 60 * 1000,
)
