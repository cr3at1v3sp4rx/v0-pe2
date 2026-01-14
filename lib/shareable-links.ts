export interface ShareableLink {
  id: string
  proposalId: string
  createdAt: number
  lastViewed?: number
  password?: string
  viewCount: number
}

export interface EngagementSignal {
  type: "last_viewed" | "updated" | "new_feedback"
  timestamp?: number
  message: string
  urgency: "low" | "medium" | "high"
}

export function generateShareId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function createShareableLink(proposalId: string, password?: string): ShareableLink {
  return {
    id: generateShareId(),
    proposalId,
    createdAt: Date.now(),
    password: password ? btoa(password) : undefined,
    viewCount: 0,
  }
}

export function getEngagementSignals(proposalId: string): EngagementSignal[] {
  const signals: EngagementSignal[] = []

  if (typeof window === "undefined") {
    return signals
  }

  // Get last viewed timestamp
  const shareLinks = JSON.parse(localStorage.getItem("shareLinks") || "{}")
  const proposalLinks = Object.values(shareLinks as Record<string, ShareableLink>).filter(
    (link: any) => link.proposalId === proposalId,
  )

  if (proposalLinks.length > 0) {
    const mostRecent = (proposalLinks as ShareableLink[]).sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))[0]

    if (mostRecent.lastViewed) {
      const hoursAgo = Math.floor((Date.now() - mostRecent.lastViewed) / (1000 * 60 * 60))
      if (hoursAgo < 24) {
        signals.push({
          type: "last_viewed",
          timestamp: mostRecent.lastViewed,
          message: `Client viewed ${hoursAgo}h ago`,
          urgency: "low",
        })
      } else {
        signals.push({
          type: "last_viewed",
          timestamp: mostRecent.lastViewed,
          message: `Last viewed ${Math.floor(hoursAgo / 24)}d ago`,
          urgency: "medium",
        })
      }
    }
  }

  // Check if updated since last view
  const lastModified = localStorage.getItem(`proposal-${proposalId}-modified`)
  if (lastModified && proposalLinks.length > 0) {
    const mostRecentView = (proposalLinks as ShareableLink[]).map((l) => l.lastViewed || 0).sort((a, b) => b - a)[0]
    if (Number(lastModified) > mostRecentView) {
      signals.push({
        type: "updated",
        message: "Updated since last client view",
        urgency: "high",
      })
    }
  }

  return signals
}
