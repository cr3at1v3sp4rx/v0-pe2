"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lock, FileText } from "lucide-react"

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
    // Get share link info from localStorage
    const shareLinks = JSON.parse(localStorage.getItem("shareLinks") || "{}")
    const link = shareLinks[shareId]

    if (!link) {
      setError("This shared link is no longer available")
      return
    }

    // Update last viewed timestamp
    link.lastViewed = Date.now()
    link.viewCount = (link.viewCount || 0) + 1
    localStorage.setItem("shareLinks", JSON.stringify(shareLinks))

    // Get the proposal data from sessionStorage
    const storedProposal = sessionStorage.getItem(`proposal-${link.proposalId}`)
    if (storedProposal) {
      setProposal(JSON.parse(storedProposal))
    }

    if (!link.password) {
      setAuthorized(true)
    } else {
      setPasswordProtected(true)
    }
  }, [shareId])

  const handlePasswordSubmit = () => {
    const shareLinks = JSON.parse(localStorage.getItem("shareLinks") || "{}")
    const link = shareLinks[shareId]

    if (btoa(password) === link.password) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <p className="text-center py-12 text-muted-foreground">
        Proposal shared successfully. Rendering proposal content...
      </p>
    </div>
  )
}
