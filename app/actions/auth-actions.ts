"use server"

import { redirect } from "next/navigation"
import { createUser, getUserByEmail } from "@/lib/db"
import { hashPassword, login, logout } from "@/lib/auth"

export async function registerAction(data: {
  name: string
  email: string
  password: string
}) {
  // Verificar se o email já existe
  const existingUser = await getUserByEmail(data.email)

  if (existingUser) {
    return {
      success: false,
      message: "Este email já está em uso",
    }
  }

  try {
    // Hash da senha
    const hashedPassword = await hashPassword(data.password)

    // Criar usuário
    await createUser(data.name, data.email, hashedPassword)

    // Login automático
    const user = await login(data.email, data.password)

    if (!user) {
      return {
        success: false,
        message: "Erro ao fazer login automático",
      }
    }
  } catch (error) {
    console.error("Erro na ação de registro:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao criar sua conta",
    }
  }

  // Redirecionar para a página inicial - fora do try/catch
  redirect("/")
}

export async function loginAction(data: {
  email: string
  password: string
}) {
  try {
    const user = await login(data.email, data.password)

    if (!user) {
      return {
        success: false,
        message: "Email ou senha incorretos",
      }
    }
  } catch (error) {
    console.error("Erro na ação de login:", error)
    return {
      success: false,
      message: "Ocorreu um erro ao fazer login",
    }
  }

  // Redirecionar para a página inicial - fora do try/catch
  redirect("/")
}

export async function logoutAction() {
  try {
    await logout()
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
  }

  // Redirecionar para a página de login - fora do try/catch
  redirect("/login")
}
