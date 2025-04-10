import { getPlantIcon } from "@/lib/utils"

interface PlantIconProps {
  plantType: string
  growthStage: number
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function PlantIcon({ plantType, growthStage, size = "md", className }: PlantIconProps) {
  const icon = getPlantIcon(plantType, growthStage)

  const sizeClass = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
    xl: "text-5xl",
  }[size]

  return (
    <span className={`${sizeClass} ${className}`} role="img" aria-label={plantType}>
      {icon}
    </span>
  )
}
