"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { IntelligenceInsights } from "@/components/analytics/intelligence-insights"
import { getProposal, getProposalSections, getProposalAnalytics } from "@/lib/supabase/queries"

export const dynamic = "force-dynamic"

export default function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const proposalId = params.id as string

  const [proposal, setProposal] = useState<any>(null)
  const [sections, setSections] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProposalData = async () => {
      try {
        console.log("[v0] Loading proposal with ID:", proposalId)
        const [proposalData, sectionsData, analyticsData] = await Promise.all([
          getProposal(proposalId),
          getProposalSections(proposalId),
          getProposalAnalytics(proposalId),
        ])

        console.log("[v0] Proposal data:", proposalData)
        console.log("[v0] Sections data:", sectionsData)

        setProposal(proposalData)
        setSections(sectionsData || [])
        setAnalytics(analyticsData || [])
      } catch (err) {
        console.error("[v0] Error loading proposal:", err)
        setProposal({
          id: proposalId,
          title: "Sample Proposal",
          client_name: "Sample Client",
          description: "This is a sample proposal loaded from localStorage or fallback data",
          created_at: new Date().toISOString(),
        })
        setSections([
          { id: "1", title: "Overview", content: "Sample proposal overview section" },
          { id: "2", title: "Services", content: "Sample services offered" },
        ])
        setError(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (proposalId) {
      loadProposalData()
    }
  }, [proposalId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading proposal...</p>
        </div>
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Proposal Not Found</CardTitle>
            <CardDescription>{error || "The proposal you're looking for doesn't exist."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{proposal.title}</h1>
                <p className="text-sm text-muted-foreground">{proposal.client_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-12 animate-fade-in">
        {/* Proposal Info - Hide on mobile */}
        <div className="mb-8 hidden md:block">
          <h2 className="text-lg font-semibold text-muted-foreground mb-4">PROPOSAL INSIGHTS</h2>
          <IntelligenceInsights sectionEngagement={sections} />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-border/50">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 text-foreground font-medium border-b-2 transition-all duration-150 ${
                activeTab === "overview"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Proposal Details
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 text-foreground font-medium border-b-2 hidden md:inline-flex transition-all duration-150 ${
                activeTab === "analytics"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Detailed Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <Card className="hover:shadow-md transition-shadow duration-150">
                <CardHeader>
                  <CardTitle>Proposal Details</CardTitle>
                  <CardDescription>{proposal.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {sections.length > 0 ? (
                      sections.map((section: any) => (
                        <div key={section.id} className="space-y-2 animate-fade-in">
                          <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {typeof section.content === "string" ? section.content : JSON.stringify(section.content)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No sections in this proposal yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button className="flex-1 bg-transparent transition-all duration-150" variant="outline">
                  Request Changes
                </Button>
                <Button className="flex-1 transition-all duration-150">Edit Proposal</Button>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <Card className="mb-8 hidden md:block hover:shadow-md transition-shadow duration-150">
              <CardHeader>
                <CardTitle>Client Engagement Analytics</CardTitle>
                <CardDescription>Track how your client interacted with this proposal</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.length > 0 ? (
                  <AnalyticsDashboard proposalData={proposal} sectionData={sections} />
                ) : (
                  <p className="text-muted-foreground text-center py-8">No analytics data available yet.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
