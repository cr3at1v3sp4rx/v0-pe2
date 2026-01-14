"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { FileUp, FileText, TrendingUp, Clock, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { EngagementSignals } from "@/components/proposal/engagement-signals"
import { getProposals } from "@/lib/supabase/queries"

const PDFUploadDialog = dynamic(
  () => import("@/components/pdf/pdf-upload-dialog").then((mod) => ({ default: mod.PDFUploadDialog })),
  {
    ssr: false,
  },
)

export default function Dashboard() {
  const router = useRouter()
  const [showPDFUpload, setShowPDFUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [recentProposals, setRecentProposals] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    totalValue: "$0",
  })

  useEffect(() => {
    const loadProposals = async () => {
      try {
        const proposals = await getProposals()
        setRecentProposals(proposals || [])

        // Calculate stats
        const accepted = (proposals || []).filter((p: any) => p.status === "accepted").length
        const pending = (proposals || []).filter((p: any) => p.status === "draft" || p.status === "pending").length
        const totalValue = (proposals || [])
          .reduce((acc, p) => acc + (p.value ? parseFloat(p.value.replace("$", "").replace("K", "000")) : 0), 0)
          .toLocaleString("en-US", { style: "currency", currency: "USD" })
        setStats({
          total: proposals?.length || 0,
          accepted,
          pending,
          totalValue,
        })
      } catch (error) {
        console.error("[v0] Error loading proposals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProposals()
  }, [])

  const handlePDFUploadComplete = (sections: any[], templateName: string) => {
    // Store the imported sections in sessionStorage so the editor can access them
    const proposalData = {
      sections,
      designSettings: {
        accentColor: "#1e40af",
        coverStyle: "gradient",
        typography: "modern",
      },
      templateName,
    }
    const proposalId = Math.random().toString(36).substring(2, 10)
    sessionStorage.setItem(`proposal-import-${proposalId}`, JSON.stringify(proposalData))

    // Navigate to editor with the imported proposal
    router.push(`/editor?import=${proposalId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">ProposalHub</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Create stunning proposals in minutes
              </p>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-12 overflow-y-auto">
        {/* CTA Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 animate-fade-in">
          {/* Create New Proposal */}
          <Card
            className="border-2 border-accent/20 hover:border-accent/40 transition-all duration-200 group cursor-pointer h-full hover:shadow-lg hover:shadow-accent/10"
            onClick={() => router.push("/editor")}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors shrink-0">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">Create Proposal</CardTitle>
                    <CardDescription className="text-xs">Build from scratch or use a template</CardDescription>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-accent/50 group-hover:text-accent transition-colors shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                Use our powerful template engine to create professional proposals.
              </p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 font-medium">
                Start Creating
              </Button>
            </CardContent>
          </Card>

          {/* Upload PDF */}
          <Card
            className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 group cursor-pointer h-full hover:shadow-lg hover:shadow-primary/10"
            onClick={() => setShowPDFUpload(true)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                    <FileUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg">Upload PDF</CardTitle>
                    <CardDescription className="text-xs">Import existing proposals</CardDescription>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-primary/50 group-hover:text-primary transition-colors shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                Convert PDF documents into editable proposals.
              </p>
              <Button variant="outline" className="w-full bg-transparent h-11 font-medium">
                Upload PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="hidden sm:block mb-12">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Your Activity</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-12" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Proposals</CardTitle>
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">+3 this month</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Accepted</CardTitle>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.accepted}</div>
                    <p className="text-xs text-muted-foreground mt-1">75% acceptance rate</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                      <Clock className="w-4 h-4 text-yellow-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.totalValue}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Recent Proposals</h2>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              {recentProposals.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No proposals yet. Create one to get started!</p>
                  <Button className="mt-4 bg-accent hover:bg-accent/90" onClick={() => router.push("/editor")}>
                    Create Your First Proposal
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border/50 hover:border-accent/50 hover:bg-secondary/30 transition-all duration-150 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-foreground truncate">{proposal.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{proposal.date}</p>
                          {proposal.signals && proposal.signals.length > 0 && (
                            <div className="mt-2">
                              <EngagementSignals signals={proposal.signals} compact={true} />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            proposal.status === "accepted"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {proposal.status === "accepted" ? "✓" : "○"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/proposals/${proposal.id}`)}
                          className="h-8 px-2 sm:px-3 text-xs sm:text-sm"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PDF Upload Dialog */}
      <PDFUploadDialog
        isOpen={showPDFUpload}
        onClose={() => setShowPDFUpload(false)}
        onUploadComplete={handlePDFUploadComplete}
      />
    </div>
  )
}
