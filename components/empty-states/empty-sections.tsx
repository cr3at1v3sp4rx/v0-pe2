"use client"

import { FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptySections({ onAddSection }: { onAddSection?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-3 bg-accent/10 rounded-lg">
        <FileText className="w-8 h-8 text-accent/50" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Sections Yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Start building your proposal by adding your first section. Choose from templates or create a custom one.
      </p>
      {onAddSection && (
        <Button onClick={onAddSection} className="gap-2 bg-accent hover:bg-accent/90">
          <Plus className="w-4 h-4" />
          Add First Section
        </Button>
      )}
    </div>
  )
}
