/**
 * Gold-Standard Seed Script
 * Imports all gold-standard-*.json files into the v2 questions table.
 *
 * Usage: npx tsx scripts/seed-gold-standard.ts
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

async function seedGoldStandard() {
  const files = fs.readdirSync(SEED_DIR).filter(f => f.startsWith('gold-standard-') && f.endsWith('.json'))
  
  if (files.length === 0) {
    console.log('No gold-standard files found.')
    return
  }

  console.log(`Found ${files.length} gold-standard files\n`)

  let totalInserted = 0
  let totalErrors = 0

  for (const file of files) {
    const filePath = path.join(SEED_DIR, file)
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    if (!Array.isArray(raw) || raw.length === 0) {
      console.log(`  ⚠ ${file}: empty or invalid, skipping`)
      continue
    }

    const questions = raw.map((q: any) => ({
      lesson_id: q.lessonId,
      micro_skill: q.microSkill,
      block: q.block,
      phase: q.phase,
      teaching_summary: q.teachingSummary || null,
      type: q.type,
      question: q.question || '',
      answer: q.answer || '',
      options: q.options || [],
      feedback: q.feedback || '',
      oscoa_references: q.oscoaReferences || [],
      difficulty: q.difficulty || 'medium',
      tags: q.tags || [],
    }))

    // Insert in batches of 50
    const batchSize = 50
    let fileInserted = 0
    let fileErrors = 0

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize)
      const { error } = await supabase.from('questions').insert(batch)

      if (error) {
        console.error(`  ${file} batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        fileErrors += batch.length
      } else {
        fileInserted += batch.length
      }
    }

    const ms = questions[0].micro_skill
    console.log(`  ${file}: ${fileInserted} inserted, ${fileErrors} errors (${ms})`)
    totalInserted += fileInserted
    totalErrors += fileErrors
  }

  console.log(`\n✅ Gold standard seeding complete: ${totalInserted} inserted, ${totalErrors} errors`)
}

seedGoldStandard().catch(console.error)
