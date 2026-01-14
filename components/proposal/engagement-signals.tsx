import { AlertCircle, Clock, MessageSquare } from "lucide-react"
import type { EngagementSignal } from "@/lib/shareable-links"

interface EngagementSignalsProps {
  signals: EngagementSignal[]
  compact?: boolean
}

export function EngagementSignals({ signals, compact = false }: EngagementSignalsProps) {
  if (signals.length === 0) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "last_viewed":
        return <Clock className="w-4 h-4" />
      case "updated":
        return <AlertCircle className="w-4 h-4" />
      case "new_feedback":
        return <MessageSquare className="w-4 h-4" />
      default:
        return null
    }
  }

  const getColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-50 border-red-200 text-red-700"
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "low":
        return "bg-green-50 border-green-200 text-green-700"
      default:
        return "bg-blue-50 border-blue-200 text-blue-700"
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {signals.map((signal, idx) => (
          <div
            key={idx}
            className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getColor(signal.urgency)}`}
          >
            {getIcon(signal.type)}
            <span>{signal.message}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {signals.map((signal, idx) => (
        <div key={idx} className={`p-3 rounded-lg border ${getColor(signal.urgency)} flex items-start gap-3`}>
          <div className="mt-0.5 shrink-0">{getIcon(signal.type)}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{signal.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
