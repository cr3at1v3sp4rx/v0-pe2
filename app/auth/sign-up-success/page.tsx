"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2, Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-4 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">Check Your Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-foreground font-medium flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Confirm your email address
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a confirmation email to your inbox. Click the link to verify your account and start creating
                  stunning proposals.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  The confirmation link expires in 24 hours. If you don't see the email, check your spam folder.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <Link href="/auth/login" className="block">
                  <Button
                    type="button"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5"
                  >
                    Back to Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground">Need help? Contact our support team</p>
        </div>
      </div>
    </div>
  )
}
