import { getPasswordsByUserId } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { GardenView } from "@/components/garden-view"

export default async function HomePage() {
  const user = await requireAuth()
  const passwords = await getPasswordsByUserId(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seu Jardim Seguro</h1>
        <p className="text-muted-foreground">Gerencie suas senhas de forma segura e criativa</p>
      </div>

      <GardenView passwords={passwords} />
    </div>
  )
}
