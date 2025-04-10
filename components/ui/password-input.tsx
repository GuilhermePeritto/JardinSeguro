"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PasswordInputProps {
  id: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  required?: boolean
}

export function PasswordInput({
  id,
  value,
  onChange,
  className,
  placeholder = "Senha",
  required,
  ...props
}: PasswordInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn("pr-10", className)}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
      </Button>
    </div>
  )
}
