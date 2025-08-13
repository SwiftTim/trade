import { type NextRequest, NextResponse } from "next/server"

interface AdminUser {
  id: string
  name: string
  email: string
  subscription_tier: "free" | "basic" | "premium" | "vip"
  status: "active" | "suspended" | "banned"
  created_at: string
  last_login: string
  total_signals_copied: number
  total_spent: number
  broker_connected: boolean
}

// Mock admin data
const adminUsers: AdminUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    subscription_tier: "premium",
    status: "active",
    created_at: "2024-01-15T10:30:00Z",
    last_login: "2024-01-20T14:22:00Z",
    total_signals_copied: 145,
    total_spent: 297,
    broker_connected: true,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    subscription_tier: "vip",
    status: "active",
    created_at: "2024-01-10T09:15:00Z",
    last_login: "2024-01-20T16:45:00Z",
    total_signals_copied: 289,
    total_spent: 597,
    broker_connected: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    subscription_tier: "basic",
    status: "suspended",
    created_at: "2024-01-18T11:20:00Z",
    last_login: "2024-01-19T13:10:00Z",
    total_signals_copied: 67,
    total_spent: 49,
    broker_connected: false,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const tier = searchParams.get("tier")
  const search = searchParams.get("search")

  let filteredUsers = adminUsers

  if (status) {
    filteredUsers = filteredUsers.filter((user) => user.status === status)
  }

  if (tier) {
    filteredUsers = filteredUsers.filter((user) => user.subscription_tier === tier)
  }

  if (search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    )
  }

  return NextResponse.json({
    success: true,
    data: filteredUsers,
    total: filteredUsers.length,
  })
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, status } = body

    if (!userId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, this would update the user in the database
    const userIndex = adminUsers.findIndex((user) => user.id === userId)
    if (userIndex !== -1) {
      adminUsers[userIndex].status = status
    }

    return NextResponse.json({
      success: true,
      message: "User status updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}
