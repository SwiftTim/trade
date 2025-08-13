"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tierFilter, setTierFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [statusFilter, tierFilter, searchTerm])

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (tierFilter !== "all") params.append("tier", tierFilter)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/admin/users?${params}`)
      const result = await response.json()
      if (result.success) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setLoading(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status: newStatus,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "User updated",
          description: `User status changed to ${newStatus}`,
        })
        fetchUsers()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update user status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "suspended":
        return "bg-yellow-600"
      case "banned":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip":
        return "bg-purple-600"
      case "premium":
        return "bg-blue-600"
      case "basic":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-slate-400">Manage platform users and their subscriptions</p>
          </div>

          {/* Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Subscription" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setTierFilter("all")
                  }}
                  className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300">User</th>
                      <th className="text-left py-3 px-4 text-slate-300">Subscription</th>
                      <th className="text-left py-3 px-4 text-slate-300">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300">Activity</th>
                      <th className="text-left py-3 px-4 text-slate-300">Revenue</th>
                      <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700/50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-sm text-slate-400">{user.email}</div>
                            <div className="text-xs text-slate-500">
                              Joined {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getTierColor(user.subscription_tier)} text-white`}>
                            {user.subscription_tier.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getStatusColor(user.status)} text-white`}>
                            {user.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-white">{user.total_signals_copied} signals</div>
                          <div className="text-xs text-slate-400">
                            Last login: {new Date(user.last_login).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-medium text-white">${user.total_spent}</div>
                        </td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700" align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, "active")}
                                className="text-white hover:bg-slate-700"
                              >
                                Set Active
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, "suspended")}
                                className="text-white hover:bg-slate-700"
                              >
                                Suspend User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(user.id, "banned")}
                                className="text-white hover:bg-slate-700"
                              >
                                Ban User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
