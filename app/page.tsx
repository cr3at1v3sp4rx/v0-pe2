"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("onboarding-complete")
    if (hasSeenOnboarding) {
      router.replace("/dashboard")
    } else {
      router.replace("/onboarding")
    }
  }, [router])

  const [mobileView, setMobileView] = useState<"sections" | "edit" | "preview">("edit")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const [proposalId] = useState(() => Math.random().toString(36).substring(2, 10))

  const [templates, setTemplates] = useState<any[]>([
    {
      id: "default",
      name: "Professional Proposal",
      description: "Clean and modern business proposal",
      sections: [
        {
          id: "1",
          type: "cover",
          title: "Cover Page",
          content: {
            companyName: "Your Company",
            clientName: "Acme Corporation",
            projectTitle: "Web Design & Development Project",
            subtitle: "A comprehensive solution for your digital needs",
          },
        },
        {
          id: "2",
          type: "overview",
          title: "Project Overview",
          content: {
            text: "This proposal outlines a comprehensive digital transformation initiative designed to elevate your brand presence and drive business growth through modern web solutions.",
          },
        },
        {
          id: "3",
          type: "services",
          title: "Our Services",
          content: {
            items: ["UI/UX Design", "Frontend Development", "Backend Development", "Quality Assurance"],
          },
        },
        {
          id: "4",
          type: "pricing",
          title: "Investment",
          content: {
            packages: [
              { name: "Starter", price: "$5,000", description: "Perfect for small projects with focused scope" },
              {
                name: "Professional",
                price: "$15,000",
                description: "Our most popular package for growing businesses",
              },
              { name: "Enterprise", price: "Custom", description: "Tailored solutions for large-scale initiatives" },
            ],
          },
        },
      ],
      designSettings: {
        accentColor: "#1e40af",
        coverStyle: "gradient",
        typography: "modern",
      },
      createdAt: new Date().toISOString(),
    },
  ])

  const [currentTemplate, setCurrentTemplate] = useState("default")
  const [sections, setSections] = useState(templates[0].sections)
  const [selectedSectionId, setSelectedSectionId] = useState("1")
  const [previewMode, setPreviewMode] = useState(false)
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [designSettings, setDesignSettings] = useState(
    templates[0].designSettings || {
      accentColor: "#1e40af",
      coverStyle: "gradient",
      typography: "modern",
    },
  )

  const [history, setHistory] = useState<any[]>([sections])
  const [historyIndex, setHistoryIndex] = useState(0)

  const selectedSection = sections.find((s) => s.id === selectedSectionId)

  const addToHistory = useCallback(
    (newSections: any[]) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newSections)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      setSections(newSections)
    },
    [history, historyIndex],
  )

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setSections(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setSections(history[newIndex])
    }
  }

  const addSection = (type: string) => {
    const templateContent: { [key: string]: any } = {
      services: { items: ["Service 1", "Service 2", "Service 3"] },
      pricing: {
        packages: [
          { name: "Starter", price: "$0", description: "Description" },
          { name: "Professional", price: "$0", description: "Description" },
        ],
      },
      overview: { text: "Project overview content goes here..." },
      custom: { text: "" },
      cover: { companyName: "", clientName: "", projectTitle: "", subtitle: "" },
      timeline: { phases: [] },
      team: { members: [] },
      terms: { text: "" },
      mindmap: {
        centralTopic: "Main Idea",
        branches: [
          { label: "Branch 1", items: ["Sub-item A", "Sub-item B"] },
          { label: "Branch 2", items: ["Sub-item C", "Sub-item D"] },
        ],
      },
      process: {
        steps: [
          { title: "Discovery", description: "Understand requirements and goals" },
          { title: "Design", description: "Create wireframes and mockups" },
          { title: "Development", description: "Build the solution" },
          { title: "Launch", description: "Deploy and celebrate" },
        ],
      },
      comparison: {
        optionA: { name: "Option A", features: ["Feature 1", "Feature 2", "Feature 3"] },
        optionB: { name: "Option B", features: ["Feature 1", "Feature 2", "Feature 3"] },
      },
      features: {
        features: [
          { title: "Fast Performance", description: "Lightning quick load times" },
          { title: "Secure", description: "Enterprise-grade security" },
          { title: "Scalable", description: "Grows with your business" },
          { title: "24/7 Support", description: "Always here to help" },
        ],
      },
    }

    const newSection = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: templateContent[type] || {},
    }
    const updated = [...sections, newSection]
    addToHistory(updated)
    setSelectedSectionId(newSection.id)
    updateCurrentTemplate(updated)
    setMobileView("edit")
  }

  const duplicateSection = (id: string) => {
    const sectionToDuplicate = sections.find((s) => s.id === id)
    if (sectionToDuplicate) {
      const newSection = {
        ...sectionToDuplicate,
        id: Date.now().toString(),
        title: `${sectionToDuplicate.title} (Copy)`,
        content: JSON.parse(JSON.stringify(sectionToDuplicate.content)),
      }
      const updated = [...sections, newSection]
      addToHistory(updated)
      setSelectedSectionId(newSection.id)
      updateCurrentTemplate(updated)
    }
  }

  const reorderSections = (reorderedSections: any[]) => {
    addToHistory(reorderedSections)
    updateCurrentTemplate(reorderedSections)
  }

  const removeSection = (id: string) => {
    const updated = sections.filter((s) => s.id !== id)
    addToHistory(updated)
    if (selectedSectionId === id) {
      setSelectedSectionId(updated[0]?.id || "")
    }
    updateCurrentTemplate(updated)
  }

  const updateSection = (id: string, updates: any) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, ...updates } : s))
    setSections(updated)
    updateCurrentTemplate(updated)
  }

  const updateCurrentTemplate = (updatedSections: any[]) => {
    setTemplates(
      templates.map((t) => (t.id === currentTemplate ? { ...t, sections: updatedSections, designSettings } : t)),
    )
  }

  const handleDesignUpdate = (newSettings: any) => {
    setDesignSettings(newSettings)
    setTemplates(templates.map((t) => (t.id === currentTemplate ? { ...t, designSettings: newSettings } : t)))
  }

  const saveAsNewTemplate = (name: string, description: string) => {
    const newTemplate = {
      id: Date.now().toString(),
      name,
      description,
      sections: sections,
      designSettings,
      createdAt: new Date().toISOString(),
    }
    setTemplates([...templates, newTemplate])
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setCurrentTemplate(templateId)
      setSections(template.sections)
      setHistory([template.sections])
      setHistoryIndex(0)
      setDesignSettings(template.designSettings || designSettings)
      setSelectedSectionId(template.sections[0]?.id || "")
    }
  }

  const deleteTemplate = (templateId: string) => {
    if (templates.length === 1) {
      alert("Cannot delete the last template")
      return
    }
    const filtered = templates.filter((t) => t.id !== templateId)
    setTemplates(filtered)
    if (currentTemplate === templateId) {
      loadTemplate(filtered[0].id)
    }
  }

  const handleSelectSection = (id: string) => {
    setSelectedSectionId(id)
    setMobileView("edit")
  }

  const handleOpenClientView = () => {
    // Store current proposal data in sessionStorage for the client view
    const proposalData = {
      sections,
      designSettings,
      templateName: templates.find((t) => t.id === currentTemplate)?.name || "Proposal",
    }
    sessionStorage.setItem(`proposal-${proposalId}`, JSON.stringify(proposalData))
    window.open(`/view/${proposalId}`, "_blank")
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
