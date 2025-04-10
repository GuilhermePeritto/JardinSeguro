import { cn } from "@/lib/utils"
import { getStrengthColor, getStrengthLabel } from "@/lib/utils"

interface PasswordStrengthProps {
  strength: number
  showLabel?: boolean
  className?: string
}

export function PasswordStrength({ strength, showLabel = true, className }: PasswordStrengthProps) {
  const strengthColor = getStrengthColor(strength)
  const strengthLabel = getStrengthLabel(strength)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-500", strengthColor)} style={{ width: `${strength}%` }} />
      </div>

      {showLabel && (
        <div className="flex justify-between text-xs">
          <span>{strengthLabel}</span>
          <span>{strength}%</span>
        </div>
      )}
    </div>
  )
}
