/**
 * LawLingo Bulk Seed Script
 * Imports all question JSON files from seed-data/ into the Supabase questions table.
 *
 * Usage:
 *   npm install -D tsx
 *   npx tsx scripts/bulk-seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const SEED_DIR = path.resolve(__dirname, '../seed-data')
const PAGES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

async function seedPage(page: string): Promise<{ page: string; inserted: number; errors: number }> {
  const filePath = path.join(SEED_DIR, `questions-page-${page}.json`)
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ Page ${page}: no seed file found, skipping`)
    return { page, inserted: 0, errors: 0 }
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  if (!Array.isArray(data) || data.length === 0) {
    console.log(`  ⚠ Page ${page}: empty or invalid JSON, skipping`)
    return { page, inserted: 0, errors: 0 }
  }

  const questions = data.map((q: any) => ({
    page: q.page,
    section: q.section,
    micro_skill: q.micro_skill,
    crown_level: q.crown_level,
    type: q.type,
    loophole: q.loophole ?? false,
    difficulty: q.difficulty ?? 'medium',
    tags: q.tags ?? [],
    question: q.question,
    options: q.options,
    feedback: q.feedback ?? '',
    oscoa_references: q.oscoa_references ?? [],
  }))

  const batchSize = 50
  let inserted = 0
  let errors = 0

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize)
    const { data: result, error } = await supabase
      .from('questions')
      .insert(batch)
      .select('id')

    if (error) {
      console.error(`    Batch ${i / batchSize + 1} error: ${error.message}`)
      errors += batch.length
    } else {
      inserted += result?.length ?? batch.length
    }
  }

  return { page, inserted, errors }
}

async function main() {
  console.log('Seeding LawLingo question database...\n')

  const results = []

  for (const page of PAGES) {
    process.stdout.write(`Page ${page}...`)
    const result = await seedPage(page)
    results.push(result)
    console.log(` ${result.inserted} inserted, ${result.errors} errors`)
  }

  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0)
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0)

  console.log(`\n✅ Seeding complete: ${totalInserted} questions inserted, ${totalErrors} errors`)

  // Print page breakdown
  for (const r of results) {
    console.log(`  Page ${r.page}: ${r.inserted} questions`)
  }
}

main().catch(console.error)
