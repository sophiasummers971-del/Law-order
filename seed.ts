import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function seed() {
  console.log('🌱 Seeding S.T.A.R.S. database...')

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 12)
    const lawyerHash = await bcrypt.hash('lawyer123', 12)
    const userHash = await bcrypt.hash('user123', 12)

    // Insert demo users
    const usersResult = await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, organisation, bar_number, location, language)
      VALUES 
        ('admin@lexcore.ai', $1, 'System', 'Administrator', 'admin', 'S.T.A.R.S. Command', 'SRA-ADMIN-001', 'London, UK', 'en'),
        ('lawyer@lexcore.ai', $2, 'Sarah', 'Chen', 'lawyer', 'Angel Investigations', 'SRA-78432-London', 'London, UK', 'en'),
        ('user@lexcore.ai', $3, 'James', 'Doe', 'user', 'Self-represented', NULL, 'Manchester, UK', 'en')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `, [adminHash, lawyerHash, userHash])

    console.log('✅ Users seeded:', usersResult.rows.map((r: any) => r.email))

    // Insert user settings
    for (const row of usersResult.rows) {
      await client.query(`
        INSERT INTO user_settings (user_id, default_jurisdiction, default_priority, data_retention_days)
        VALUES ($1, 'England & Wales', 'normal', 365)
        ON CONFLICT DO NOTHING
      `, [row.id])
    }

    // Insert demo cases
    const lawyerId = usersResult.rows.find((r: any) => r.email === 'lawyer@lexcore.ai')?.id

    if (lawyerId) {
      const casesResult = await client.query(`
        INSERT INTO cases (user_id, title, description, offence_type, jurisdiction, priority, status, progress, facts)
        VALUES 
          ($1, 'SHPO Challenge - Operation Dewey', 'Challenge to Sexual Harm Prevention Order proportionality', 'Sexual Offences (SHPO/SRO)', 'England & Wales', 'high', 'complete', 100, 'Defendant faces SHPO with internet restrictions. No relevant convictions. Employment requires internet access. Article 8 proportionality challenge.'),
          ($1, 'Article 8 Appeal - Operation Hanna', 'Appeal against disproportionate SRO conditions', 'Sexual Offences (SHPO/SRO)', 'England & Wales', 'urgent', 'researching', 65, 'Contact offence evidence requirement challenge. Procedural irregularities in PACE compliance.'),
          ($1, 'PACE Review - Operation Samuel', 'Review of detention and evidence gathering procedures', 'Violent Crime', 'England & Wales', 'normal', 'cross_checking', 85, 'Right to legal advice under s.58 PACE. Delayed access to solicitor. Potential exclusion of evidence under s.78.')
        RETURNING id, title
      `, [lawyerId])

      console.log('✅ Cases seeded:', casesResult.rows.map((r: any) => r.title))

      // Insert agent tasks for first case
      for (const caseRow of casesResult.rows) {
        if (caseRow.title.includes('Dewey')) {
          await client.query(`
            INSERT INTO agent_tasks (case_id, agent_type, status, progress, findings, confidence)
            VALUES 
              ($1, 'statute_hunter', 'complete', 100, 'SOA 2003 s.103, HRA 1998 Art.8, PACE 1984 s.58', 95),
              ($1, 'case_law_miner', 'complete', 100, 'Dewey 2024, Hanna 2023, Parsons 2017, Ivey v Genting', 92),
              ($1, 'defence_architect', 'complete', 100, 'Article 8 proportionality, necessity defence, s.78 exclusion', 88),
              ($1, 'precedent_matcher', 'complete', 100, '3 matching precedents: similar fact patterns, successful outcomes', 85),
              ($1, 'jurisdiction_scout', 'complete', 100, 'Scottish Act 2016 relevant, EU precedents limited post-Brexit', 78),
              ($1, 'procedural_checker', 'complete', 100, 'PACE s.58 compliance verified, disclosure obligations met', 96),
              ($1, 'sentencing_advisor', 'complete', 100, 'Guidelines analysis, mitigation strategies identified', 82),
              ($1, 'appeal_strategist', 'complete', 100, 'Grounds established, prospects good, time limits checked', 90)
          `, [caseRow.id])
        }
      }
    }

    await client.query('COMMIT')
    console.log('✅ Database seeding complete!')
    console.log('')
    console.log('Demo credentials:')
    console.log('  Admin:  admin@lexcore.ai / admin123')
    console.log('  Lawyer: lawyer@lexcore.ai / lawyer123')
    console.log('  User:   user@lexcore.ai / user123')

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(console.error)
