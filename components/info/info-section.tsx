"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoSectionProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
}

export function InfoSection({ icon, title, children, className }: InfoSectionProps) {
  return (
    <Card className={cn("bg-card/50 border-border", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{icon}</div>
          <CardTitle className="font-serif text-xl font-medium text-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface CopyCodeButtonProps {
  code: string
  copyLabel: string
  copiedLabel: string
}

export function CopyCodeButton({ code, copyLabel, copiedLabel }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
      <code className="flex-1 font-mono text-sm text-primary">{code}</code>
      <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-1 text-primary" />
            {copiedLabel}
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-1" />
            {copyLabel}
          </>
        )}
      </Button>
    </div>
  )
}
