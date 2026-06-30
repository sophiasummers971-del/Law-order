import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function setUserContext(client: any, userId: string, role: string) {
  await client.query('SET LOCAL app.current_user_id = $1', [userId])
  await client.query('SET LOCAL app.current_user_role = $1', [role])
}

export async function query(sql: string, params?: any[]) {
  const pool = getPool()
  return pool.query(sql, params)
}

export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
