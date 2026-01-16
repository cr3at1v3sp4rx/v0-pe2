"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, FileText } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface ProposalData {
  sections: any[]
  designSettings: {
    accentColor: string
    coverStyle: "gradient" | "solid" | "minimal"
    typography: string
  }
  templateName: string
}

export const dynamic = "force-dynamic"

export default function SharePage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [passwordProtected, setPasswordProtected] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [authorized, setAuthorized] = useState(false)
  const [proposal, setProposal] = useState<ProposalData | null>(null)

  useEffect(() => {
    const loadShareLink = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      )

      // Get share link info
      const { data: shareData } = await supabase.from("shares").select("*").eq("id", shareId).single()

      if (!shareData) {
        setError("This shared link is no longer available")
        return
      }

      // Update last viewed
      await supabase
        .from("shares")
        .update({
          last_viewed: new Date(),
          view_count: (shareData.view_count || 0) + 1,
        })
        .eq("id", shareId)

      // Get the proposal
      const { data: proposalData } = await supabase
        .from("proposals")
        .select("*")
        .eq("id", shareData.proposal_id)
        .single()

      if (proposalData) {
        const proposal: ProposalData = {
          sections: proposalData.sections || [],
          designSettings: proposalData.design_settings || {
            accentColor: "#1e40af",
            coverStyle: "gradient",
            typography: "modern",
          },
          templateName: proposalData.template_name || "Untitled Proposal",
        }
        setProposal(proposal)
      }

      if (!shareData.password) {
        setAuthorized(true)
      } else {
        setPasswordProtected(true)
      }
    }

    loadShareLink()
  }, [shareId])

  const handlePasswordSubmit = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

    const { data: shareData } = await supabase.from("shares").select("password").eq("id", shareId).single()

    if (shareData && btoa(password) === shareData.password) {
      setAuthorized(true)
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  if (passwordProtected && !authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Shared Proposal</h1>
            <p className="text-muted-foreground text-center mt-2">This proposal is password protected.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              className="h-11"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handlePasswordSubmit} className="w-full h-11">
              Unlock Proposal
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Link Unavailable</h1>
            <p className="text-muted-foreground text-center mt-2">{error}</p>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="animate-pulse text-muted-foreground">Loading proposal...</div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const { sections, designSettings } = proposal
  const accentColor = designSettings?.accentColor || "#1e40af"
  const coverStyle = designSettings?.coverStyle || "gradient"

  const getCoverBackground = () => {
    if (coverStyle === "gradient") {
      return `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`
    } else if (coverStyle === "solid") {
      return accentColor
    } else {
      return "#f8f8f8"
    }
  }

  // Import renderSection from the client view or create it here
  const renderSection = (section: any) => {
    // Placeholder for section rendering logic
    return <div>{section.title}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Render all sections like the client view does */}
      {sections.map((section) => renderSection(section))}

      {/* CTA Section at bottom */}
      <section className="py-16 md:py-24 px-6 md:px-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Ready to move forward?</h2>
          <p className="text-lg text-muted-foreground mb-8">Accept this proposal to get started</p>
          <Button size="lg" className="h-12 px-8 text-lg" style={{ backgroundColor: accentColor }}>
            Accept Proposal
          </Button>
        </div>
      </section>
    </div>
  )
}
