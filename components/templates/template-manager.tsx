"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Download, Plus, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Template {
  id: string
  name: string
  description: string
  sections: any[]
  createdAt: string
}

interface TemplateManagerProps {
  templates: Template[]
  currentTemplateId: string
  onLoadTemplate: (id: string) => void
  onDeleteTemplate: (id: string) => void
  onCreateTemplate: (name: string, description: string) => void
  onClose: () => void
}

export function TemplateManager({
  templates,
  currentTemplateId,
  onLoadTemplate,
  onDeleteTemplate,
  onCreateTemplate,
  onClose,
}: TemplateManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateDescription, setNewTemplateDescription] = useState("")

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      onCreateTemplate(newTemplateName, newTemplateDescription)
      setNewTemplateName("")
      setNewTemplateDescription("")
      setShowCreateForm(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Template Manager</DialogTitle>
          <DialogDescription>Manage your proposal templates or create a new one</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {showCreateForm && (
            <Card className="p-4 bg-muted">
              <div className="space-y-3">
                <div>
                  <Label>Template Name</Label>
                  <Input
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g., Design Proposal 2024"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="Brief description of this template"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTemplate} className="gap-2" disabled={!newTemplateName.trim()}>
                    <Check className="w-4 h-4" />
                    Create Template
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)} className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Save Current as Template
            </Button>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all ${
                  currentTemplateId === template.id ? "bg-primary/10 border-primary" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0" onClick={() => onLoadTemplate(template.id)}>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      {template.name}
                      {currentTemplateId === template.id && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Current</span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">{template.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {template.sections.length} sections • {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => onLoadTemplate(template.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    {currentTemplateId !== template.id && (
                      <Button variant="ghost" size="sm" onClick={() => onDeleteTemplate(template.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
