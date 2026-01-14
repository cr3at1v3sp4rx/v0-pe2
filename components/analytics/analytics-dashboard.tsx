"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Eye, Clock, RotateCcw, TrendingUp } from "lucide-react"

interface AnalyticsDashboardProps {
  proposalData?: any
  sectionEngagement?: any[]
}

export function AnalyticsDashboard({ proposalData, sectionEngagement = [] }: AnalyticsDashboardProps) {
  // Mock engagement data if not provided
  const engagement =
    sectionEngagement.length > 0
      ? sectionEngagement
      : [
          { sectionTitle: "Cover Page", viewCount: 12, totalTimeSpent: 240, revisitCount: 2, popularity: "high" },
          { sectionTitle: "Project Overview", viewCount: 11, totalTimeSpent: 450, revisitCount: 1, popularity: "high" },
          { sectionTitle: "Services", viewCount: 9, totalTimeSpent: 320, revisitCount: 3, popularity: "medium" },
          { sectionTitle: "Pricing", viewCount: 12, totalTimeSpent: 600, revisitCount: 4, popularity: "high" },
          { sectionTitle: "Timeline", viewCount: 6, totalTimeSpent: 180, revisitCount: 0, popularity: "low" },
          { sectionTitle: "Team", viewCount: 5, totalTimeSpent: 120, revisitCount: 0, popularity: "low" },
        ]

  const timeSpentData = engagement.map((s) => ({
    name: s.sectionTitle.substring(0, 10),
    minutes: Math.round(s.totalTimeSpent / 60),
  }))

  const viewsData = engagement.map((s) => ({
    name: s.sectionTitle.substring(0, 10),
    views: s.viewCount,
  }))

  const revisitData = engagement.map((s) => ({
    name: s.sectionTitle.substring(0, 10),
    revisits: s.revisitCount,
  }))

  const avgTimeSpent = Math.round(
    engagement.reduce((sum, s) => sum + s.totalTimeSpent / s.viewCount, 0) / engagement.length,
  )
  const totalViews = engagement.reduce((sum, s) => sum + s.viewCount, 0)
  const highEngagementSections = engagement.filter((s) => s.popularity === "high").length

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">across all sections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time/Section</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTimeSpent}s</div>
            <p className="text-xs text-muted-foreground">average engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highEngagementSections}</div>
            <p className="text-xs text-muted-foreground">sections with high interest</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revisits</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagement.reduce((sum, s) => sum + s.revisitCount, 0)}</div>
            <p className="text-xs text-muted-foreground">client re-engagements</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Section Views</CardTitle>
            <CardDescription>Number of times each section was viewed</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Spent per Section</CardTitle>
            <CardDescription>Total minutes client spent viewing each section</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSpentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="minutes" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Section Revisits</CardTitle>
            <CardDescription>How many times client returned to each section</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revisitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revisits"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-3))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Heatmap</CardTitle>
            <CardDescription>Overall section engagement intensity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {engagement.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{section.sectionTitle}</span>
                    <span className="text-muted-foreground">{section.viewCount} views</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        section.popularity === "high"
                          ? "bg-green-500"
                          : section.popularity === "medium"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(section.viewCount / Math.max(...engagement.map((s) => s.viewCount))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
