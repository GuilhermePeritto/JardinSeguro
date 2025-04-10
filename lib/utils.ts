import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (!date) return ""

  const d = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  if (!date) return ""

  const d = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function getStrengthColor(strength: number): string {
  if (strength >= 80) return "bg-emerald-500"
  if (strength >= 60) return "bg-green-500"
  if (strength >= 40) return "bg-yellow-500"
  if (strength >= 20) return "bg-orange-500"
  return "bg-red-500"
}

export function getStrengthLabel(strength: number): string {
  if (strength >= 80) return "Excelente"
  if (strength >= 60) return "Forte"
  if (strength >= 40) return "Média"
  if (strength >= 20) return "Fraca"
  return "Muito fraca"
}

export function getPlantIcon(plantType: string, growthStage = 1): string {
  const stage = Math.min(Math.max(growthStage, 1), 5)

  switch (plantType) {
    case "arvore":
      return ["🌱", "🌿", "🪴", "🌳", "🌳"][stage - 1]
    case "flor":
      return ["🌱", "🌿", "🪴", "🌷", "🌸"][stage - 1]
    case "arbusto":
      return ["🌱", "🌿", "🪴", "🌵", "🌵"][stage - 1]
    case "grama":
      return ["🌱", "🌿", "🌿", "🌿", "☘️"][stage - 1]
    case "semente":
    default:
      return ["🌱", "🌱", "🌿", "🌿", "🌿"][stage - 1]
  }
}

export function generateRandomPassword(length = 16): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-="
  let password = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0

  let score = 0

  // Comprimento
  score += Math.min(password.length * 4, 40)

  // Letras minúsculas
  if (/[a-z]/.test(password)) {
    score += 10
  }

  // Letras maiúsculas
  if (/[A-Z]/.test(password)) {
    score += 10
  }

  // Números
  if (/\d/.test(password)) {
    score += 10
  }

  // Caracteres especiais
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15
  }

  // Combinações
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) {
    score += 5
  }

  if (/\d.*[a-zA-Z]|[a-zA-Z].*\d/.test(password)) {
    score += 5
  }

  if (/[^a-zA-Z0-9].*[a-zA-Z0-9]|[a-zA-Z0-9].*[^a-zA-Z0-9]/.test(password)) {
    score += 5
  }

  // Limitar a 100
  return Math.min(score, 100)
}
