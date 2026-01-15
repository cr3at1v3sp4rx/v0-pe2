import type { SectionAnalytics } from "./analytics-types"

// Engagement Intelligence Engine
// Tracks meaningful human interaction to determine engagement state
export interface EngagementState {
  status: "active" | "passive" | "stale" | "ghosted"
  description: string
  actions: string[]
  urgency: "high" | "medium" | "low"
}

export function analyzeEngagement(sectionEngagement: SectionAnalytics[]): EngagementState {
  if (!sectionEngagement || sectionEngagement.length === 0) {
    return {
      status: "ghosted",
      description: "No engagement detected - client hasn't viewed the proposal",
      actions: ["Send follow-up reminder", "Check if email was received"],
      urgency: "high",
    }
  }

  const totalViews = sectionEngagement.reduce((sum, s) => sum + s.viewCount, 0)
  const totalRevisits = sectionEngagement.reduce((sum, s) => sum + s.revisitCount, 0)
  const avgTimePerSection = sectionEngagement.reduce((sum, s) => sum + s.avgTimePerView, 0) / sectionEngagement.length

  // Active: Multiple sections viewed, multiple revisits, good time investment
  if (totalViews > 8 && totalRevisits > 2 && avgTimePerSection > 45) {
    return {
      status: "active",
      description: "Client is actively reviewing and revisiting sections - highly engaged",
      actions: ["Be ready to answer questions", "Prepare to move to next steps", "Schedule follow-up call"],
      urgency: "low",
    }
  }

  // Passive: Viewed most sections but minimal revisits
  if (totalViews > 5 && totalRevisits <= 1 && avgTimePerSection > 30) {
    return {
      status: "passive",
      description: "Client reviewed the proposal but hasn't engaged deeply - light interaction",
      actions: ["Send clarification email", "Offer to discuss details", "Wait for client response"],
      urgency: "medium",
    }
  }

  // Stale: Viewed but minimal time or engagement
  if (totalViews > 0 && avgTimePerSection < 30) {
    return {
      status: "stale",
      description: "Client viewed briefly but hasn't engaged deeply - may need more clarity",
      actions: ["Send highlighted summary", "Request specific feedback", "Adjust proposal focus"],
      urgency: "high",
    }
  }

  return {
    status: "ghosted",
    description: "Minimal or no engagement detected",
    actions: ["Send reminder", "Check proposal clarity"],
    urgency: "high",
  }
}

// State & Progress Engine
// Determines proposal readiness and identifies bottlenecks
export interface ProposalState {
  phase: "not-started" | "reviewing" | "blocked" | "ready" | "complete"
  readiness: number // 0-100
  bottleneck?: string
  recommendation: string
}

export function analyzeProposalState(sectionEngagement: SectionAnalytics[]): ProposalState {
  if (!sectionEngagement || sectionEngagement.length === 0) {
    return {
      phase: "not-started",
      readiness: 0,
      recommendation: "Proposal not yet viewed by client",
    }
  }

  // Calculate readiness score based on engagement depth
  const avgRevisits = sectionEngagement.reduce((sum, s) => sum + s.revisitCount, 0) / sectionEngagement.length
  const viewCoverage = sectionEngagement.filter((s) => s.viewCount > 0).length / sectionEngagement.length
  const readiness = Math.round((avgRevisits * 15 + viewCoverage * 85) * 1)

  const criticalSections = ["Pricing", "Timeline", "Executive Summary"]
  const bottleneck = sectionEngagement.find(
    (s) => s.sectionTitle && criticalSections.some((cs) => s.sectionTitle.includes(cs)) && s.avgTimePerView < 30,
  )

  if (readiness < 25) {
    return {
      phase: "not-started",
      readiness,
      bottleneck: bottleneck?.sectionTitle,
      recommendation: "Client is just starting their review. Give them time to explore.",
    }
  }

  if (readiness < 50) {
    return {
      phase: "reviewing",
      readiness,
      bottleneck: bottleneck?.sectionTitle,
      recommendation: bottleneck
        ? `Client is stuck on ${bottleneck.sectionTitle}. Consider reaching out with clarification.`
        : "Client is actively reviewing. Monitor engagement closely.",
    }
  }

  if (readiness < 75) {
    return {
      phase: "blocked",
      readiness,
      bottleneck: bottleneck?.sectionTitle,
      recommendation: "Client engagement is inconsistent. Address concerns and clarify next steps.",
    }
  }

  if (readiness < 95) {
    return {
      phase: "ready",
      readiness,
      recommendation: "Client appears ready to move forward. Schedule discussion or presentation.",
    }
  }

  return {
    phase: "complete",
    readiness: 100,
    recommendation: "Client has thoroughly reviewed. Ready for decision or negotiation.",
  }
}

