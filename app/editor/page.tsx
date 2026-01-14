"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { EditorHeader } from "@/components/editor/editor-header"
import { EditorSidebar } from "@/components/editor/editor-sidebar"
import { ProposalEditor } from "@/components/editor/proposal-editor"
import { DesignPanel } from "@/components/editor/design-panel"
import { PreviewPanel } from "@/components/editor/preview-panel"
import { MobileNav } from "@/components/editor/mobile-nav"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PanelLeft, PanelLeftClose, Undo2, Redo2, Loader2 } from "lucide-react"
import { createProposal, updateProposal, createSection } from "@/lib/supabase/queries"

export default function EditorPage() {
  const searchParams = useSearchParams()
  const importId = searchParams.get("import")

  const [mobileView, setMobileView] = useState("edit")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [historyIndex, setHistoryIndex] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [designSettings, setDesignSettings] = useState({
    accentColor: "#1e40af",
    coverStyle: "gradient",
    typography: "modern",
  })
  const [sections, setSections] = useState<any[]>([])
  const [templateName, setTemplateName] = useState("Untitled Proposal")
  const [showTemplates, setShowTemplates] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [proposalId, setProposalId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadProposal = async () => {
      // Check if this is a new proposal or loading existing one
      if (importId) {
        // Load from sessionStorage (PDF import)
        const storedData = sessionStorage.getItem(`proposal-import-${importId}`)
        if (storedData) {
          try {
            const {
              sections: importedSections,
              designSettings: importedSettings,
              templateName: importedName,
            } = JSON.parse(storedData)
            setSections(importedSections)
            setDesignSettings(
              importedSettings || {
                accentColor: "#1e40af",
                coverStyle: "gradient",
                typography: "modern",
              },
            )
            setTemplateName(importedName)
            setSelectedSection(importedSections[0] || null)
            setHistory([importedSections])
            setHistoryIndex(0)
            sessionStorage.removeItem(`proposal-import-${importId}`)
          } catch (err) {
            console.error("[v0] Error loading imported proposal:", err)
          }
        }
      } else {
        // Start with default blank proposal
        const defaultSections = [
          {
            id: "1",
            type: "cover",
            title: "Cover Page",
            content: {
              companyName: "Your Company",
              clientName: "Client Name",
              projectTitle: "Project Title",
              subtitle: "Proposal Overview",
            },
          },
        ]
        setSections(defaultSections)
        setSelectedSection(defaultSections[0])
        setHistory([defaultSections])
        setHistoryIndex(0)
      }
    }

    loadProposal()
  }, [importId])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSections(history[historyIndex - 1])
      setSelectedSection(history[historyIndex - 1][0] || null)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSections(history[historyIndex + 1])
      setSelectedSection(history[historyIndex + 1][0] || null)
    }
  }

  const handleDesignUpdate = (updates: any) => {
    setDesignSettings({ ...designSettings, ...updates })
  }

  const handleAddSection = (type: string) => {
    const sectionTypes: { [key: string]: any } = {
      cover: {
        type: "cover",
        content: {
          companyName: "Your Company",
          clientName: "Client Name",
          projectTitle: "Project Title",
          subtitle: "Proposal Overview",
        },
      },
      overview: { type: "overview", content: { text: "Add your overview text here..." } },
      services: { type: "services", content: { items: ["Service 1", "Service 2"] } },
      pricing: { type: "pricing", content: { packages: [{ name: "Package", price: "$0", description: "" }] } },
      mindmap: { type: "mindmap", content: { centralTopic: "Topic", branches: [] } },
      process: { type: "process", content: { steps: [] } },
      comparison: {
        type: "comparison",
        content: { optionA: { name: "Option A", features: [] }, optionB: { name: "Option B", features: [] } },
      },
      features: { type: "features", content: { features: [] } },
      custom: { type: "custom", content: { text: "Custom content" } },
    }

    const newSection = {
      id: String(sections.length + 1),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      ...sectionTypes[type],
    }

    const newSections = [...sections, newSection]
    setSections(newSections)
    setSelectedSection(newSection)
    setHistory([...history.slice(0, historyIndex + 1), newSections])
    setHistoryIndex(history.length)
  }

  const handleDeleteSection = (sectionId: string) => {
    const newSections = sections.filter((s) => s.id !== sectionId)
    setSections(newSections)
    setSelectedSection(newSections[0] || null)
    setHistory([...history.slice(0, historyIndex + 1), newSections])
    setHistoryIndex(history.length)
  }

  const handleReorderSections = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections]
    const [removed] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, removed)
    setSections(newSections)
    setHistory([...history.slice(0, historyIndex + 1), newSections])
    setHistoryIndex(history.length)
  }

  const updateSection = (sectionId: string, updates: any) => {
    setIsTransitioning(true)
    const newSections = sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s))
    setSections(newSections)
    setSelectedSection({ ...selectedSection, ...updates })
    setHistory([...history.slice(0, historyIndex + 1), newSections])
    setHistoryIndex(history.length)
    // Clear transition state after update
    setTimeout(() => setIsTransitioning(false), 50)
  }

  const handleSelectSection = (section: any) => {
    setIsTransitioning(true)
    setSelectedSection(section)
    setTimeout(() => setIsTransitioning(false), 50)
  }

  const handleSaveTemplate = () => {
    const template = {
      name: templateName,
      sections,
      designSettings,
      createdAt: new Date().toISOString(),
    }
    const savedTemplates = JSON.parse(localStorage.getItem("proposal-templates") || "[]")
    savedTemplates.push(template)
    localStorage.setItem("proposal-templates", JSON.stringify(savedTemplates))
    alert(`Template "${templateName}" saved successfully!`)
  }

  const handleOpenClientView = () => {
    const proposalId = "proposal-" + Math.random().toString(36).substr(2, 9)
    const viewUrl = `/view/${proposalId}`
    window.open(viewUrl, "_blank")
  }

  const handleSaveProposal = async () => {
    if (!templateName.trim()) {
      alert("Please enter a proposal name")
      return
    }

    setIsSaving(true)
    try {
      if (!proposalId) {
        // Create new proposal
        const newProposal = await createProposal(templateName, "", "")
        setProposalId(newProposal.id)

        // Save sections
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i]
          await createSection(newProposal.id, section.type, section.title, section.content, i)
        }
      } else {
        // Update existing proposal
        await updateProposal(proposalId, { title: templateName })
        // TODO: Update sections
      }
      alert("Proposal saved successfully!")
    } catch (error) {
      console.error("[v0] Error saving proposal:", error)
      alert("Error saving proposal")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <EditorHeader
        previewMode={previewMode}
        onPreviewToggle={setPreviewMode}
        currentTemplateName={templateName}
        onShowTemplates={() => setShowTemplates(true)}
        onSaveTemplate={handleSaveTemplate}
        onOpenClientView={handleOpenClientView}
        proposalId={proposalId}
        onSaveProposal={handleSaveProposal}
        isSaving={isSaving}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div
          className={`${sidebarCollapsed ? "w-0" : "w-80"} hidden md:flex flex-col transition-all duration-200 overflow-hidden border-r border-border/50`}
        >
          <EditorSidebar
            sections={sections}
            selectedSection={selectedSection}
            onSelectSection={handleSelectSection}
            onAddSection={handleAddSection}
            onDeleteSection={handleDeleteSection}
            onReorderSections={handleReorderSections}
            collapsed={sidebarCollapsed}
          />
        </div>

        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden md:flex h-10 w-10 shrink-0 rounded-none border-r"
          title={sidebarCollapsed ? "Show sections" : "Hide sections"}
        >
          {sidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </Button>

        {/* Main Content - Shows preview or editor based on previewMode */}
        {!previewMode ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Edit and Design on Mobile */}
            {mobileView === "edit" && (
              <div className="flex-1 flex flex-col gap-2 p-2 overflow-hidden">
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex === 0}
                    className="gap-2 bg-transparent h-11 min-w-[44px] hover:bg-secondary transition-colors duration-150"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Undo</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex === history.length - 1}
                    className="gap-2 bg-transparent h-11 min-w-[44px] hover:bg-secondary transition-colors duration-150"
                    title="Redo (Ctrl+Shift+Z)"
                  >
                    <Redo2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs">Redo</span>
                  </Button>
                </div>

                <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
                  <TabsList className="w-full justify-start border-b shrink-0 h-10 md:h-12 bg-transparent">
                    <TabsTrigger
                      value="content"
                      className="text-xs md:text-sm data-[state=active]:bg-secondary transition-colors duration-150"
                    >
                      <span className="hidden sm:inline">Content</span>
                      <span className="sm:hidden">Edit</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="design"
                      className="text-xs md:text-sm data-[state=active]:bg-secondary transition-colors duration-150"
                    >
                      <span className="hidden sm:inline">Design</span>
                      <span className="sm:hidden">Style</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="flex-1 overflow-hidden mt-2">
                    <div className="overflow-y-auto h-full pr-2 md:pr-4 relative">
                      {isTransitioning && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg backdrop-blur-sm">
                          <Loader2 className="w-5 h-5 animate-spin text-accent" />
                        </div>
                      )}
                      {selectedSection ? (
                        <div className="animate-fade-in">
                          <ProposalEditor
                            section={selectedSection}
                            onUpdate={(updates) => updateSection(selectedSection.id, updates)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Select or add a section to begin editing</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="design" className="flex-1 overflow-hidden mt-2">
                    <div className="overflow-y-auto h-full pr-2 md:pr-4">
                      <DesignPanel settings={designSettings} onUpdate={handleDesignUpdate} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Sections View on Mobile */}
            {mobileView === "sections" && (
              <div className="flex-1 overflow-hidden">
                <EditorSidebar
                  sections={sections}
                  selectedSection={selectedSection}
                  onSelectSection={handleSelectSection}
                  onAddSection={handleAddSection}
                  onDeleteSection={handleDeleteSection}
                  onReorderSections={handleReorderSections}
                />
              </div>
            )}

            {/* Preview on Mobile */}
            {mobileView === "preview" && (
              <div className="flex-1 overflow-hidden">
                <PreviewPanel sections={sections} designSettings={designSettings} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <PreviewPanel sections={sections} designSettings={designSettings} />
          </div>
        )}

        {/* Preview Panel - Desktop Only */}
        <div className="hidden lg:flex flex-1 overflow-hidden border-l border-border/50">
          <PreviewPanel sections={sections} designSettings={designSettings} />
        </div>
      </div>

      {/* Mobile Navigation - Bottom Tabs */}
      <MobileNav activeView={mobileView} onViewChange={setMobileView} sectionCount={sections.length} />

      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
            <h2 className="text-xl font-bold mb-4">Saved Templates</h2>
            {JSON.parse(localStorage.getItem("proposal-templates") || "[]").length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No templates saved yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {JSON.parse(localStorage.getItem("proposal-templates") || "[]").map((template: any, idx: number) => (
                  <div
                    key={idx}
                    className="border border-border rounded-lg p-4 hover:bg-secondary hover:border-accent transition-all duration-150 cursor-pointer group"
                  >
                    <h3 className="font-semibold mb-2 group-hover:text-accent transition-colors">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSections(template.sections)
                        setDesignSettings(template.designSettings)
                        setTemplateName(template.name)
                        setSelectedSection(template.sections[0] || null)
                        setShowTemplates(false)
                      }}
                      className="w-full bg-transparent hover:bg-accent/10 h-9 transition-colors duration-150"
                    >
                      Load
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full bg-transparent transition-colors duration-150"
              onClick={() => setShowTemplates(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
