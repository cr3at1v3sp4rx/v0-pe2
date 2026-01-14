"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { IntelligenceInsights } from "@/components/analytics/intelligence-insights"
import { getEngagementSignals } from "@/lib/shareable-links"
import { EngagementSignals } from "@/components/proposal/engagement-signals"

// Mock proposal data - in a real app, this would come from a database
const proposalsData: Record<number, any> = {
  1: {
    id: 1,
    name: "Q4 Website Redesign",
    client: "Acme Corporation",
    date: "2 days ago",
    status: "accepted",
    value: "$45,000",
    description: "Complete website redesign and implementation",
    sections: [
      { title: "Executive Summary", content: "A comprehensive website redesign project..." },
      { title: "Project Scope", content: "We will redesign and implement a modern website..." },
      { title: "Timeline", content: "Project duration: 12 weeks" },
      { title: "Pricing", content: "$45,000 total investment" },
    ],
  },
  2: {
    id: 2,
    name: "Mobile App Development",
    client: "TechStart Inc",
    date: "1 week ago",
    status: "pending",
    value: "$85,000",
    description: "Native iOS and Android mobile application",
    sections: [
      { title: "Executive Summary", content: "Development of a native mobile application..." },
      { title: "Project Scope", content: "iOS and Android applications with backend..." },
      { title: "Timeline", content: "Project duration: 20 weeks" },
      { title: "Pricing", content: "$85,000 total investment" },
    ],
  },
  3: {
    id: 3,
    name: "Brand Strategy Consultation",
    client: "StartupXYZ",
    date: "2 weeks ago",
    status: "accepted",
    value: "$15,000",
    description: "Strategic brand positioning and identity design",
    sections: [
      { title: "Executive Summary", content: "Brand strategy consultation and development..." },
      { title: "Project Scope", content: "Brand positioning, identity design, guidelines..." },
      { title: "Timeline", content: "Project duration: 6 weeks" },
      { title: "Pricing", content: "$15,000 total investment" },
    ],
  },
}

export const dynamic = "force-dynamic"

export default function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const proposalId = Number(params.id)
  const proposal = proposalsData[proposalId]
  const [activeTab, setActiveTab] = useState<"overview" | "analytics">("overview")
  const [shareLinks, setShareLinks] = useState<any[]>([])

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("shareLinks") || "{}")
    const proposalLinks = Object.values(links).filter((link: any) => link.proposalId === proposalId)
    setShareLinks(proposalLinks)
  }, [proposalId])

  const signals = getEngagementSignals(proposalId)

  const mockEngagement = [
    { sectionTitle: "Cover Page", viewCount: 12, totalTimeSpent: 240, revisitCount: 2, popularity: "high" },
    { sectionTitle: "Executive Summary", viewCount: 11, totalTimeSpent: 450, revisitCount: 1, popularity: "high" },
    { sectionTitle: "Project Scope", viewCount: 9, totalTimeSpent: 320, revisitCount: 3, popularity: "medium" },
    { sectionTitle: "Pricing", viewCount: 12, totalTimeSpent: 600, revisitCount: 4, popularity: "high" },
    { sectionTitle: "Timeline", viewCount: 6, totalTimeSpent: 180, revisitCount: 0, popularity: "low" },
  ]

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Proposal Not Found</CardTitle>
            <CardDescription>The proposal you're looking for doesn't exist.</CardDescription>
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
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{proposal.name}</h1>
                <p className="text-sm text-muted-foreground">{proposal.client}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {signals.length > 0 && <EngagementSignals signals={signals} compact={true} />}
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
          <IntelligenceInsights sectionEngagement={mockEngagement} />
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
                    {proposal.sections.map((section: any, index: number) => (
                      <div key={index} className="space-y-2 animate-fade-in">
                        <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    ))}
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
                <AnalyticsDashboard proposalData={proposal} sectionData={mockEngagement} />
              </CardContent>
            </Card>
          )}
        </div>

        {signals.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <EngagementSignals signals={signals} compact={false} />
          </div>
        )}
      </div>
    </div>
  )
}
