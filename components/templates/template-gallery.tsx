"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Copy } from "lucide-react"

interface TemplateGalleryItem {
  id: string
  name: string
  description: string
  thumbnail?: string
  category: string
}

const DEFAULT_TEMPLATES: TemplateGalleryItem[] = [
  {
    id: "web-design",
    name: "Web Design Proposal",
    description: "Perfect for web design and development projects",
    category: "Design",
  },
  {
    id: "consulting",
    name: "Consulting Services",
    description: "Professional consulting engagement proposal",
    category: "Services",
  },
  {
    id: "marketing",
    name: "Marketing Campaign",
    description: "Marketing and advertising campaign proposal",
    category: "Marketing",
  },
  {
    id: "software",
    name: "Software Development",
    description: "Custom software development proposal",
    category: "Development",
  },
]

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Start with a Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEFAULT_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className="p-4 hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="mb-3 h-24 bg-muted rounded-md flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">{template.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
              <Button size="sm" variant="outline" className="w-full gap-2 bg-transparent">
                <Copy className="w-3 h-3" />
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
