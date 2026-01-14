"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Layers, Edit3, Eye, Sparkles } from "lucide-react"

interface OnboardingTooltipProps {
  onDismiss: () => void
}

export function OnboardingTooltip({ onDismiss }: OnboardingTooltipProps) {
  const [step, setStep] = useState(0)

  const steps = [
    {
      icon: Sparkles,
      title: "Welcome to Proposal Builder",
      description: "Create stunning proposals in minutes. Let's show you around.",
    },
    {
      icon: Layers,
      title: "Add Sections",
      description: "Build your proposal by adding sections like Cover, Services, Pricing, and more.",
    },
    {
      icon: Edit3,
      title: "Edit Content",
      description: "Click any section to edit its content. Customize text, prices, and details.",
    },
    {
      icon: Eye,
      title: "Preview Changes",
      description: "See your proposal come to life in real-time as you edit.",
    },
  ]

  const currentStep = steps[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md p-6 animate-scale-in">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <currentStep.icon className="w-6 h-6 text-primary" />
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-9 w-9 -mt-2 -mr-2">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-2">{currentStep.title}</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">{currentStep.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-primary w-6" : "bg-border"}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="h-11">
                Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="h-11">
                Next
              </Button>
            ) : (
              <Button onClick={onDismiss} className="h-11">
                Get Started
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
