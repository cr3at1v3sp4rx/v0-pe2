"use client"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TemplateGallery } from "@/components/templates/template-gallery"

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Editor
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Templates & Gallery</h1>
          <p className="text-muted-foreground">Browse and select from professional proposal templates</p>
        </div>

        <TemplateGallery onSelectTemplate={(id) => {}} />
      </div>
    </div>
  )
}
