"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  subscription_tier: "free" | "basic" | "premium" | "vip"
  created_at: string
  broker_connected: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem("auth_token")
    if (token) {
      // In a real app, validate token with backend
      // For now, simulate user data
      setUser({
        id: "1",
        email: "demo@example.com",
        name: "Demo User",
        subscription_tier: "premium",
        created_at: new Date().toISOString(),
        broker_connected: false,
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        subscription_tier: "premium",
        created_at: new Date().toISOString(),
        broker_connected: false,
      }

      setUser(mockUser)
      localStorage.setItem("auth_token", "mock_jwt_token")
    } catch (error) {
      throw new Error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      const mockUser: User = {
        id: "1",
        email,
        name,
        subscription_tier: "free",
        created_at: new Date().toISOString(),
        broker_connected: false,
      }

      setUser(mockUser)
      localStorage.setItem("auth_token", "mock_jwt_token")
    } catch (error) {
      throw new Error("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth_token")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
