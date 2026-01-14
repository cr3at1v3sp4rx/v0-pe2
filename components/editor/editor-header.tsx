"use client"

import { Button } from "@/components/ui/button"
import {
  Eye,
  EyeOff,
  Download,
  FileText,
  Save,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Check,
  Settings,
  ArrowLeft,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useState } from "react"

interface EditorHeaderProps {
  onPreviewToggle: (mode: boolean) => void
  previewMode: boolean
  currentTemplateName: string
  onShowTemplates: () => void
  onSaveTemplate: () => void
  onOpenClientView: () => void
  proposalId: string
}

export function EditorHeader({
  onPreviewToggle,
  previewMode,
  currentTemplateName,
  onShowTemplates,
  onSaveTemplate,
  onOpenClientView,
  proposalId,
}: EditorHeaderProps) {
  const [copied, setCopied] = useState(false)

  const clientViewUrl =
    typeof window !== "undefined" ? `${window.location.origin}/view/${proposalId}` : `/view/${proposalId}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientViewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="border-b border-border bg-card px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1 flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 md:gap-3 mb-0.5">
            <FileText className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Proposal Builder</h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground truncate">
            {currentTemplateName || "Untitled Template"}
          </p>
        </div>
      </div>

      {/* Desktop buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="outline" onClick={onShowTemplates} className="gap-2 bg-transparent h-11">
          <FileText className="w-4 h-4" />
          Templates
        </Button>
        <Button variant="outline" onClick={onSaveTemplate} className="gap-2 bg-transparent h-11">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button variant="outline" onClick={() => onPreviewToggle(!previewMode)} className="gap-2 h-11">
          {previewMode ? (
            <>
              <EyeOff className="w-4 h-4" />
              Edit
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Preview
            </>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11">
              <ExternalLink className="w-4 h-4" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem onClick={onOpenClientView} className="gap-2 py-3 cursor-pointer">
              <Eye className="w-4 h-4" />
              Open Client View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="gap-2 py-3 cursor-pointer">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 py-3 cursor-pointer">
              <Download className="w-4 h-4" />
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/settings">
          <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Mobile dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden h-11 w-11 bg-transparent">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onShowTemplates} className="gap-2 py-3">
            <FileText className="w-4 h-4" />
            Templates
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSaveTemplate} className="gap-2 py-3">
            <Save className="w-4 h-4" />
            Save as Template
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenClientView} className="gap-2 py-3">
            <Eye className="w-4 h-4" />
            Client View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink} className="gap-2 py-3">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 py-3">
            <Download className="w-4 h-4" />
            Export PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
