"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

interface Section {
  id: string
  type: string
  title: string
  content: any
}

interface PreviewPanelProps {
  sections: Section[]
  designSettings?: any
  isMobile?: boolean
}

export function PreviewPanel({ sections, designSettings, isMobile }: PreviewPanelProps) {
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
          <div
            key={section.id}
            className="text-center p-8 md:p-12 rounded-lg mb-6 md:mb-8 shadow-lg text-white min-h-60 md:min-h-80 flex flex-col justify-center"
            style={{
              background: getCoverBackground(),
              color: coverStyle === "minimal" ? "#333" : "white",
            }}
          >
            {section.content.companyName && (
              <p
                className="text-xs md:text-sm font-semibold mb-4 md:mb-6 opacity-90"
                style={{ color: coverStyle === "minimal" ? "#666" : "rgba(255,255,255,0.9)" }}
              >
                {section.content.companyName}
              </p>
            )}
            <h1 className="text-2xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight text-balance">
              {section.content.projectTitle || "Project Title"}
            </h1>
            {section.content.subtitle && (
              <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90">{section.content.subtitle}</p>
            )}
            {section.content.clientName && (
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-current border-opacity-20">
                <p className="text-base md:text-lg font-semibold">For: {section.content.clientName}</p>
              </div>
            )}
          </div>
        )

      case "services":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {(section.content.items || []).map((service: string, i: number) => (
                <Card key={i} className="p-4 md:p-6 bg-card/70 border-border hover:shadow-md transition-shadow">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg mb-3 md:mb-4"
                    style={{ backgroundColor: `${accentColor}20` }}
                  />
                  <p className="font-semibold text-foreground">{service}</p>
                  <p className="text-sm text-muted-foreground mt-2">Service description</p>
                </Card>
              ))}
            </div>
          </div>
        )

      case "pricing":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="space-y-3 md:space-y-4">
              {(section.content.packages || []).map((pkg: any, i: number) => (
                <Card
                  key={i}
                  className="p-4 md:p-6 border-2 hover:shadow-lg transition-all"
                  style={{
                    borderColor: i === 1 ? accentColor : "oklch(0.9 0 0)",
                    backgroundColor: i === 1 ? `${accentColor}05` : "white",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-foreground">{pkg.name}</h3>
                    <span className="text-xl md:text-2xl font-bold" style={{ color: accentColor }}>
                      {pkg.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )

      case "mindmap":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="relative py-8">
              {/* Central topic */}
              <div className="flex justify-center mb-8">
                <div
                  className="px-6 py-4 rounded-2xl text-white font-bold text-lg shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  {section.content.centralTopic || "Central Topic"}
                </div>
              </div>
              {/* Branches */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(section.content.branches || []).map((branch: any, idx: number) => (
                  <Card key={idx} className="p-4 border-l-4" style={{ borderLeftColor: accentColor }}>
                    <p className="font-semibold text-foreground mb-2">{branch.label}</p>
                    <ul className="space-y-1">
                      {(branch.items || []).map((item: string, itemIdx: number) => (
                        <li key={itemIdx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "process":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="space-y-0">
              {(section.content.steps || []).map((step: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                      style={{ backgroundColor: accentColor }}
                    >
                      {idx + 1}
                    </div>
                    {idx < (section.content.steps || []).length - 1 && (
                      <div className="w-0.5 h-16 mt-2" style={{ backgroundColor: `${accentColor}40` }} />
                    )}
                  </div>
                  <div className="pb-8 pt-1 flex-1">
                    <p className="font-bold text-lg text-foreground">{step.title}</p>
                    {step.description && <p className="text-muted-foreground text-sm mt-1">{step.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "comparison":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["optionA", "optionB"].map((option, optionIdx) => (
                <Card
                  key={option}
                  className="p-5 border-t-4"
                  style={{ borderTopColor: optionIdx === 0 ? accentColor : "#94a3b8" }}
                >
                  <h3 className="font-bold text-lg mb-4 text-foreground">
                    {section.content[option]?.name || `Option ${optionIdx + 1}`}
                  </h3>
                  <ul className="space-y-2">
                    {(section.content[option]?.features || []).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4" style={{ color: accentColor }} />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        )

      case "features":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(section.content.features || []).map((feature: any, idx: number) => (
                <Card key={idx} className="p-5 hover:shadow-md transition-shadow">
                  <div
                    className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )

      case "overview":
      case "custom":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground">{section.title}</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-base">
              {section.content.text || "No content"}
            </p>
          </div>
        )

      case "timeline":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="space-y-4 md:space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 md:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                    {i < 3 && <div className="w-1 h-12 md:h-16 mt-2" style={{ backgroundColor: `${accentColor}40` }} />}
                  </div>
                  <div className="pb-4 md:pb-6">
                    <p className="font-bold text-base md:text-lg text-foreground">Phase {i}</p>
                    <p className="text-muted-foreground text-sm">
                      Week {i * 2}-{i * 2 + 2}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "team":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="p-4 md:p-6 text-center border-border"
                  style={{ borderTopColor: accentColor, borderTopWidth: "4px" }}
                >
                  <div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-3 md:mb-4"
                    style={{ backgroundColor: `${accentColor}20` }}
                  />
                  <p className="font-bold text-foreground text-sm md:text-base">Team Member {i}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Role & Title</p>
                </Card>
              ))}
            </div>
          </div>
        )

      case "terms":
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-foreground">{section.title}</h2>
            <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
              <p>Terms and conditions would appear here.</p>
              <p>Include payment terms, scope limitations, and other important details.</p>
            </div>
          </div>
        )

      default:
        return (
          <div key={section.id} className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-foreground">{section.title}</h2>
            <p className="text-foreground/60 italic">Section type: {section.type}</p>
          </div>
        )
    }
  }

  return (
    <ScrollArea className={`${isMobile ? "w-full h-full" : "w-96"} border border-border rounded-xl bg-card shadow-sm`}>
      <div className="p-4 md:p-8 space-y-4 md:space-y-6 bg-gradient-to-b from-card to-background">
        <div className="sticky top-0 bg-card pb-3 md:pb-4 border-b border-border z-10">
          <h3 className="text-base md:text-lg font-bold text-foreground">Live Preview</h3>
          <p className="text-xs text-muted-foreground">See your proposal as clients will</p>
        </div>
        {sections.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p className="text-base">No sections yet</p>
            <p className="text-sm mt-2">Add sections to see your proposal</p>
          </div>
        ) : (
          sections.map(renderSection)
        )}
      </div>
    </ScrollArea>
  )
}
