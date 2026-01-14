"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, Bell, Lock, Palette, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    companyName: "Your Company",
    email: "user@example.com",
    defaultCoverStyle: "gradient",
    defaultAccentColor: "#1e40af",
    emailNotifications: true,
    twoFactorEnabled: false,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl p-4 md:p-6">
        {/* Profile Section */}
        <Card className="p-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Your company name"
              />
              <p className="text-xs text-muted-foreground mt-1">Used in proposal headers and branding</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
              <p className="text-xs text-muted-foreground mt-1">Primary email for notifications and account recovery</p>
            </div>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Palette className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Default Cover Style</label>
              <select
                value={settings.defaultCoverStyle}
                onChange={(e) => setSettings({ ...settings, defaultCoverStyle: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="gradient">Gradient</option>
                <option value="solid">Solid</option>
                <option value="minimal">Minimal</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">Used for new proposal cover pages</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Default Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.defaultAccentColor}
                  onChange={(e) => setSettings({ ...settings, defaultAccentColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.defaultAccentColor}
                  onChange={(e) => setSettings({ ...settings, defaultAccentColor: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Primary brand color for proposals</p>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Get updates on proposal status changes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Security Section */}
        <Card className="p-6 mb-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
            </div>

            <Button variant="outline" className="w-full gap-2 h-11 bg-transparent">
              <Lock className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 md:justify-end">
          <Link href="/dashboard" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full md:w-auto h-11 bg-transparent">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            className="flex-1 md:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Settings"}
          </Button>
        </div>
      </main>
    </div>
  )
}
