"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { SectionView, ClientEngagement } from "@/lib/analytics-types"
import { createBrowserClient } from "@supabase/ssr"

interface Section {
  id: string
  type: string
  title: string
  content: any
}

interface ProposalData {
  sections: Section[]
  designSettings: {
    accentColor: string
    coverStyle: "gradient" | "solid" | "minimal"
    typography: string
  }
  templateName: string
}

export const dynamic = "force-dynamic"

export default function ClientViewPage() {
  const params = useParams()
  const [proposal, setProposal] = useState<ProposalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionStartTime] = useState(Date.now())
  const [sectionViews, setSectionViews] = useState<SectionView[]>([])

  useEffect(() => {
    const loadProposal = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      )

      const { data, error } = await supabase.from("proposals").select("*").eq("id", params.id).single()

      if (data) {
        const proposalData: ProposalData = {
          sections: data.sections || [],
          designSettings: data.design_settings || {
            accentColor: "#1e40af",
            coverStyle: "gradient",
            typography: "modern",
          },
          templateName: data.template_name || "Untitled Proposal",
        }
        setProposal(proposalData)
      }
      setLoading(false)
    }

    loadProposal()
  }, [params.id])

  useEffect(() => {
    if (!proposal) return

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute("data-section-id")
        const sectionTitle = entry.target.getAttribute("data-section-title")

        if (entry.isIntersecting && sectionId && sectionTitle) {
          // Track section view
          setSectionViews((prev) => {
            const existingView = prev.find((v) => v.sectionId === sectionId)
            if (existingView) {
              return prev.map((v) =>
                v.sectionId === sectionId ? { ...v, revisited: true, timeSpent: Date.now() - sessionStartTime } : v,
              )
            }
            return [
              ...prev,
              {
                sectionId,
                sectionTitle,
                viewedAt: Date.now(),
                timeSpent: 0,
                revisited: false,
              },
            ]
          })
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    })

    // Observe all section elements
    document.querySelectorAll("[data-section-id]").forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [proposal, sessionStartTime])

  const saveAnalytics = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

    const engagement: ClientEngagement = {
      proposalId: params.id as string,
      clientId: `client-${Date.now()}`,
      sessionStarted: sessionStartTime,
      sessionEnded: Date.now(),
      sectionViews,
      totalTimeSpent: Date.now() - sessionStartTime,
      revisitCounts: sectionViews.reduce(
        (acc, view) => {
          acc[view.sectionId] = (acc[view.sectionId] || 0) + (view.revisited ? 1 : 0)
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    await supabase.from("engagements").insert([
      {
        proposal_id: params.id,
        client_id: engagement.clientId,
        data: engagement,
      },
    ])
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveAnalytics()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [sectionViews, sessionStartTime, params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading proposal...</div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <FileText className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Proposal Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">
          This proposal link may have expired or the proposal hasn&apos;t been shared yet.
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="w-4 h-4" />
            Go to Editor
          </Button>
        </Link>
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

  const renderSection = (section: Section) => {
    switch (section.type) {
      case "cover":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="min-h-[70vh] md:min-h-screen flex flex-col justify-center items-center text-center p-8 md:p-16"
            style={{
              background: getCoverBackground(),
              color: coverStyle === "minimal" ? "#333" : "white",
            }}
          >
            {section.content.companyName && (
              <p
                className="text-sm md:text-base font-semibold mb-6 md:mb-8 tracking-widest uppercase"
                style={{ color: coverStyle === "minimal" ? "#666" : "rgba(255,255,255,0.9)" }}
              >
                {section.content.companyName}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-balance max-w-4xl">
              {section.content.projectTitle || "Project Title"}
            </h1>
            {section.content.subtitle && (
              <p className="text-lg md:text-2xl mb-8 md:mb-12 opacity-90 max-w-2xl">{section.content.subtitle}</p>
            )}
            {section.content.clientName && (
              <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-current/20">
                <p className="text-base md:text-lg">Prepared for</p>
                <p className="text-xl md:text-2xl font-bold mt-2">{section.content.clientName}</p>
              </div>
            )}
          </section>
        )

      case "services":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {(section.content.items || []).map((service: string, i: number) => (
                <Card
                  key={i}
                  className="p-6 md:p-8 hover:shadow-lg transition-all border-l-4"
                  style={{ borderLeftColor: accentColor }}
                >
                  <div className="w-14 h-14 rounded-xl mb-5" style={{ backgroundColor: `${accentColor}15` }} />
                  <h3 className="font-bold text-xl text-foreground mb-2">{service}</h3>
                  <p className="text-muted-foreground">Professional service tailored to your needs</p>
                </Card>
              ))}
            </div>
          </section>
        )

      case "pricing":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 bg-muted/30"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground text-center">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {(section.content.packages || []).map((pkg: any, i: number) => (
                  <Card
                    key={i}
                    className={`p-6 md:p-8 hover:shadow-lg transition-all ${i === 1 ? "ring-2 scale-105" : ""}`}
                    style={{
                      ringColor: i === 1 ? accentColor : undefined,
                      borderTopWidth: "4px",
                      borderTopColor: i === 1 ? accentColor : "#e5e7eb",
                    }}
                  >
                    {i === 1 && (
                      <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: accentColor }}>
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                    <p className="text-3xl md:text-4xl font-bold mb-4" style={{ color: accentColor }}>
                      {pkg.price}
                    </p>
                    <p className="text-muted-foreground mb-6">{pkg.description}</p>
                    <Button
                      className="w-full h-12"
                      style={{
                        backgroundColor: i === 1 ? accentColor : "transparent",
                        color: i === 1 ? "white" : accentColor,
                        borderColor: accentColor,
                        borderWidth: i === 1 ? 0 : 2,
                      }}
                    >
                      Select Plan
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )

      case "mindmap":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground">{section.title}</h2>
            <div className="relative py-8">
              <div className="flex justify-center mb-12">
                <div
                  className="px-8 py-5 rounded-2xl text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  {section.content.centralTopic || "Central Topic"}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(section.content.branches || []).map((branch: any, idx: number) => (
                  <Card key={idx} className="p-6 border-l-4" style={{ borderLeftColor: accentColor }}>
                    <h3 className="font-bold text-lg text-foreground mb-4">{branch.label}</h3>
                    <ul className="space-y-2">
                      {(branch.items || []).map((item: string, itemIdx: number) => (
                        <li key={itemIdx} className="text-muted-foreground flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )

      case "process":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 bg-muted/30"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground">{section.title}</h2>
              <div className="space-y-0">
                {(section.content.steps || []).map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                        style={{ backgroundColor: accentColor }}
                      >
                        {idx + 1}
                      </div>
                      {idx < (section.content.steps || []).length - 1 && (
                        <div className="w-0.5 h-20 mt-4" style={{ backgroundColor: `${accentColor}40` }} />
                      )}
                    </div>
                    <div className="pb-12 pt-2 flex-1">
                      <h3 className="font-bold text-xl text-foreground mb-2">{step.title}</h3>
                      {step.description && <p className="text-muted-foreground">{step.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case "comparison":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {["optionA", "optionB"].map((option, optionIdx) => (
                <Card
                  key={option}
                  className="p-6 md:p-8 border-t-4"
                  style={{ borderTopColor: optionIdx === 0 ? accentColor : "#94a3b8" }}
                >
                  <h3 className="font-bold text-2xl mb-6 text-foreground">
                    {section.content[option]?.name || `Option ${optionIdx + 1}`}
                  </h3>
                  <ul className="space-y-3">
                    {(section.content[option]?.features || []).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${accentColor}20` }}
                        >
                          <Check className="w-3 h-3" style={{ color: accentColor }} />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>
        )

      case "features":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 bg-muted/30"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground text-center">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {(section.content.features || []).map((feature: any, idx: number) => (
                  <Card key={idx} className="p-6 md:p-8 hover:shadow-lg transition-all">
                    <div
                      className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
                      style={{ backgroundColor: `${accentColor}15` }}
                    >
                      <div className="w-7 h-7 rounded-full" style={{ backgroundColor: accentColor }} />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )

      case "overview":
      case "custom":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-foreground">{section.title}</h2>
            <p className="text-lg md:text-xl text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {section.content.text || "No content"}
            </p>
          </section>
        )

      case "timeline":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 bg-muted/30"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground">{section.title}</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: accentColor }} />
                      {i < 3 && <div className="w-1 h-20 mt-3" style={{ backgroundColor: `${accentColor}40` }} />}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-bold text-xl text-foreground">Phase {i}</h3>
                      <p className="text-muted-foreground">
                        Week {i * 2}-{i * 2 + 2}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case "team":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 max-w-6xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground text-center">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="p-6 md:p-8 text-center"
                  style={{ borderTopColor: accentColor, borderTopWidth: "4px" }}
                >
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-5"
                    style={{ backgroundColor: `${accentColor}20` }}
                  />
                  <h3 className="font-bold text-lg text-foreground">Team Member {i}</h3>
                  <p className="text-muted-foreground">Role & Title</p>
                </Card>
              ))}
            </div>
          </section>
        )

      case "terms":
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 bg-muted/30"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-foreground">{section.title}</h2>
              <div className="prose prose-lg max-w-none text-foreground/80">
                <p>Terms and conditions would appear here.</p>
                <p>Include payment terms, scope limitations, and other important details.</p>
              </div>
            </div>
          </section>
        )

      default:
        return (
          <section
            key={section.id}
            data-section-id={section.id}
            data-section-title={section.title}
            className="py-16 md:py-24 px-6 md:px-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">{section.title}</h2>
            <p className="text-muted-foreground italic">Section type: {section.type}</p>
          </section>
        )
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {sections.map(renderSection)}

      {/* Footer with accept/decline */}
      <footer className="py-12 md:py-16 px-6 md:px-16 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to proceed?</h3>
          <p className="text-muted-foreground mb-8">Accept this proposal to move forward with the project</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-10 text-lg"
              style={{ backgroundColor: accentColor }}
              onClick={() => {
                saveAnalytics()
                window.location.href = "/checkout"
              }}
            >
              Accept Proposal
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg bg-transparent">
              Request Changes
            </Button>
          </div>
        </div>
      </footer>
    </main>
  )
}
