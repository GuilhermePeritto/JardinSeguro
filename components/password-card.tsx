"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlantIcon } from "@/components/ui/plant-icon"
import { PasswordStrength } from "@/components/ui/password-strength"
import { Copy, ExternalLink, Heart } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface PasswordCardProps {
  id: number
  title: string
  username: string
  website?: string
  strength: number
  plantType: string
  growthStage: number
  favorite: boolean
  updatedAt: string
  onView: () => void
  onCopyUsername: () => void
  onCopyPassword: () => void
  onToggleFavorite: () => void
}

export function PasswordCard({
  id,
  title,
  username,
  website,
  strength,
  plantType,
  growthStage,
  favorite,
  updatedAt,
  onView,
  onCopyUsername,
  onCopyPassword,
  onToggleFavorite,
}: PasswordCardProps) {
  const { toast } = useToast()

  const handleCopyUsername = () => {
    onCopyUsername()
    toast({
      title: "Nome de usuário copiado",
      description: "O nome de usuário foi copiado para a área de transferência",
    })
  }

  const handleCopyPassword = () => {
    onCopyPassword()
    toast({
      title: "Senha copiada",
      description: "A senha foi copiada para a área de transferência",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2">
            <PlantIcon plantType={plantType} growthStage={growthStage} size="lg" />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-lg truncate">{title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary"
                onClick={onToggleFavorite}
              >
                {favorite ? <Heart className="h-4 w-4 fill-primary text-primary" /> : <Heart className="h-4 w-4" />}
                <span className="sr-only">Favorito</span>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground truncate">{username}</p>

            <div className="mt-2">
              <PasswordStrength strength={strength} showLabel={false} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={onView}>
                Ver detalhes
              </Button>

              <Button size="sm" variant="outline" onClick={handleCopyUsername}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Usuário
              </Button>

              <Button size="sm" variant="outline" onClick={handleCopyPassword}>
                <Copy className="h-3.5 w-3.5 mr-1" />
                Senha
              </Button>

              {website && (
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={website.startsWith("http") ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Site
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">Atualizado em {formatDate(updatedAt)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
