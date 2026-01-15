"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface Section {
  id: string
  type: string
  title: string
  content: any
}

interface ProposalEditorProps {
  section: Section | null
  onUpdate: (updates: any) => void
}

export function ProposalEditor({ section, onUpdate }: ProposalEditorProps) {
  if (!section) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>Select a section to begin editing</p>
      </div>
    )
  }

  const renderSectionTitle = () => (
    <div className="pb-4 mb-4 border-b border-border">
      <Label className="text-sm font-medium mb-2 block">Section Title</Label>
      <Input
        value={section.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        placeholder="e.g. Services, Overview, Team..."
        className="h-12 text-base font-semibold"
      />
      <p className="text-xs text-muted-foreground mt-1.5">This title appears in the proposal</p>
    </div>
  )

  const renderEditor = () => {
    switch (section.type) {
      case "cover":
        return (
          <div className="space-y-5">
            <div>
              <Label className="text-sm font-medium mb-2 block">Your Company Name</Label>
              <Input
                value={section.content.companyName || ""}
                onChange={(e) =>
                  onUpdate({
                    content: { ...section.content, companyName: e.target.value },
                  })
                }
                placeholder="e.g. Acme Design Studio"
                className="h-12 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1.5">This appears at the top of your cover page</p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Client Name</Label>
              <Input
                value={section.content.clientName || ""}
                onChange={(e) =>
                  onUpdate({
                    content: { ...section.content, clientName: e.target.value },
                  })
                }
                placeholder="e.g. TechCorp Inc."
                className="h-12 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1.5">Who is this proposal for?</p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Project Title</Label>
              <Input
                value={section.content.projectTitle || ""}
                onChange={(e) =>
                  onUpdate({
                    content: { ...section.content, projectTitle: e.target.value },
                  })
                }
                placeholder="e.g. Website Redesign Project"
                className="h-12 text-base font-medium"
              />
              <p className="text-xs text-muted-foreground mt-1.5">The main title of your proposal</p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Subtitle (Optional)</Label>
              <Input
                value={section.content.subtitle || ""}
                onChange={(e) =>
                  onUpdate({
                    content: { ...section.content, subtitle: e.target.value },
                  })
                }
                placeholder="e.g. A comprehensive solution for your digital needs"
                className="h-12 text-base"
              />
            </div>
          </div>
        )

      case "services":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Services You Offer</Label>
              <p className="text-xs text-muted-foreground mb-3">Add the services included in this proposal</p>
              <div className="space-y-2">
                {(section.content.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => {
                        const updated = [...(section.content.items || [])]
                        updated[idx] = e.target.value
                        onUpdate({
                          content: { ...section.content, items: updated },
                        })
                      }}
                      placeholder="e.g. UI/UX Design"
                      className="h-12 text-base"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = section.content.items.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, items: updated },
                        })
                      }}
                      className="h-12 w-12 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [...(section.content.items || []), "New Service"]
                  onUpdate({
                    content: { ...section.content, items: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </div>
        )

      case "pricing":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Pricing Packages</Label>
              <p className="text-xs text-muted-foreground mb-3">Add different pricing options for your client</p>
              <div className="space-y-4">
                {(section.content.packages || []).map((pkg: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <Input
                      value={pkg.name}
                      onChange={(e) => {
                        const updated = [...(section.content.packages || [])]
                        updated[idx].name = e.target.value
                        onUpdate({
                          content: { ...section.content, packages: updated },
                        })
                      }}
                      placeholder="Package name (e.g. Starter)"
                      className="h-12 text-base font-medium"
                    />
                    <Input
                      value={pkg.price}
                      onChange={(e) => {
                        const updated = [...(section.content.packages || [])]
                        updated[idx].price = e.target.value
                        onUpdate({
                          content: { ...section.content, packages: updated },
                        })
                      }}
                      placeholder="Price (e.g. $5,000)"
                      className="h-12 text-base"
                    />
                    <Textarea
                      value={pkg.description || ""}
                      onChange={(e) => {
                        const updated = [...(section.content.packages || [])]
                        updated[idx].description = e.target.value
                        onUpdate({
                          content: { ...section.content, packages: updated },
                        })
                      }}
                      placeholder="What's included in this package..."
                      rows={3}
                      className="text-base resize-none"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-11"
                      onClick={() => {
                        const updated = section.content.packages.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, packages: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Package
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [
                    ...(section.content.packages || []),
                    { name: "New Package", price: "$0", description: "" },
                  ]
                  onUpdate({
                    content: { ...section.content, packages: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </div>
          </div>
        )

      case "mindmap":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Central Topic</Label>
              <Input
                value={section.content.centralTopic || ""}
                onChange={(e) =>
                  onUpdate({
                    content: { ...section.content, centralTopic: e.target.value },
                  })
                }
                placeholder="e.g. Project Goals"
                className="h-12 text-base font-medium"
              />
              <p className="text-xs text-muted-foreground mt-1.5">The main idea at the center of your mind map</p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Branches</Label>
              <p className="text-xs text-muted-foreground mb-3">Add main branches that connect to your central topic</p>
              <div className="space-y-3">
                {(section.content.branches || []).map((branch: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <Input
                      value={branch.label}
                      onChange={(e) => {
                        const updated = [...(section.content.branches || [])]
                        updated[idx].label = e.target.value
                        onUpdate({
                          content: { ...section.content, branches: updated },
                        })
                      }}
                      placeholder="Branch label"
                      className="h-12 text-base font-medium"
                    />
                    <div className="space-y-2">
                      {(branch.items || []).map((item: string, itemIdx: number) => (
                        <div key={itemIdx} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => {
                              const updated = [...(section.content.branches || [])]
                              updated[idx].items[itemIdx] = e.target.value
                              onUpdate({
                                content: { ...section.content, branches: updated },
                              })
                            }}
                            placeholder="Sub-item"
                            className="h-10 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updated = [...(section.content.branches || [])]
                              updated[idx].items = branch.items.filter((_: any, i: number) => i !== itemIdx)
                              onUpdate({
                                content: { ...section.content, branches: updated },
                              })
                            }}
                            className="h-10 w-10 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-10"
                        onClick={() => {
                          const updated = [...(section.content.branches || [])]
                          updated[idx].items = [...(branch.items || []), ""]
                          onUpdate({
                            content: { ...section.content, branches: updated },
                          })
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sub-item
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
                      onClick={() => {
                        const updated = section.content.branches.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, branches: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Branch
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [...(section.content.branches || []), { label: "New Branch", items: ["Item 1"] }]
                  onUpdate({
                    content: { ...section.content, branches: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            </div>
          </div>
        )

      case "process":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Process Steps</Label>
              <p className="text-xs text-muted-foreground mb-3">Define the steps in your workflow or process</p>
              <div className="space-y-3">
                {(section.content.steps || []).map((step: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
                        {idx + 1}
                      </div>
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...(section.content.steps || [])]
                          updated[idx].title = e.target.value
                          onUpdate({
                            content: { ...section.content, steps: updated },
                          })
                        }}
                        placeholder="Step title"
                        className="h-12 text-base font-medium"
                      />
                    </div>
                    <Textarea
                      value={step.description || ""}
                      onChange={(e) => {
                        const updated = [...(section.content.steps || [])]
                        updated[idx].description = e.target.value
                        onUpdate({
                          content: { ...section.content, steps: updated },
                        })
                      }}
                      placeholder="Describe what happens in this step..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
                      onClick={() => {
                        const updated = section.content.steps.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, steps: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Step
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [...(section.content.steps || []), { title: "New Step", description: "" }]
                  onUpdate({
                    content: { ...section.content, steps: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </div>
        )

      case "comparison":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Comparison Items</Label>
              <p className="text-xs text-muted-foreground mb-3">Compare two options side by side</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["optionA", "optionB"].map((option, optionIdx) => (
                  <Card key={option} className="p-4 space-y-3 border-border">
                    <Input
                      value={section.content[option]?.name || ""}
                      onChange={(e) =>
                        onUpdate({
                          content: {
                            ...section.content,
                            [option]: { ...section.content[option], name: e.target.value },
                          },
                        })
                      }
                      placeholder={`Option ${optionIdx + 1} name`}
                      className="h-12 text-base font-medium"
                    />
                    <div className="space-y-2">
                      {(section.content[option]?.features || []).map((feature: string, idx: number) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const updated = [...(section.content[option]?.features || [])]
                              updated[idx] = e.target.value
                              onUpdate({
                                content: {
                                  ...section.content,
                                  [option]: { ...section.content[option], features: updated },
                                },
                              })
                            }}
                            placeholder="Feature"
                            className="h-10 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updated = section.content[option].features.filter((_: any, i: number) => i !== idx)
                              onUpdate({
                                content: {
                                  ...section.content,
                                  [option]: { ...section.content[option], features: updated },
                                },
                              })
                            }}
                            className="h-10 w-10 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-10"
                        onClick={() => {
                          const updated = [...(section.content[option]?.features || []), ""]
                          onUpdate({
                            content: {
                              ...section.content,
                              [option]: { ...section.content[option], features: updated },
                            },
                          })
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "features":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Key Features</Label>
              <p className="text-xs text-muted-foreground mb-3">Highlight the key features of your offering</p>
              <div className="space-y-3">
                {(section.content.features || []).map((feature: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const updated = [...(section.content.features || [])]
                        updated[idx].title = e.target.value
                        onUpdate({
                          content: { ...section.content, features: updated },
                        })
                      }}
                      placeholder="Feature title"
                      className="h-12 text-base font-medium"
                    />
                    <Textarea
                      value={feature.description || ""}
                      onChange={(e) => {
                        const updated = [...(section.content.features || [])]
                        updated[idx].description = e.target.value
                        onUpdate({
                          content: { ...section.content, features: updated },
                        })
                      }}
                      placeholder="Brief description..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
                      onClick={() => {
                        const updated = section.content.features.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, features: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Feature
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [...(section.content.features || []), { title: "New Feature", description: "" }]
                  onUpdate({
                    content: { ...section.content, features: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
        )

      case "timeline":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Timeline</Label>
              <p className="text-xs text-muted-foreground mb-3">Define project milestones and delivery dates</p>
              <div className="space-y-3">
                {(section.content.milestones || []).map((milestone: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <Input
                      value={milestone.title}
                      onChange={(e) => {
                        const updated = [...(section.content.milestones || [])]
                        updated[idx].title = e.target.value
                        onUpdate({
                          content: { ...section.content, milestones: updated },
                        })
                      }}
                      placeholder="Milestone title"
                      className="h-12 text-base font-medium"
                    />
                    <Input
                      value={milestone.date}
                      onChange={(e) => {
                        const updated = [...(section.content.milestones || [])]
                        updated[idx].date = e.target.value
                        onUpdate({
                          content: { ...section.content, milestones: updated },
                        })
                      }}
                      placeholder="Date (e.g., Q1 2025)"
                      className="h-10 text-sm"
                    />
                    <Textarea
                      value={milestone.description || ""}
                      onChange={(e) => {
                        const updated = [...(section.content.milestones || [])]
                        updated[idx].description = e.target.value
                        onUpdate({
                          content: { ...section.content, milestones: updated },
                        })
                      }}
                      placeholder="Milestone description..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
                      onClick={() => {
                        const updated = section.content.milestones.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, milestones: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Milestone
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [
                    ...(section.content.milestones || []),
                    { title: "New Milestone", date: "", description: "" },
                  ]
                  onUpdate({
                    content: { ...section.content, milestones: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>
          </div>
        )

      case "team":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Team Members</Label>
              <p className="text-xs text-muted-foreground mb-3">Introduce your team and their expertise</p>
              <div className="space-y-3">
                {(section.content.members || []).map((member: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <Input
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...(section.content.members || [])]
                        updated[idx].name = e.target.value
                        onUpdate({
                          content: { ...section.content, members: updated },
                        })
                      }}
                      placeholder="Team member name"
                      className="h-12 text-base font-medium"
                    />
                    <Input
                      value={member.role}
                      onChange={(e) => {
                        const updated = [...(section.content.members || [])]
                        updated[idx].role = e.target.value
                        onUpdate({
                          content: { ...section.content, members: updated },
                        })
                      }}
                      placeholder="Role/Title"
                      className="h-10 text-sm"
                    />
                    <Textarea
                      value={member.bio || ""}
                      onChange={(e) => {
                        const updated = [...(section.content.members || [])]
                        updated[idx].bio = e.target.value
                        onUpdate({
                          content: { ...section.content, members: updated },
                        })
                      }}
                      placeholder="Brief bio or expertise..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
                      onClick={() => {
                        const updated = section.content.members.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, members: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Member
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [...(section.content.members || []), { name: "New Member", role: "", bio: "" }]
                  onUpdate({
                    content: { ...section.content, members: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        )

      case "terms":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Terms & Conditions</Label>
              <p className="text-xs text-muted-foreground mb-3">Add contract terms, conditions, and agreements</p>
              <div className="space-y-3">
                {(section.content.terms || []).map((term: any, idx: number) => (
                  <Card key={idx} className="p-4 space-y-3 border-border">
                    <Input
                      value={term.title}
                      onChange={(e) => {
                        const updated = [...(section.content.terms || [])]
                        updated[idx].title = e.target.value
                        onUpdate({
                          content: { ...section.content, terms: updated },
                        })
                      }}
                      placeholder="Term title"
                      className="h-12 text-base font-medium"
                    />
                    <Textarea
                      value={term.description || ""}
                      onChange={(e) => {
                        const updated = [...(section.content.terms || [])]
                        updated[idx].description = e.target.value
                        onUpdate({
                          content: { ...section.content, terms: updated },
                        })
                      }}
                      placeholder="Term description..."
                      rows={3}
                      className="text-sm resize-none"
                    />
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-10"
                      onClick={() => {
                        const updated = section.content.terms.filter((_: any, i: number) => i !== idx)
                        onUpdate({
                          content: { ...section.content, terms: updated },
                        })
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Term
                    </Button>
                  </Card>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-3 w-full bg-transparent h-12"
                onClick={() => {
                  const updated = [...(section.content.terms || []), { title: "New Term", description: "" }]
                  onUpdate({
                    content: { ...section.content, terms: updated },
                  })
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Term
              </Button>
            </div>
          </div>
        )

      case "overview":
      case "custom":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {section.type === "overview" ? "Project Overview" : "Content"}
              </Label>
              <p className="text-xs text-muted-foreground mb-3">
                {section.type === "overview"
                  ? "Describe the project scope and objectives"
                  : "Add your custom content here"}
              </p>
              <Textarea
                value={section.content.text || ""}
                onChange={(e) =>
                  onUpdate({
                    content: { ...section.content, text: e.target.value },
                  })
                }
                placeholder="Start typing..."
                rows={10}
                className="text-base resize-none leading-relaxed"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-base">Editor for {section.type} coming soon</p>
            <p className="text-sm mt-2">This section type is not yet supported</p>
          </div>
        )
    }
  }

  return (
    <Card className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="space-y-5 max-w-2xl">
        {renderSectionTitle()}
        <div className="border-t border-border pt-5">{renderEditor()}</div>
      </div>
    </Card>
  )
}
