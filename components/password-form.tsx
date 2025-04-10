"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PasswordInput } from "@/components/ui/password-input"
import { PasswordStrength } from "@/components/ui/password-strength"
import { PlantIcon } from "@/components/ui/plant-icon"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { calculatePasswordStrength, generateRandomPassword } from "@/lib/utils"
import { createPasswordAction, updatePasswordAction } from "@/app/actions/password-actions"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
  website: z.string().optional(),
  category: z.string().default("Geral"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PasswordFormProps {
  initialData?: {
    id: number
    title: string
    username: string
    password: string
    website?: string
    category?: string
    notes?: string
    strength: number
    plantType: string
    growthStage: number
  }
  onSuccess?: () => void
}

export function PasswordForm({ initialData, onSuccess }: PasswordFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [passwordStrength, setPasswordStrength] = useState(initialData?.strength || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      username: initialData?.username || "",
      password: initialData?.password || "",
      website: initialData?.website || "",
      category: initialData?.category || "Geral",
      notes: initialData?.notes || "",
    },
  })

  const password = form.watch("password")

  useEffect(() => {
    if (password) {
      const strength = calculatePasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(0)
    }
  }, [password])

  const generatePassword = () => {
    const newPassword = generateRandomPassword()
    form.setValue("password", newPassword)
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      if (initialData) {
        // Atualizar senha existente
        await updatePasswordAction(initialData.id, {
          ...data,
          strength: passwordStrength,
        })

        toast({
          title: "Senha atualizada",
          description: "Sua senha foi atualizada com sucesso",
        })
      } else {
        // Criar nova senha
        await createPasswordAction({
          ...data,
          strength: passwordStrength,
        })

        toast({
          title: "Senha criada",
          description: "Sua senha foi criada com sucesso",
        })
      }

      router.refresh()

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erro ao salvar senha:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a senha",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {initialData && (
          <div className="flex items-center gap-2 mb-4">
            <PlantIcon plantType={initialData.plantType} growthStage={initialData.growthStage} size="lg" />
            <div>
              <p className="text-sm font-medium">Força da senha</p>
              <PasswordStrength strength={passwordStrength} className="w-40" />
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Email pessoal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuário</FormLabel>
              <FormControl>
                <Input placeholder="Ex: seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <FormControl>
                    <PasswordInput id="password" placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <Button type="button" variant="outline" size="icon" onClick={generatePassword}>
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Gerar senha</span>
                  </Button>
                </div>
                <PasswordStrength strength={passwordStrength} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Trabalho, Pessoal, Finanças" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Informações adicionais sobre esta senha" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
