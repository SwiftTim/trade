// Centralized error handling and logging
export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  RATE_LIMIT = "RATE_LIMIT",
  EXTERNAL_API = "EXTERNAL_API",
  DATABASE = "DATABASE",
  INTERNAL = "INTERNAL",
}

export interface AppError {
  type: ErrorType
  message: string
  code?: string
  statusCode: number
  details?: any
  timestamp: string
}

export class ErrorHandler {
  static createError(type: ErrorType, message: string, statusCode = 500, code?: string, details?: any): AppError {
    return {
      type,
      message,
      code,
      statusCode,
      details,
      timestamp: new Date().toISOString(),
    }
  }

  static handleApiError(error: any): AppError {
    // Handle different types of errors
    if (error.name === "ValidationError") {
      return this.createError(ErrorType.VALIDATION, error.message, 400, "VALIDATION_FAILED", error.details)
    }

    if (error.name === "UnauthorizedError") {
      return this.createError(ErrorType.AUTHENTICATION, "Authentication required", 401, "AUTH_REQUIRED")
    }

    if (error.name === "ForbiddenError") {
      return this.createError(ErrorType.AUTHORIZATION, "Access denied", 403, "ACCESS_DENIED")
    }

    if (error.name === "NotFoundError") {
      return this.createError(ErrorType.NOT_FOUND, "Resource not found", 404, "NOT_FOUND")
    }

    if (error.name === "RateLimitError") {
      return this.createError(ErrorType.RATE_LIMIT, "Rate limit exceeded", 429, "RATE_LIMIT_EXCEEDED")
    }

    // Database errors
    if (error.code && error.code.startsWith("23")) {
      return this.createError(ErrorType.DATABASE, "Database constraint violation", 400, "DB_CONSTRAINT")
    }

    // External API errors
    if (error.response && error.response.status) {
      return this.createError(
        ErrorType.EXTERNAL_API,
        `External API error: ${error.message}`,
        502,
        "EXTERNAL_API_ERROR",
        {
          status: error.response.status,
          data: error.response.data,
        },
      )
    }

    // Default internal error
    return this.createError(ErrorType.INTERNAL, "Internal server error", 500, "INTERNAL_ERROR", {
      originalError: error.message,
      stack: error.stack,
    })
  }

  static logError(error: AppError, context?: string): void {
    const logData = {
      ...error,
      context,
      environment: process.env.NODE_ENV,
    }

    if (error.statusCode >= 500) {
      console.error("🚨 Server Error:", JSON.stringify(logData, null, 2))
    } else if (error.statusCode >= 400) {
      console.warn("⚠️ Client Error:", JSON.stringify(logData, null, 2))
    } else {
      console.info("ℹ️ Info:", JSON.stringify(logData, null, 2))
    }
  }

  static async handleAsyncError<T>(operation: () => Promise<T>, context?: string, fallback?: T): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      const appError = this.handleApiError(error)
      this.logError(appError, context)

      if (fallback !== undefined) {
        return fallback
      }

      return null
    }
  }
}

// Utility functions for common error scenarios
export const createValidationError = (message: string, details?: any) =>
  ErrorHandler.createError(ErrorType.VALIDATION, message, 400, "VALIDATION_FAILED", details)

export const createAuthError = (message = "Authentication required") =>
  ErrorHandler.createError(ErrorType.AUTHENTICATION, message, 401, "AUTH_REQUIRED")

export const createNotFoundError = (resource = "Resource") =>
  ErrorHandler.createError(ErrorType.NOT_FOUND, `${resource} not found`, 404, "NOT_FOUND")

export const createRateLimitError = (message = "Rate limit exceeded") =>
  ErrorHandler.createError(ErrorType.RATE_LIMIT, message, 429, "RATE_LIMIT_EXCEEDED")
