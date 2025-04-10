import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import * as jose from "jose" // Substituir jsonwebtoken por jose
import { getUserByEmail } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "seu_segredo_jwt_super_secreto"
const COOKIE_NAME = "jardim_seguro_auth"

export type User = {
  id: number
  name: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function login(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)

  if (!user) {
    return null
  }

  const passwordMatch = await comparePasswords(password, user.password)

  if (!passwordMatch) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user

  // Criar token JWT usando jose
  const secret = new TextEncoder().encode(JWT_SECRET)
  const token = await new jose.SignJWT(userWithoutPassword)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)

  // Salvar token em cookie
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })

  return userWithoutPassword
}

export async function logout() {
  cookies().delete(COOKIE_NAME)
}

export async function getUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    // Verificar token JWT usando jose
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload as unknown as User
  } catch (error) {
    cookies().delete(COOKIE_NAME)
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
