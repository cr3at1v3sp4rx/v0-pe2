"use client"

import { Button } from "@/components/ui/button"
import { FileText, Save, MoreHorizontal, ExternalLink, Copy, Check, Settings, ArrowLeft, Loader2 } from "lucide-react"
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
  currentTemplateName: string
  onShowTemplates: () => void
  onSaveTemplate: () => void
  onOpenClientView: () => void
  proposalId: string | null
  onSaveProposal: () => Promise<void>
  isSaving: boolean
}

export function EditorHeader({
  currentTemplateName,
  onShowTemplates,
  onSaveTemplate,
  onOpenClientView,
  proposalId,
  onSaveProposal,
  isSaving,
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
    <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 gap-4">
        {/* Left: Home button and title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-sm font-semibold truncate">{currentTemplateName}</h1>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {/* Save button */}
          <Button onClick={onSaveProposal} disabled={isSaving} className="gap-2" size="sm">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </Button>

          {/* Settings button */}
          <Link href="/settings">
            <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>

          {/* More options menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onShowTemplates}>
                <FileText className="h-4 w-4 mr-2" />
                Templates
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSaveTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Save as Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenClientView}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Client View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (proposalId) {
                    navigator.clipboard.writeText(`${window.location.origin}/view/${proposalId}`)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
