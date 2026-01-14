import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, TrendingUp, Lightbulb } from "lucide-react"
import { analyzeEngagement, analyzeProposalState, detectIntent } from "@/lib/intelligence-engines"
import type { SectionAnalytics } from "@/lib/analytics-types"

interface IntelligenceInsightsProps {
  sectionEngagement: SectionAnalytics[]
}

export function IntelligenceInsights({ sectionEngagement }: IntelligenceInsightsProps) {
  const engagement = analyzeEngagement(sectionEngagement)
  const state = analyzeProposalState(sectionEngagement)
  const intent = detectIntent(sectionEngagement)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-50 border-green-200",
      passive: "bg-blue-50 border-blue-200",
      stale: "bg-amber-50 border-amber-200",
      ghosted: "bg-red-50 border-red-200",
    }
    return colors[status] || "bg-gray-50 border-gray-200"
  }

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      passive: "secondary",
      stale: "outline",
      ghosted: "destructive",
    }
    return colors[status] || "default"
  }

  const getIntentColor = (intent: string) => {
    const colors: Record<string, string> = {
      ready: "bg-green-50 border-green-200",
      hesitating: "bg-amber-50 border-amber-200",
      reviewing: "bg-blue-50 border-blue-200",
      confused: "bg-red-50 border-red-200",
      unknown: "bg-gray-50 border-gray-200",
    }
    return colors[intent] || "bg-gray-50 border-gray-200"
  }

  const getIntentBadgeColor = (intent: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ready: "default",
      hesitating: "secondary",
      reviewing: "secondary",
      confused: "destructive",
      unknown: "outline",
    }
    return colors[intent] || "default"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {/* Engagement Intelligence */}
      <Card className={`border-2 ${getStatusColor(engagement.status)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-4 h-4" />
              Engagement Status
            </CardTitle>
            <Badge variant={getStatusBadgeColor(engagement.status)}>{engagement.status.toUpperCase()}</Badge>
          </div>
          <CardDescription className="text-sm">{engagement.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">URGENCY LEVEL</p>
            <Badge
              variant={
                engagement.urgency === "high"
                  ? "destructive"
                  : engagement.urgency === "medium"
                    ? "secondary"
                    : "outline"
              }
              className="capitalize"
            >
              {engagement.urgency}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">RECOMMENDED ACTIONS</p>
            <ul className="space-y-1">
              {engagement.actions.map((action, idx) => (
                <li key={idx} className="text-sm text-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* State & Progress Engine */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Proposal Readiness
            </CardTitle>
            <div className="text-2xl font-bold text-primary">{state.readiness}%</div>
          </div>
          <CardDescription className="text-sm">{state.phase.replace("-", " ").toUpperCase()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.readiness}%` }}
            />
          </div>
          {state.bottleneck && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-xs font-semibold text-amber-900 mb-1">BOTTLENECK DETECTED</p>
              <p className="text-sm text-amber-800">{state.bottleneck}</p>
            </div>
          )}
          <p className="text-sm text-foreground">{state.recommendation}</p>
        </CardContent>
      </Card>

      {/* Intent Detection Engine */}
      <Card className={`border-2 ${getIntentColor(intent.intent)}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4" />
              Detected Intent
            </CardTitle>
            <Badge variant={getIntentBadgeColor(intent.intent)} className="capitalize">
              {intent.intent.replace("-", " ")}
            </Badge>
          </div>
          <CardDescription className="text-sm">Confidence: {intent.confidence}%</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">BEHAVIOR SIGNALS</p>
            <ul className="space-y-1">
              {intent.signals.map((signal, idx) => (
                <li key={idx} className="text-sm text-foreground flex gap-2">
                  <span className="text-primary">•</span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded p-3">
            <p className="text-xs font-semibold text-primary mb-1">NEXT STEP</p>
            <p className="text-sm text-foreground font-medium">{intent.nextAction}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
