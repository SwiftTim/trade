import { createServerClient } from "./supabase/server"

export interface Signal {
  id: string
  pair: string
  direction: "BUY" | "SELL"
  entry_price: number
  stop_loss: number
  take_profit: number
  confidence: number
  analysis: string
  timeframe: string
  created_at: string
  expires_at: string
  status: "ACTIVE" | "EXPIRED" | "HIT_SL" | "HIT_TP" | "CANCELLED"
  actual_exit_price?: number
  actual_pnl?: number
  closed_at?: string
}

export interface PerformanceMetrics {
  total_signals: number
  winning_signals: number
  losing_signals: number
  win_rate: number
  avg_pnl: number
  total_pnl: number
  max_drawdown: number
  sharpe_ratio: number
}

export class SignalTrackingService {
  private supabase = createServerClient()

  // Store a new signal in the database
  async storeSignal(signal: Omit<Signal, "id" | "created_at" | "status">): Promise<string> {
    const { data, error } = await this.supabase
      .from("signals")
      .insert([
        {
          pair: signal.pair,
          direction: signal.direction,
          entry_price: signal.entry_price,
          stop_loss: signal.stop_loss,
          take_profit: signal.take_profit,
          confidence: signal.confidence,
          analysis: signal.analysis,
          timeframe: signal.timeframe,
          expires_at: signal.expires_at,
        },
      ])
      .select("id")
      .single()

    if (error) {
      throw new Error(`Failed to store signal: ${error.message}`)
    }

    return data.id
  }

  // Update signal outcome when it closes
  async updateSignalOutcome(
    signalId: string,
    outcome: "WIN" | "LOSS" | "BREAKEVEN" | "EXPIRED",
    exitPrice?: number,
    pnl?: number,
  ): Promise<void> {
    const updates: any = {
      status: outcome === "WIN" ? "HIT_TP" : outcome === "LOSS" ? "HIT_SL" : "EXPIRED",
      closed_at: new Date().toISOString(),
    }

    if (exitPrice) updates.actual_exit_price = exitPrice
    if (pnl) updates.actual_pnl = pnl

    const { error: signalError } = await this.supabase.from("signals").update(updates).eq("id", signalId)

    if (signalError) {
      throw new Error(`Failed to update signal: ${signalError.message}`)
    }

    // Store performance record
    const signal = await this.getSignal(signalId)
    if (signal) {
      const duration =
        signal.closed_at && signal.created_at
          ? Math.floor((new Date(signal.closed_at).getTime() - new Date(signal.created_at).getTime()) / (1000 * 60))
          : null

      const pnlPercentage = pnl || this.calculatePnlPercentage(signal, exitPrice || 0)

      const { error: perfError } = await this.supabase.from("signal_performance").insert([
        {
          signal_id: signalId,
          outcome,
          pnl_percentage: pnlPercentage,
          duration_minutes: duration,
        },
      ])

      if (perfError) {
        console.error("Failed to store performance record:", perfError.message)
      }
    }
  }

  // Get signal by ID
  async getSignal(signalId: string): Promise<Signal | null> {
    const { data, error } = await this.supabase.from("signals").select("*").eq("id", signalId).single()

    if (error) {
      console.error("Failed to get signal:", error.message)
      return null
    }

    return data
  }

  // Get recent signals with performance data
  async getRecentSignalsWithPerformance(limit = 50): Promise<Signal[]> {
    const { data, error } = await this.supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to get signals: ${error.message}`)
    }

    return data || []
  }

  // Calculate performance metrics for a given period
  async calculatePerformanceMetrics(days = 30): Promise<PerformanceMetrics> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await this.supabase
      .from("signal_performance")
      .select(`
        outcome,
        pnl_percentage,
        created_at,
        signals!inner(created_at)
      `)
      .gte("signals.created_at", startDate.toISOString())

    if (error) {
      throw new Error(`Failed to calculate metrics: ${error.message}`)
    }

    const performances = data || []
    const totalSignals = performances.length
    const winningSignals = performances.filter((p) => p.outcome === "WIN").length
    const losingSignals = performances.filter((p) => p.outcome === "LOSS").length
    const winRate = totalSignals > 0 ? (winningSignals / totalSignals) * 100 : 0

    const pnls = performances.map((p) => p.pnl_percentage)
    const avgPnl = pnls.length > 0 ? pnls.reduce((a, b) => a + b, 0) / pnls.length : 0
    const totalPnl = pnls.reduce((a, b) => a + b, 0)

    // Calculate max drawdown
    let maxDrawdown = 0
    let peak = 0
    let runningPnl = 0

    for (const pnl of pnls) {
      runningPnl += pnl
      if (runningPnl > peak) peak = runningPnl
      const drawdown = peak - runningPnl
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }

    // Calculate Sharpe ratio (simplified)
    const pnlStdDev = this.calculateStandardDeviation(pnls)
    const sharpeRatio = pnlStdDev > 0 ? avgPnl / pnlStdDev : 0

    return {
      total_signals: totalSignals,
      winning_signals: winningSignals,
      losing_signals: losingSignals,
      win_rate: winRate,
      avg_pnl: avgPnl,
      total_pnl: totalPnl,
      max_drawdown: maxDrawdown,
      sharpe_ratio: sharpeRatio,
    }
  }

  // Helper method to calculate PnL percentage
  private calculatePnlPercentage(signal: Signal, exitPrice: number): number {
    const entryPrice = signal.entry_price
    if (signal.direction === "BUY") {
      return ((exitPrice - entryPrice) / entryPrice) * 100
    } else {
      return ((entryPrice - exitPrice) / entryPrice) * 100
    }
  }

  // Helper method to calculate standard deviation
  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2))
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length
    return Math.sqrt(avgSquaredDiff)
  }

  // Track user following a signal
  async trackUserSignal(userId: string, signalId: string, positionSize: number, entryPrice: number): Promise<void> {
    const { error } = await this.supabase.from("user_signal_tracking").insert([
      {
        user_id: userId,
        signal_id: signalId,
        position_size: positionSize,
        actual_entry_price: entryPrice,
      },
    ])

    if (error) {
      throw new Error(`Failed to track user signal: ${error.message}`)
    }
  }
}
