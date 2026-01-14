"use client"

import { Button } from "@/components/ui/button"
import { Layers, Edit3, Eye } from "lucide-react"

interface MobileNavProps {
  activeView: "sections" | "edit" | "preview"
  onViewChange: (view: "sections" | "edit" | "preview") => void
  sectionCount: number
}

export function MobileNav({ activeView, onViewChange, sectionCount }: MobileNavProps) {
  const navItems = [
    {
      id: "sections" as const,
      label: "Sections",
      icon: Layers,
      badge: sectionCount,
    },
    {
      id: "edit" as const,
      label: "Edit",
      icon: Edit3,
    },
    {
      id: "preview" as const,
      label: "Preview",
      icon: Eye,
    },
  ]

  return (
    <nav className="md:hidden border-t border-border bg-card px-2 py-2 safe-area-pb">
      <div className="flex justify-around gap-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            onClick={() => onViewChange(item.id)}
            className={`flex-1 flex-col h-14 gap-1 relative ${
              activeView === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-1/4 bg-accent text-accent-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {item.badge}
              </span>
            )}
          </Button>
        ))}
      </div>
    </nav>
  )
}
