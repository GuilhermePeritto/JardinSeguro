"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getUser, requireAuth } from "@/lib/auth"
import { createPassword, getPasswordById, updatePassword, deletePassword, updateLastUsed } from "@/lib/db"
import { encryptPassword, decryptPassword } from "@/lib/encryption"

export async function createPasswordAction(data: {
  title: string
  username: string
  password: string
  website?: string
  category?: string
  notes?: string
  strength: number
}) {
  const user = await requireAuth()

  const encryptedPassword = encryptPassword(data.password)

  await createPassword({
    userId: user.id,
    title: data.title,
    username: data.username,
    encryptedPassword,
    website: data.website,
    category: data.category,
    strength: data.strength,
    notes: data.notes,
  })

  revalidatePath("/")
  redirect("/")
}

export async function getPasswordAction(id: number) {
  const user = await requireAuth()

  const password = await getPasswordById(id, user.id)

  if (!password) {
    return null
  }

  return {
    ...password,
    password: decryptPassword(password.password_encrypted),
  }
}

export async function updatePasswordAction(
  id: number,
  data: {
    title?: string
    username?: string
    password?: string
    website?: string
    category?: string
    notes?: string
    strength?: number
  },
) {
  const user = await requireAuth()

  const updateData: any = { ...data }

  if (data.password) {
    updateData.encryptedPassword = encryptPassword(data.password)
    delete updateData.password
  }

  await updatePassword(id, user.id, updateData)

  revalidatePath("/")
  revalidatePath(`/passwords/${id}`)
}

export async function deletePasswordAction(id: number) {
  const user = await requireAuth()

  await deletePassword(id, user.id)

  revalidatePath("/")
  redirect("/")
}

export async function toggleFavoriteAction(id: number) {
  const user = await requireAuth()

  const password = await getPasswordById(id, user.id)

  if (!password) {
    return
  }

  await updatePassword(id, user.id, {
    favorite: !password.favorite,
  })

  revalidatePath("/")
}

export async function updateLastUsedAction(id: number) {
  const user = await getUser()

  if (!user) {
    return
  }

  await updateLastUsed(id, user.id)
}
