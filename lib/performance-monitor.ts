// Performance monitoring and metrics collection
interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  success: boolean
  metadata?: any
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private readonly maxMetrics = 1000

  startTimer(name: string): () => void {
    const startTime = performance.now()
    const startTimestamp = Date.now()

    return (success = true, metadata?: any) => {
      const duration = performance.now() - startTime
      this.recordMetric({
        name,
        duration,
        timestamp: startTimestamp,
        success,
        metadata,
      })
    }
  }

  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }
  }

  getMetrics(name?: string, timeWindow?: number): PerformanceMetric[] {
    let filtered = this.metrics

    if (name) {
      filtered = filtered.filter((m) => m.name === name)
    }

    if (timeWindow) {
      const cutoff = Date.now() - timeWindow
      filtered = filtered.filter((m) => m.timestamp > cutoff)
    }

    return filtered
  }

  getAverageResponseTime(name: string, timeWindow = 5 * 60 * 1000): number {
    const metrics = this.getMetrics(name, timeWindow).filter((m) => m.success)
    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }

  getSuccessRate(name: string, timeWindow = 5 * 60 * 1000): number {
    const metrics = this.getMetrics(name, timeWindow)
    if (metrics.length === 0) return 0

    const successful = metrics.filter((m) => m.success).length
    return (successful / metrics.length) * 100
  }

  getStats(timeWindow = 5 * 60 * 1000): Record<string, any> {
    const recentMetrics = this.getMetrics(undefined, timeWindow)
    const metricNames = [...new Set(recentMetrics.map((m) => m.name))]

    const stats: Record<string, any> = {}

    for (const name of metricNames) {
      stats[name] = {
        count: recentMetrics.filter((m) => m.name === name).length,
        averageResponseTime: this.getAverageResponseTime(name, timeWindow),
        successRate: this.getSuccessRate(name, timeWindow),
      }
    }

    return stats
  }

  clear(): void {
    this.metrics = []
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// Decorator for monitoring async functions
export function monitored(name: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const endTimer = performanceMonitor.startTimer(name)
      try {
        const result = await originalMethod.apply(this, args)
        endTimer(true, { args: args.length })
        return result
      } catch (error) {
        endTimer(false, { error: error.message })
        throw error
      }
    }

    return descriptor
  }
}
