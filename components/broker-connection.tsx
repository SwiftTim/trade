"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Link, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface Broker {
  id: string
  name: string
  logo: string
  supported: boolean
  features: string[]
  description: string
}

interface BrokerConnection {
  id: string
  brokerId: string
  accountId: string
  status: "connected" | "disconnected" | "error"
  balance: number
  equity: number
  lastSync: string
}

export function BrokerConnection() {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [connections, setConnections] = useState<BrokerConnection[]>([])
  const [selectedBroker, setSelectedBroker] = useState("")
  const [showConnectionForm, setShowConnectionForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [connectionForm, setConnectionForm] = useState({
    accountId: "",
    apiKey: "",
    apiSecret: "",
    server: "",
  })

  useEffect(() => {
    fetchBrokers()
    fetchConnections()
  }, [])

  const fetchBrokers = async () => {
    try {
      const response = await fetch("/api/brokers")
      const result = await response.json()
      if (result.success) {
        setBrokers(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch brokers:", error)
    }
  }

  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/brokers/connect?userId=1") // Mock user ID
      const result = await response.json()
      if (result.success) {
        setConnections(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error)
    }
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/brokers/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brokerId: selectedBroker,
          userId: "1", // Mock user ID
          ...connectionForm,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Broker connected!",
          description: "Your broker account has been successfully connected.",
        })
        setShowConnectionForm(false)
        setConnectionForm({ accountId: "", apiKey: "", apiSecret: "", server: "" })
        fetchConnections()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect broker",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Connected Brokers */}
      {connections.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Connected Brokers</h3>
          {connections.map((connection) => {
            const broker = brokers.find((b) => b.id === connection.brokerId)
            return (
              <Card key={connection.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={broker?.logo || "/placeholder.svg"} alt={broker?.name} className="w-10 h-10 rounded" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{broker?.name}</span>
                          {getStatusIcon(connection.status)}
                          <Badge variant={connection.status === "connected" ? "default" : "destructive"}>
                            {connection.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-400">Account: {connection.accountId}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">${connection.balance.toLocaleString()}</div>
                      <div className="text-sm text-slate-400">Balance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add New Broker */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Link className="mr-2 h-5 w-5" />
            Connect Broker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showConnectionForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {brokers
                  .filter((broker) => broker.supported)
                  .map((broker) => (
                    <div
                      key={broker.id}
                      className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedBroker(broker.id)
                        setShowConnectionForm(true)
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <img src={broker.logo || "/placeholder.svg"} alt={broker.name} className="w-12 h-12 rounded" />
                        <div>
                          <h4 className="font-semibold text-white">{broker.name}</h4>
                          <p className="text-sm text-slate-400">{broker.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {broker.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white">
                  Connect {brokers.find((b) => b.id === selectedBroker)?.name}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowConnectionForm(false)}
                  className="text-slate-400"
                >
                  Cancel
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountId" className="text-white">
                    Account ID
                  </Label>
                  <Input
                    id="accountId"
                    value={connectionForm.accountId}
                    onChange={(e) => setConnectionForm({ ...connectionForm, accountId: e.target.value })}
                    placeholder="Enter your account ID"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-white">
                    API Key
                  </Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm({ ...connectionForm, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                {selectedBroker !== "mt4" && selectedBroker !== "mt5" && (
                  <div className="space-y-2">
                    <Label htmlFor="apiSecret" className="text-white">
                      API Secret
                    </Label>
                    <Input
                      id="apiSecret"
                      type="password"
                      value={connectionForm.apiSecret}
                      onChange={(e) => setConnectionForm({ ...connectionForm, apiSecret: e.target.value })}
                      placeholder="Enter your API secret"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                )}

                {(selectedBroker === "mt4" || selectedBroker === "mt5") && (
                  <div className="space-y-2">
                    <Label htmlFor="server" className="text-white">
                      Server
                    </Label>
                    <Input
                      id="server"
                      value={connectionForm.server}
                      onChange={(e) => setConnectionForm({ ...connectionForm, server: e.target.value })}
                      placeholder="e.g., MetaQuotes-Demo"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                )}
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <p className="font-medium mb-1">Security Notice:</p>
                    <p>
                      Your API keys are encrypted and stored securely. We only use trade-only permissions and never
                      access withdrawal functions.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? "Connecting..." : "Connect Broker"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
