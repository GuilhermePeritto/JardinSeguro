"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { deletePasswordAction } from "@/app/actions/password-actions"

interface DeletePasswordPageProps {
  params: {
    id: string
  }
}

export default function DeletePasswordPage({ params }: DeletePasswordPageProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const id = Number.parseInt(params.id)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deletePasswordAction(id)
    } catch (error) {
      console.error("Erro ao excluir senha:", error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">Excluir Senha</CardTitle>
          <CardDescription className="text-center">Tem certeza que deseja excluir esta senha?</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