// Intent Detection Engine
// Infers client intent from behavior patterns
export interface IntentSignal {
  intent: "reviewing" | "hesitating" | "confused" | "ready" | "unknown"
  confidence: number // 0-100
  signals: string[]
  nextAction: string
}

export function detectIntent(sectionEngagement: SectionAnalytics[]): IntentSignal {
  if (!sectionEngagement || sectionEngagement.length === 0) {
    return {
      intent: "unknown",
      confidence: 0,
      signals: ["No engagement data available"],
      nextAction: "Send proposal link reminder",
    }
  }

  const signals: string[] = []
  let confidence = 0
  let intent: "reviewing" | "hesitating" | "confused" | "ready" | "unknown" = "unknown"

  // Analyze patterns
  const pricingSection = sectionEngagement.find((s) => s.sectionTitle && s.sectionTitle.includes("Pricing"))
  const executiveSummary = sectionEngagement.find((s) => s.sectionTitle && s.sectionTitle.includes("Executive Summary"))
  const avgRevisits = sectionEngagement.reduce((sum, s) => sum + (s.revisitCount || 0), 0) / sectionEngagement.length

  // Ready signals: High engagement, pricing viewed, multiple revisits
  if (
    pricingSection &&
    (pricingSection.viewCount || 0) > 3 &&
    (pricingSection.revisitCount || 0) > 1 &&
    executiveSummary &&
    (executiveSummary.viewCount || 0) > 0
  ) {
    intent = "ready"
    confidence = 85
    signals.push("Multiple reviews of pricing section", "Thorough exploration of proposal", "High engagement depth")
  }
  // Hesitating: Views everything but keeps coming back to price
  else if (pricingSection && (pricingSection.revisitCount || 0) > 2 && (pricingSection.timeSpent || 0) > 300) {
    intent = "hesitating"
    confidence = 75
    signals.push("Repeated focus on pricing", "Long time spent evaluating cost", "Possible budget concerns")
  }
  // Confused: Inconsistent viewing patterns or very short views
  else if (sectionEngagement.some((s) => (s.avgTimePerView || 0) < 20) && sectionEngagement.length > 1) {
    intent = "confused"
    confidence = 60
    signals.push("Quick, inconsistent section views", "May need clarification", "Consider proactive outreach")
  }
  // Reviewing: Methodical engagement
  else if (sectionEngagement.filter((s) => (s.viewCount || 0) > 0).length > 3 && avgRevisits < 1.5) {
    intent = "reviewing"
    confidence = 70
    signals.push("Systematic review in progress", "Steady engagement", "Normal evaluation timeline")
  }

  // Determine next action
  let nextAction = "Monitor engagement"
  if (intent === "ready") nextAction = "Schedule decision call"
  else if (intent === "hesitating") nextAction = "Offer pricing discussion or alternatives"
  else if (intent === "confused") nextAction = "Send clarification email or schedule walkthrough"
  else if (intent === "reviewing") nextAction = "Wait for next engagement"

  return {
    intent,
    confidence,
    signals,
    nextAction,
  }
}
