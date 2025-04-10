import { notFound } from "next/navigation"
import { getPasswordAction } from "@/app/actions/password-actions"
import { PasswordForm } from "@/components/password-form"

interface PasswordPageProps {
  params: {
    id: string
  }
}

export default async function PasswordPage({ params }: PasswordPageProps) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const password = await getPasswordAction(id)

  if (!password) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Senha</h1>
        <p className="text-muted-foreground">Atualize os detalhes da sua senha</p>
      </div>

      <div className="max-w-2xl">
        <PasswordForm
          initialData={{
            id: password.id,
            title: password.title,
            username: password.username,
            password: password.password,
            website: password.website || undefined,
            category: password.category || undefined,
            notes: password.notes || undefined,
            strength: password.strength,
            plantType: password.plant_type,
            growthStage: password.growth_stage,
          }}
        />
      </div>
    </div>
  )
}
