export interface SectionView {
  sectionId: string
  sectionTitle: string
  viewedAt: number
  timeSpent: number
  revisited: boolean
}

export interface ClientEngagement {
  proposalId: string
  clientId: string
  sessionStarted: number
  sessionEnded?: number
  sectionViews: SectionView[]
  totalTimeSpent: number
  revisitCounts: Record<string, number>
}

export interface SectionAnalytics {
  sectionTitle: string
  viewCount: number
  totalTimeSpent: number
  revisitCount: number
  popularity: "high" | "medium" | "low"
  avgTimePerView: number
}

export interface ProposalAnalytics {
  proposalId: string
  totalViews: number
  totalEngagements: number
  avgTimePerSection: number
  engagedSections: SectionAnalytics[]
  clientBehavior: {
    scrollDepth: number
    mostViewedSection: string
    leastViewedSection: string
    totalRevisits: number
  }
}
