"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileUp, AlertCircle } from "lucide-react"
import * as pdfjs from "pdfjs-dist"

interface PDFUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (sections: any[], templateName: string) => void
}

export function PDFUploadDialog({ isOpen, onClose, onUploadComplete }: PDFUploadDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    }
  }, [])

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
      let fullText = ""

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setUploadProgress(Math.round((pageNum / pdf.numPages) * 100))
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(" ")
        fullText += pageText + "\n\n"
      }

      return fullText
    } catch (err) {
      console.error("[v0] PDF extraction error:", err)
      throw new Error("Failed to extract text from PDF")
    }
  }

  const parseTextToSections = (text: string, fileName: string) => {
    // Smart parsing to detect sections from PDF text
    const sections: any[] = []
    const lines = text.split("\n").filter((line) => line.trim())

    // Create cover page from filename
    sections.push({
      id: "1",
      type: "cover",
      title: "Cover Page",
      content: {
        companyName: "Your Company",
        clientName: "Client Name",
        projectTitle: fileName.replace(".pdf", ""),
        subtitle: "Proposal Overview",
      },
    })

    // Detect overview section - first substantial paragraph
    const firstParagraph = lines
      .filter((line) => line.trim().length > 50)
      .slice(0, 1)
      .join(" ")

    if (firstParagraph) {
      sections.push({
        id: "2",
        type: "overview",
        title: "Overview",
        content: {
          text: firstParagraph,
        },
      })
    }

    // Detect services section - look for common keywords
    const serviceKeywords = ["services", "offerings", "deliverables", "what we offer", "our expertise", "capabilities"]
    const serviceStart = lines.findIndex((line) =>
      serviceKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    )

    if (serviceStart !== -1) {
      const serviceLines = lines
        .slice(serviceStart + 1, serviceStart + 6)
        .filter((line) => line.trim().length > 5)
        .map((line) => line.trim().substring(0, 100))

      if (serviceLines.length > 0) {
        sections.push({
          id: "3",
          type: "services",
          title: "Our Services",
          content: {
            items: serviceLines,
          },
        })
      }
    }

    // Detect pricing section - look for price patterns
    const pricingKeywords = ["price", "cost", "investment", "fee", "rate", "package"]
    const pricingStart = lines.findIndex((line) =>
      pricingKeywords.some((keyword) => line.toLowerCase().includes(keyword)),
    )

    if (pricingStart !== -1) {
      // Look for dollar amounts in the next lines
      const priceLines = lines.slice(pricingStart, Math.min(pricingStart + 10, lines.length))

      const prices = priceLines.filter((line) => line.includes("$") || /\d{4,}/.test(line))

      if (prices.length > 0) {
        sections.push({
          id: "4",
          type: "pricing",
          title: "Pricing",
          content: {
            packages: [{ name: "Standard Package", price: "$0", description: "Price extracted from PDF" }],
          },
        })
      }
    }

    // Add a custom section with key text content
    const significantContent = lines
      .filter((line) => line.trim().length > 20)
      .slice(0, 3)
      .join("\n\n")

    if (significantContent) {
      sections.push({
        id: String(sections.length + 1),
        type: "custom",
        title: "Additional Information",
        content: {
          text: significantContent,
        },
      })
    }

    return sections
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes("pdf")) {
      setError("Please upload a PDF file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setError(null)
    setIsLoading(true)
    setUploadProgress(0)

    try {
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file)

      // Parse text into sections
      const sections = parseTextToSections(extractedText, file.name)

      // Generate template name from filename
      const templateName = file.name.replace(".pdf", "")

      // Complete
      setUploadProgress(100)
      setTimeout(() => {
        onUploadComplete(sections, templateName)
        setIsLoading(false)
        onClose()
      }, 500)
    } catch (err) {
      console.error("[v0] Error processing PDF:", err)
      setError("Failed to process PDF. Please try another file.")
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload PDF Proposal</CardTitle>
          <CardDescription>Transform your PDF into an editable proposal template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Processing PDF...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {!isLoading && (
            <>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Choose PDF file</p>
                <p className="text-xs text-muted-foreground">or drag and drop</p>
              </div>

              <Input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />

              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Extracts text content and structure</p>
                <p>• Automatically creates sections</p>
                <p>• Maximum file size: 10MB</p>
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={() => onClose()}>
                Cancel
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
