"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FloatingInputProps extends React.ComponentProps<"input"> {
  label: React.ReactNode
  error?: string
}

function FloatingInput({
  className,
  label,
  error,
  id,
  ...props
}: FloatingInputProps) {
  return (
    <div className="relative">
      <input
        id={id}
        data-slot="input"
        placeholder=" "
        aria-invalid={!!error}
        className={cn(
          "peer h-14 w-full rounded-xl border bg-card/50 px-4 pt-4 pb-2 text-base transition-colors duration-200",
          "border-input",
          "focus:border-primary",
          "outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-transparent",
          "autofill:shadow-[inset_0_0_0px_1000px_hsl(var(--card))] autofill:[-webkit-text-fill-color:hsl(var(--foreground))]",
          error && "border-destructive focus:border-destructive",
          className,
        )}
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 z-10 origin-left px-1 ml-[-4px] rounded-sm transition-all duration-200 ease-out",
          "bg-card/50 text-muted-foreground",
          "top-0 -translate-y-1/2 text-xs font-medium",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:ml-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal",
          "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-[#141414] peer-focus:px-1 peer-focus:ml-[-4px] peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary",
          "peer-not-placeholder-shown:text-primary",
          error && "peer-focus:text-destructive peer-not-placeholder-shown:text-destructive",
        )}
      >
        {label}
      </label>

      {error && (
        <p className="mt-1.5 text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}

interface FloatingTextareaProps extends React.ComponentProps<"textarea"> {
  label: React.ReactNode
  error?: string
}

function FloatingTextarea({
  className,
  label,
  error,
  id,
  ...props
}: FloatingTextareaProps) {
  return (
    <div className="relative">
      <textarea
        id={id}
        data-slot="textarea"
        placeholder=" "
        aria-invalid={!!error}
        className={cn(
          "peer min-h-[120px] w-full rounded-xl border bg-card/50 px-4 pt-6 pb-3 text-base transition-colors duration-200 resize-none",
          "border-input",
          "focus:border-primary",
          "outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-transparent",
          error && "border-destructive focus:border-destructive",
          className,
        )}
        {...props}
      />

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 z-10 origin-left px-1 ml-[-4px] rounded-sm transition-all duration-200 ease-out",
          "bg-card text-muted-foreground",
          "top-0 -translate-y-1/2 text-xs font-medium",
          "peer-placeholder-shown:top-4 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-placeholder-shown:ml-0 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal",
          "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-card peer-focus:px-1 peer-focus:ml-[-4px] peer-focus:text-xs peer-focus:font-medium peer-focus:text-primary",
          "peer-not-placeholder-shown:text-primary",
          error && "peer-focus:text-destructive peer-not-placeholder-shown:text-destructive",
        )}
      >
        {label}
      </label>

      {error && (
        <p className="mt-1.5 text-sm font-medium text-destructive">{error}</p>
      )}
    </div>
  )
}

export { FloatingInput, FloatingTextarea }
