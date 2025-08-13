"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"

export function SignalCreator() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    symbol: "",
    action: "",
    price: "",
    target: "",
    stopLoss: "",
    confidence: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/signals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          trader: "Current_User", // In real app, get from auth context
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Signal created!",
          description: "Your trading signal has been published.",
        })
        setFormData({
          symbol: "",
          action: "",
          price: "",
          target: "",
          stopLoss: "",
          confidence: "",
          description: "",
        })
        setIsOpen(false)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create signal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="h-4 w-4 mr-2" />
        Create Signal
      </Button>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Create New Signal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-white">
                Symbol
              </Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                placeholder="e.g., EURUSD"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="action" className="text-white">
                Action
              </Label>
              <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="BUY">BUY</SelectItem>
                  <SelectItem value="SELL">SELL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">
                Entry Price
              </Label>
              <Input
                id="price"
                type="number"
                step="0.00001"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target" className="text-white">
                Target
              </Label>
              <Input
                id="target"
                type="number"
                step="0.00001"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss" className="text-white">
                Stop Loss
              </Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00001"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence" className="text-white">
              Confidence (%)
            </Label>
            <Input
              id="confidence"
              type="number"
              min="1"
              max="100"
              value={formData.confidence}
              onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Analysis (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide your market analysis..."
              className="bg-slate-700 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Creating..." : "Publish Signal"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
