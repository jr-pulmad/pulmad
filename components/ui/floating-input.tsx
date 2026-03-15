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
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value)
    props.onChange?.(e)
  }

  React.useEffect(() => {
    setHasValue(!!props.value)
  }, [props.value])

  const isFloating = isFocused || hasValue

  return (
    <div className="relative">
      <input
        id={id}
        data-slot="input"
        className={cn(
          "peer h-14 w-full rounded-xl border bg-card px-4 pt-4 pb-2 text-base transition-colors duration-200",
          "border-input dark:bg-secondary/30",
          "focus:border-primary",
          // Remove all ring and outline styles
          "outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
          error && "border-destructive focus:border-destructive",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        placeholder=" "
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-invalid={!!error}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 transition-all duration-200 ease-out",
          "text-muted-foreground",
          isFloating 
            ? "top-0 -translate-y-1/2 text-xs font-medium text-primary bg-card dark:bg-[hsl(var(--card))] px-1 ml-[-4px]" 
            : "top-[50%] -translate-y-1/2 text-base",
          error && isFloating && "text-destructive",
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
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue)

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    props.onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(!!e.target.value)
    props.onChange?.(e)
  }

  React.useEffect(() => {
    setHasValue(!!props.value)
  }, [props.value])

  const isFloating = isFocused || hasValue

  return (
    <div className="relative">
      <textarea
        id={id}
        data-slot="textarea"
        className={cn(
          "peer min-h-[120px] w-full rounded-xl border bg-card px-4 pt-6 pb-3 text-base transition-colors duration-200 resize-none",
          "border-input dark:bg-secondary/30",
          "focus:border-primary",
          // Remove all ring and outline styles
          "outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
          error && "border-destructive focus:border-destructive",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        placeholder=" "
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        aria-invalid={!!error}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-4 transition-all duration-200 ease-out",
          "text-muted-foreground",
          isFloating 
            ? "top-0 -translate-y-1/2 text-xs font-medium text-primary bg-card dark:bg-[hsl(var(--card))] px-1 ml-[-4px]" 
            : "top-4 text-base",
          error && isFloating && "text-destructive",
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
