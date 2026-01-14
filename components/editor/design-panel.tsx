"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, Zap, Check } from "lucide-react"

interface DesignSettings {
  accentColor: string
  coverStyle: "gradient" | "solid" | "minimal"
  typography: "modern" | "classic" | "bold"
}

interface DesignPanelProps {
  settings: DesignSettings
  onUpdate: (settings: DesignSettings) => void
}

const ACCENT_COLORS = [
  { name: "Ocean Blue", value: "#1e40af" },
  { name: "Forest Green", value: "#15803d" },
  { name: "Berry Pink", value: "#be185d" },
  { name: "Warm Bronze", value: "#b45309" },
  { name: "Slate Gray", value: "#334155" },
  { name: "Amber Gold", value: "#d97706" },
]

export function DesignPanel({ settings, onUpdate }: DesignPanelProps) {
  return (
    <Card className="p-4 md:p-6 animate-fade-in">
      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="colors" className="gap-2 text-sm">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Colors</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2 text-sm">
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Fonts</span>
          </TabsTrigger>
          <TabsTrigger value="style" className="gap-2 text-sm">
            <Zap className="w-4 h-4" />
            <span className="hidden sm:inline">Style</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-5">
          <div>
            <Label className="text-sm font-semibold mb-1 block">Accent Color</Label>
            <p className="text-xs text-muted-foreground mb-3">Choose the main color for your proposal</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  className={`relative p-4 md:p-5 rounded-xl border-2 transition-smooth active:scale-95 ${
                    settings.accentColor === color.value
                      ? "border-foreground shadow-md ring-2 ring-foreground/20"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => onUpdate({ ...settings, accentColor: color.value })}
                >
                  {settings.accentColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {ACCENT_COLORS.map((color) => (
                <span key={color.value} className="text-xs text-muted-foreground">
                  {color.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold mb-1 block">Custom Color</Label>
            <p className="text-xs text-muted-foreground mb-2">Or pick your own brand color</p>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => onUpdate({ ...settings, accentColor: e.target.value })}
                  className="w-14 h-12 cursor-pointer p-1"
                />
              </div>
              <Input
                type="text"
                value={settings.accentColor}
                onChange={(e) => {
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    onUpdate({ ...settings, accentColor: e.target.value })
                  }
                }}
                placeholder="#1e40af"
                className="flex-1 font-mono text-sm h-12"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-3">
          <p className="text-xs text-muted-foreground mb-3">Select a typography style for your proposal</p>
          <div className="space-y-3">
            {(["modern", "classic", "bold"] as const).map((style) => (
              <button
                key={style}
                className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-smooth active:scale-[0.98] ${
                  settings.typography === style
                    ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => onUpdate({ ...settings, typography: style })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`${style === "bold" ? "font-bold" : style === "classic" ? "font-serif" : "font-sans"} text-base capitalize font-semibold`}
                    >
                      {style} Typography
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {style === "modern" && "Clean and contemporary"}
                      {style === "classic" && "Elegant and timeless"}
                      {style === "bold" && "Strong and impactful"}
                    </p>
                  </div>
                  {settings.typography === style && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-3">
          <p className="text-xs text-muted-foreground mb-3">Choose how your cover page looks</p>
          <div className="space-y-3">
            {(["gradient", "solid", "minimal"] as const).map((style) => (
              <button
                key={style}
                className={`w-full p-4 md:p-5 rounded-xl border-2 text-left transition-smooth active:scale-[0.98] ${
                  settings.coverStyle === style
                    ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                }`}
                onClick={() => onUpdate({ ...settings, coverStyle: style })}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold capitalize">{style} Cover</p>
                  {settings.coverStyle === style && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div
                  className="h-12 rounded-lg w-full"
                  style={{
                    background:
                      style === "gradient"
                        ? `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}99)`
                        : style === "solid"
                          ? settings.accentColor
                          : "#f0f0f0",
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {style === "gradient" && "Professional gradient background"}
                  {style === "solid" && "Clean solid color approach"}
                  {style === "minimal" && "Minimalist white space design"}
                </p>
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
