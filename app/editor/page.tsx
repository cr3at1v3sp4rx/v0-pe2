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
import {
  createProposal,
  updateProposal,
  createSection,
  createTemplate,
  getTemplates,
  deleteTemplate,
} from "@/lib/supabase/queries"

export default function EditorPage() {
  const searchParams = useSearchParams()
  const importId = searchParams.get("import")

  const [mobileView, setMobileView] = useState("edit")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
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
  const [templates, setTemplates] = useState<any[]>([])

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
            setSelectedSectionId(importedSections[0]?.id || null)
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
        setSelectedSectionId(defaultSections[0].id)
        setHistory([defaultSections])
        setHistoryIndex(0)
      }
    }

    loadProposal()
  }, [importId])

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const loadedTemplates = await getTemplates()
        setTemplates(loadedTemplates)
      } catch (err) {
        console.error("[v0] Error loading templates:", err)
      }
    }
    loadTemplates()
  }, [])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSections(history[historyIndex - 1])
      setSelectedSection(history[historyIndex - 1][0] || null)
      setSelectedSectionId(history[historyIndex - 1][0]?.id || null)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSections(history[historyIndex + 1])
      setSelectedSection(history[historyIndex + 1][0] || null)
      setSelectedSectionId(history[historyIndex + 1][0]?.id || null)
    }
  }

  const handleDesignUpdate = (updates: any) => {
    setDesignSettings({ ...designSettings, ...updates })
  }

  const handleAddSection = (type: string) => {
    const sectionTypes: any = {
      cover: { type: "cover", content: { companyName: "", clientName: "", projectTitle: "", subtitle: "" } },
      overview: { type: "overview", content: { text: "Project overview content..." } },
      services: { type: "services", content: { items: ["Service 1", "Service 2"] } },
      pricing: { type: "pricing", content: { packages: [{ name: "Package", price: "$0", description: "" }] } },
      mindmap: { type: "mindmap", content: { centralTopic: "Topic", branches: [] } },
      process: { type: "process", content: { steps: [] } },
      comparison: {
        type: "comparison",
        content: { optionA: { name: "Option A", features: [] }, optionB: { name: "Option B", features: [] } },
      },
      features: { type: "features", content: { features: [] } },
      timeline: { type: "timeline", content: { milestones: [] } },
      team: { type: "team", content: { members: [] } },
      terms: { type: "terms", content: { terms: [] } },
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
    setSelectedSectionId(newSection.id)
    setHistory([...history.slice(0, historyIndex + 1), newSections])
    setHistoryIndex(history.length)
  }

  const handleDeleteSection = (sectionId: string) => {
    const newSections = sections.filter((s) => s.id !== sectionId)
    setSections(newSections)
    if (selectedSectionId === sectionId) {
      setSelectedSection(newSections[0] || null)
      setSelectedSectionId(newSections[0]?.id || null)
    }
    setHistory([...history.slice(0, historyIndex + 1), newSections])
    setHistoryIndex(history.length)
  }

  const handleReorderSections = (reorderedSections: any[]) => {
    setSections(reorderedSections)
    setHistory([...history.slice(0, historyIndex + 1), reorderedSections])
    setHistoryIndex(history.length)
  }

  const handleDuplicateSection = (sectionId: string) => {
    const sectionToDuplicate = sections.find((s) => s.id === sectionId)
    if (sectionToDuplicate) {
      const duplicated = {
        ...sectionToDuplicate,
        id: String(Date.now()),
        title: `${sectionToDuplicate.title} (Copy)`,
      }
      const newSections = [...sections, duplicated]
      setSections(newSections)
      setSelectedSection(duplicated)
      setSelectedSectionId(duplicated.id)
      setHistory([...history.slice(0, historyIndex + 1), newSections])
      setHistoryIndex(history.length)
    }
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
    setSelectedSectionId(section.id)
    setTimeout(() => setIsTransitioning(false), 50)
  }

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please enter a template name")
      return
    }

    setIsSaving(true)
    try {
      const newTemplate = await createTemplate(templateName, "", sections, designSettings)
      setTemplates([...templates, newTemplate])
      alert(`Template "${templateName}" saved successfully!`)
    } catch (err) {
      console.error("[v0] Error saving template:", err)
      alert("Failed to save template. Please try again.")
    } finally {
      setIsSaving(false)
    }
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

  const handleLoadTemplate = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setSections(template.sections)
      setDesignSettings(template.design_settings)
      setTemplateName(template.name)
      setSelectedSection(template.sections[0] || null)
      setSelectedSectionId(template.sections[0]?.id || null)
      setHistory([template.sections])
      setHistoryIndex(0)
      setShowTemplates(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId)
      setTemplates(templates.filter((t) => t.id !== templateId))
      alert("Template deleted successfully")
    } catch (err) {
      console.error("[v0] Error deleting template:", err)
      alert("Failed to delete template")
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
        {/* Sidebar - 25% width on desktop */}
        <div
          className={`${sidebarCollapsed ? "w-0" : "w-1/4"} hidden md:flex flex-col transition-all duration-200 overflow-hidden border-r border-border/50`}
        >
          <EditorSidebar
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSelectSection}
            onAddSection={handleAddSection}
            onRemoveSection={handleDeleteSection}
            onReorderSections={handleReorderSections}
            onDuplicateSection={handleDuplicateSection}
            isMobile={false}
          />
          <div
            className={`${sidebarCollapsed ? "flex" : "hidden"} md:flex items-center shrink-0 w-auto px-2 border-r border-border/50 hover:bg-secondary transition-colors duration-200`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-10 w-10 rounded-lg"
              title={sidebarCollapsed ? "Show sections" : "Hide sections"}
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content - 50% width on desktop */}
        <div className="hidden md:flex md:w-1/2 flex-col overflow-hidden border-r border-border/50">
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
        </div>

        {/* Preview Panel - 25% width on desktop, toggle with preview button */}
        <div className={`${previewMode ? "hidden md:flex" : "hidden"} md:w-1/4 flex-col overflow-hidden`}>
          <PreviewPanel sections={sections} designSettings={designSettings} />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex-1 flex flex-col overflow-hidden">
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

          {mobileView === "sections" && (
            <div className="flex-1 overflow-hidden">
              <EditorSidebar
                sections={sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={handleSelectSection}
                onAddSection={handleAddSection}
                onRemoveSection={handleDeleteSection}
                onReorderSections={handleReorderSections}
                onDuplicateSection={handleDuplicateSection}
                isMobile={true}
              />
            </div>
          )}

          {mobileView === "preview" && (
            <div className="flex-1 overflow-hidden">
              <PreviewPanel sections={sections} designSettings={designSettings} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeView={mobileView} onViewChange={setMobileView} />

      {/* Template Manager Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Templates</h2>
              <button onClick={() => setShowTemplates(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {templates.length === 0 ? (
                <p className="text-muted-foreground text-center">No templates saved yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-border rounded-lg p-4 hover:bg-secondary transition-colors"
                    >
                      <h3 className="font-semibold mb-2">{template.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleLoadTemplate(template.id)}
                          className="flex-1"
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
