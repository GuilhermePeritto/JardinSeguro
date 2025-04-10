import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Inicializa a conexão com o banco de dados Neon
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

// Funções de acesso ao banco de dados
export async function getUserByEmail(email: string) {
  const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return result[0] || null
}

export async function createUser(name: string, email: string, hashedPassword: string) {
  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, name, email, created_at
  `
  return result[0]
}

export async function getPasswordsByUserId(userId: number) {
  return await sql`
    SELECT * FROM passwords 
    WHERE user_id = ${userId}
    ORDER BY favorite DESC, updated_at DESC
  `
}

export async function getPasswordById(id: number, userId: number) {
  const result = await sql`
    SELECT * FROM passwords 
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `
  return result[0] || null
}

export async function createPassword(data: {
  userId: number
  title: string
  username: string
  encryptedPassword: string
  website?: string
  category?: string
  strength: number
  notes?: string
}) {
  // Determinar o tipo de planta com base na força da senha
  const plantType = getPlantTypeByStrength(data.strength)

  const result = await sql`
    INSERT INTO passwords (
      user_id, title, username, password_encrypted, 
      website, category, strength, plant_type, notes
    )
    VALUES (
      ${data.userId}, ${data.title}, ${data.username}, ${data.encryptedPassword},
      ${data.website || null}, ${data.category || "Geral"}, ${data.strength},
      ${plantType}, ${data.notes || null}
    )
    RETURNING *
  `

  return result[0]
}

export async function updatePassword(
  id: number,
  userId: number,
  data: {
    title?: string
    username?: string
    encryptedPassword?: string
    website?: string
    category?: string
    strength?: number
    notes?: string
    favorite?: boolean
  },
) {
  // Construir a query dinamicamente com base nos campos fornecidos
  const updateFields = []
  const values: any[] = []

  if (data.title !== undefined) {
    updateFields.push(`title = $${updateFields.length + 1}`)
    values.push(data.title)
  }

  if (data.username !== undefined) {
    updateFields.push(`username = $${updateFields.length + 1}`)
    values.push(data.username)
  }

  if (data.encryptedPassword !== undefined) {
    updateFields.push(`password_encrypted = $${updateFields.length + 1}`)
    values.push(data.encryptedPassword)

    if (data.strength !== undefined) {
      updateFields.push(`strength = $${updateFields.length + 1}`)
      values.push(data.strength)

      // Atualizar o tipo de planta com base na nova força
      const plantType = getPlantTypeByStrength(data.strength)
      updateFields.push(`plant_type = $${updateFields.length + 1}`)
      values.push(plantType)

      // Incrementar o estágio de crescimento
      updateFields.push(`growth_stage = growth_stage + 1`)
    }
  }

  if (data.website !== undefined) {
    updateFields.push(`website = $${updateFields.length + 1}`)
    values.push(data.website)
  }

  if (data.category !== undefined) {
    updateFields.push(`category = $${updateFields.length + 1}`)
    values.push(data.category)
  }

  if (data.notes !== undefined) {
    updateFields.push(`notes = $${updateFields.length + 1}`)
    values.push(data.notes)
  }

  if (data.favorite !== undefined) {
    updateFields.push(`favorite = $${updateFields.length + 1}`)
    values.push(data.favorite)
  }

  // Adicionar timestamp de atualização
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

  if (updateFields.length === 0) {
    return null
  }

  const updateQuery = `
    UPDATE passwords 
    SET ${updateFields.join(", ")}
    WHERE id = $${values.length + 1} AND user_id = $${values.length + 2}
    RETURNING *
  `

  values.push(id, userId)

  const result = await sql.query(updateQuery, values)
  return result.rows[0] || null
}

export async function deletePassword(id: number, userId: number) {
  const result = await sql`
    DELETE FROM passwords 
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id
  `
  return result[0] || null
}

export async function updateLastUsed(id: number, userId: number) {
  await sql`
    UPDATE passwords 
    SET last_used = CURRENT_TIMESTAMP, 
        growth_stage = LEAST(growth_stage + 1, 5)
    WHERE id = ${id} AND user_id = ${userId}
  `
}

export async function getCategoriesByUserId(userId: number) {
  return await sql`
    SELECT * FROM categories 
    WHERE user_id = ${userId}
    ORDER BY name
  `
}

// Função auxiliar para determinar o tipo de planta com base na força da senha
function getPlantTypeByStrength(strength: number): string {
  if (strength >= 90) return "arvore"
  if (strength >= 70) return "flor"
  if (strength >= 50) return "arbusto"
  if (strength >= 30) return "grama"
  return "semente"
}
