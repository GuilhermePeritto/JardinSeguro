import crypto from "crypto"

// Chave de criptografia derivada do segredo JWT
const ENCRYPTION_KEY = process.env.JWT_SECRET || "seu_segredo_jwt_super_secreto"
const IV_LENGTH = 16 // Para AES, este é sempre 16 bytes

export function encryptPassword(password: string): string {
  // Criar um IV aleatório
  const iv = crypto.randomBytes(IV_LENGTH)

  // Criar chave derivada usando PBKDF2
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, "salt", 100000, 32, "sha512")

  // Criar cipher com AES-256-CBC
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)

  // Criptografar a senha
  let encrypted = cipher.update(password, "utf8", "base64")
  encrypted += cipher.final("base64")

  // Retornar IV e senha criptografada como uma string
  return iv.toString("hex") + ":" + encrypted
}

export function decryptPassword(encryptedData: string): string {
  // Separar IV e dados criptografados
  const textParts = encryptedData.split(":")
  const iv = Buffer.from(textParts[0], "hex")
  const encryptedText = textParts[1]

  // Criar chave derivada usando PBKDF2
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, "salt", 100000, 32, "sha512")

  // Criar decipher
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)

  // Descriptografar a senha
  let decrypted = decipher.update(encryptedText, "base64", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0

  let score = 0

  // Comprimento
  score += Math.min(password.length * 4, 40)

  // Letras minúsculas
  if (/[a-z]/.test(password)) {
    score += 10
  }

  // Letras maiúsculas
  if (/[A-Z]/.test(password)) {
    score += 10
  }

  // Números
  if (/\d/.test(password)) {
    score += 10
  }

  // Caracteres especiais
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15
  }

  // Combinações
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) {
    score += 5
  }

  if (/\d.*[a-zA-Z]|[a-zA-Z].*\d/.test(password)) {
    score += 5
  }

  if (/[^a-zA-Z0-9].*[a-zA-Z0-9]|[a-zA-Z0-9].*[^a-zA-Z0-9]/.test(password)) {
    score += 5
  }

  // Limitar a 100
  return Math.min(score, 100)
}
