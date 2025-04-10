"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PasswordCard } from "@/components/password-card"
import { decryptPassword } from "@/lib/encryption"
import { toggleFavoriteAction, updateLastUsedAction } from "@/app/actions/password-actions"
import { useToast } from "@/hooks/use-toast"

interface Password {
  id: number
  title: string
  username: string
  password_encrypted: string
  website: string | null
  category: string | null
  strength: number
  plant_type: string
  growth_stage: number
  favorite: boolean
  updated_at: string
}

interface GardenViewProps {
  passwords: Password[]
}

export function GardenView({ passwords: initialPasswords }: GardenViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [passwords, setPasswords] = useState(initialPasswords)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPasswords, setFilteredPasswords] = useState(passwords)

  useEffect(() => {
    setPasswords(initialPasswords)
  }, [initialPasswords])

  useEffect(() => {
    if (searchTerm) {
      const filtered = passwords.filter(
        (password) =>
          password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (password.website && password.website.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (password.category && password.category.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredPasswords(filtered)
    } else {
      setFilteredPasswords(passwords)
    }
  }, [searchTerm, passwords])

  const handleCopyUsername = async (username: string) => {
    await navigator.clipboard.writeText(username)
  }

  const handleCopyPassword = async (id: number, encryptedPassword: string) => {
    try {
      const decrypted = decryptPassword(encryptedPassword)
      await navigator.clipboard.writeText(decrypted)
      await updateLastUsedAction(id)

      // Atualizar o estágio de crescimento localmente
      setPasswords((prev) =>
        prev.map((p) => (p.id === id ? { ...p, growth_stage: Math.min(p.growth_stage + 1, 5) } : p)),
      )
    } catch (error) {
      console.error("Erro ao copiar senha:", error)
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive",
      })
    }
  }

  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleFavoriteAction(id)

      // Atualizar o estado de favorito localmente
      setPasswords((prev) => prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)))
    } catch (error) {
      console.error("Erro ao marcar como favorito:", error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o favorito",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar senhas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => router.push("/passwords/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Senha
        </Button>
      </div>

      {filteredPasswords.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-medium mb-2">Seu jardim está vazio</h3>
          <p className="text-muted-foreground mb-4">
            Adicione suas primeiras senhas para começar a cultivar seu jardim seguro
          </p>
          <Button onClick={() => router.push("/passwords/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Senha
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPasswords.map((password) => (
            <PasswordCard
              key={password.id}
              id={password.id}
              title={password.title}
              username={password.username}
              website={password.website || undefined}
              strength={password.strength}
              plantType={password.plant_type}
              growthStage={password.growth_stage}
              favorite={password.favorite}
              updatedAt={password.updated_at}
              onView={() => router.push(`/passwords/${password.id}`)}
              onCopyUsername={() => handleCopyUsername(password.username)}
              onCopyPassword={() => handleCopyPassword(password.id, password.password_encrypted)}
              onToggleFavorite={() => handleToggleFavorite(password.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
