import pg from 'pg'
import { config } from 'dotenv'
import { readFileSync } from 'fs'
import { resolve } from 'path'

config({ path: resolve('.env.local') })

const { Pool } = pg

async function main() {
  const projectRef = 'sxpjkwomkoypcvjzqbzm'

  // Try with supabase_admin role
  const pool = new Pool({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  })

  try {
    const client = await pool.connect()
    console.log('Connected to Supabase Postgres')

    const sql = readFileSync(resolve('supabase/migrations/002_avatar_system.sql'), 'utf-8')

    // Split into individual statements and run them
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    for (const stmt of statements) {
      const cleanStmt = stmt
        .split('\n')
        .filter((l) => !l.trim().startsWith('--'))
        .join('\n')
        .trim()

      if (!cleanStmt) continue

      try {
        await client.query(cleanStmt)
        const firstLine = cleanStmt.split('\n')[0].slice(0, 100)
        console.log(`✓ ${firstLine}...`)
      } catch (e: any) {
        // Ignore "already exists" type errors
        if (e.message?.includes('already exists') || e.message?.includes('duplicate')) {
          console.log(`- Skipped (already exists): ${cleanStmt.slice(0, 80)}`)
        } else {
          console.error(`✗ ${cleanStmt.slice(0, 80)}`)
          console.error(`  ${e.message}`)
        }
      }
    }

    client.release()
    await pool.end()
    console.log('\n✓ Migration 002 applied successfully')
  } catch (e: any) {
    console.error('Connection failed:', e.message)
    console.log('\nCould not connect directly. Run the SQL manually in the Supabase dashboard:')
    console.log(`  https://supabase.com/dashboard/project/${projectRef}/sql/new`)
    console.log('Paste the contents of: supabase/migrations/002_avatar_system.sql')
  }
}

main()
