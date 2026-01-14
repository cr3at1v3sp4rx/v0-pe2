"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Zap, Users, BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const steps = [
  {
    id: 1,
    title: "Welcome to Proposal Engine",
    subtitle: "Create stunning proposals in minutes, not days",
    description: "Build professional proposals that impress clients and close deals faster. No design skills required.",
    icon: Zap,
    visual: "📋",
  },
  {
    id: 2,
    title: "Choose Your Sections",
    subtitle: "Mix and match proposal sections",
    description:
      "Add cover pages, services, pricing, timelines, team info, and more. Drag to reorder exactly how you want.",
    icon: CheckCircle2,
    visual: "🎯",
  },
  {
    id: 3,
    title: "Customize Your Design",
    subtitle: "Match your brand in seconds",
    description: "Pick your accent color, typography style, and cover design. Every proposal reflects your brand.",
    icon: Zap,
    visual: "🎨",
  },
  {
    id: 4,
    title: "Share & Track Client Interest",
    subtitle: "Know when clients view your proposal",
    description: "Generate shareable links, track when clients view each section, and see engagement patterns.",
    icon: Users,
    visual: "🔗",
  },
  {
    id: 5,
    title: "Get Smart Insights",
    subtitle: "Understand client behavior instantly",
    description: "See engagement status, proposal readiness, and detected client intent with our AI-powered insights.",
    icon: BarChart3,
    visual: "💡",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/auth/login")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsVisible(true)
      }, 300)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Main content */}
        <div className={`transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <Card className="p-8 md:p-12 border-0 shadow-lg">
            {/* Icon and visual */}
            <div className="text-6xl mb-6 text-center">{step.visual}</div>

            {/* Content */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-foreground">{step.title}</h1>
              <p className="text-lg text-accent font-semibold mb-4">{step.subtitle}</p>
              <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
            </div>

            {/* Steps indicator */}
            <div className="flex gap-2 justify-center mb-8">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsVisible(false)
                    setTimeout(() => {
                      setCurrentStep(idx)
                      setIsVisible(true)
                    }, 300)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep ? "bg-accent w-8" : idx < currentStep ? "bg-accent/60 w-2" : "bg-muted w-2"
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground bg-transparent"
              >
                Skip
              </Button>
              <Button onClick={handleNext} className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          You can always access help and settings from your dashboard
        </div>
      </div>
    </div>
  )
}
