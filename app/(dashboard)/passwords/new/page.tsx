import { PasswordForm } from "@/components/password-form"

export default function NewPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nova Senha</h1>
        <p className="text-muted-foreground">Adicione uma nova senha ao seu jardim</p>
      </div>

      <div className="max-w-2xl">
        <PasswordForm />
      </div>
    </div>
  )
}
