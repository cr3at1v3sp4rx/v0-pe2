"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Plus,
  Trash2,
  GripVertical,
  Copy,
  FileText,
  DollarSign,
  Users,
  Clock,
  FileCheck,
  Pencil,
  Layout,
  Star,
  GitBranch,
  Workflow,
  CircleDot,
  BarChart3,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

const SECTION_TYPES = [
  { id: "cover", label: "Cover Page", description: "Professional cover page", icon: Layout, category: "content" },
  { id: "overview", label: "Overview", description: "Project overview", icon: FileText, category: "content" },
  { id: "services", label: "Services", description: "Services offered", icon: Star, category: "content" },
  { id: "pricing", label: "Pricing", description: "Pricing table", icon: DollarSign, category: "content" },
  { id: "timeline", label: "Timeline", description: "Project timeline", icon: Clock, category: "content" },
  { id: "team", label: "Team", description: "Team members", icon: Users, category: "content" },
  { id: "terms", label: "Terms & Conditions", description: "T&C section", icon: FileCheck, category: "content" },
  { id: "custom", label: "Custom Text", description: "Custom content", icon: Pencil, category: "content" },
]

const VISUAL_SECTION_TYPES = [
  { id: "mindmap", label: "Mind Map", description: "Branching ideas diagram", icon: GitBranch, category: "visual" },
  { id: "process", label: "Process Flow", description: "Step-by-step workflow", icon: Workflow, category: "visual" },
  {
    id: "comparison",
    label: "Comparison Chart",
    description: "Side-by-side compare",
    icon: BarChart3,
    category: "visual",
  },
  {
    id: "features",
    label: "Features Grid",
    description: "Highlight key features",
    icon: CircleDot,
    category: "visual",
  },
]

interface Section {
  id: string
  type: string
  title: string
  content: any
}

interface EditorSidebarProps {
  sections: Section[]
  selectedSectionId: string | null
  onSelectSection: (section: Section) => void
  onAddSection: (type: string) => void
  onRemoveSection: (id: string) => void
  onReorderSections?: (sections: Section[]) => void
  onDuplicateSection?: (id: string) => void
  isMobile?: boolean
}

export function EditorSidebar({
  sections,
  selectedSectionId,
  onSelectSection,
  onAddSection,
  onRemoveSection,
  onReorderSections,
  onDuplicateSection,
  isMobile,
}: EditorSidebarProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDragOverId(id)
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (draggedId && draggedId !== targetId && onReorderSections) {
      const draggedIndex = sections.findIndex((s) => s.id === draggedId)
      const targetIndex = sections.findIndex((s) => s.id === targetId)

      const newSections = [...sections]
      newSections.splice(draggedIndex, 1)
      newSections.splice(targetIndex, 0, sections[draggedIndex])

      onReorderSections(newSections)
    }
    setDraggedId(null)
    setDragOverId(null)
  }

  const getSectionIcon = (type: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      cover: Layout,
      overview: FileText,
      services: Star,
      pricing: DollarSign,
      timeline: Clock,
      team: Users,
      terms: FileCheck,
      custom: Pencil,
      mindmap: GitBranch,
      process: Workflow,
      comparison: BarChart3,
      features: CircleDot,
    }
    const Icon = iconMap[type] || FileText
    return <Icon className="w-4 h-4" />
  }

  return (
    <div className={`${isMobile ? "w-full" : "w-72"} border-r border-border bg-sidebar flex flex-col h-full`}>
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-sidebar-foreground mb-1">Sections</h2>
        <p className="text-xs text-muted-foreground mb-3">Tap to edit, drag to reorder</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full gap-2 h-12 text-base" size="lg">
              <Plus className="w-5 h-5" />
              Add Section
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Content Sections
            </DropdownMenuLabel>
            {SECTION_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.id}
                onClick={() => onAddSection(type.id)}
                className="flex items-start gap-3 py-3 px-3 animate-fade-in cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <type.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="font-medium text-sm block">{type.label}</span>
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Visual Sections</DropdownMenuLabel>
            {VISUAL_SECTION_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.id}
                onClick={() => onAddSection(type.id)}
                className="flex items-start gap-3 py-3 px-3 animate-fade-in cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <type.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <span className="font-medium text-sm block">{type.label}</span>
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No sections yet</p>
            <p className="text-xs mt-1">Add your first section above</p>
          </div>
        )}
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable={!isMobile}
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDrop={(e) => handleDrop(e, section.id)}
            onDragLeave={() => setDragOverId(null)}
            className={`group animate-slide-in transition-smooth ${dragOverId === section.id ? "opacity-50" : ""}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card
              onClick={() => onSelectSection(section)}
              className={`p-4 cursor-pointer transition-smooth active:scale-[0.98] ${
                selectedSectionId === section.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary/20"
                  : "bg-card hover:bg-sidebar-accent border-sidebar-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {!isMobile && (
                    <GripVertical
                      className={`w-4 h-4 flex-shrink-0 opacity-40 cursor-grab active:cursor-grabbing ${
                        selectedSectionId === section.id ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedSectionId === section.id ? "bg-primary-foreground/20" : "bg-primary/10"
                    }`}
                  >
                    <span className={selectedSectionId === section.id ? "text-primary-foreground" : "text-primary"}>
                      {getSectionIcon(section.type)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{section.title}</p>
                    <p
                      className={`text-xs capitalize ${
                        selectedSectionId === section.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {section.type}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex gap-1 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicateSection?.(section.id)
                    }}
                    className={`p-2 rounded-lg transition-smooth min-w-[44px] min-h-[44px] flex items-center justify-center ${
                      selectedSectionId === section.id
                        ? "hover:bg-primary-foreground/20 text-primary-foreground"
                        : "hover:bg-primary/10 text-muted-foreground"
                    }`}
                    title="Duplicate section"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveSection(section.id)
                    }}
                    className={`p-2 rounded-lg transition-smooth min-w-[44px] min-h-[44px] flex items-center justify-center ${
                      selectedSectionId === section.id
                        ? "hover:bg-destructive/20 text-primary-foreground"
                        : "hover:bg-destructive/10 text-destructive"
                    }`}
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
