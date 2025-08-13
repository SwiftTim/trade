import { NextResponse } from "next/server"
import { cacheService } from "@/lib/cache-service"
import { performanceMonitor } from "@/lib/performance-monitor"
import { config, validateConfig } from "@/lib/config"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const endTimer = performanceMonitor.startTimer("health_check")

  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      checks: {
        config: validateConfig(),
        database: false,
        cache: true,
        features: config.features,
      },
      performance: performanceMonitor.getStats(),
      cache: cacheService.getStats(),
    }

    // Test database connection
    try {
      const supabase = createServerClient()
      const { error } = await supabase.from("signals").select("count").limit(1)
      health.checks.database = !error
    } catch (error) {
      health.checks.database = false
    }

    // Determine overall status
    const allChecksPass = Object.values(health.checks).every((check) => (typeof check === "boolean" ? check : true))

    if (!allChecksPass) {
      health.status = "degraded"
    }

    endTimer(true)
    return NextResponse.json(health)
  } catch (error) {
    endTimer(false, { error: error.message })
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 },
    )
  }
}
