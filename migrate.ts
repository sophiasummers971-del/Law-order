import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function migrate() {
  console.log('🔄 Running S.T.A.R.S. database migrations...')

  const schemaPath = path.join(__dirname, 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')

  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    await client.query(schema)
    await client.query('COMMIT')
    console.log('✅ Migrations complete!')
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch(console.error)
