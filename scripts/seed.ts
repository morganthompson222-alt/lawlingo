/**
 * Seed script — populates Supabase with sample questions from Module 2A & 2B.
 * Run with: npx tsx scripts/seed.ts
 *
 * Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface SeedQuestion {
  page: string
  section: string
  micro_skill: string
  crown_level: number
  type: 'mcq' | 'msq' | 'tf' | 'scenario' | 'drag_match' | 'fill_blank' | 'drafting'
  loophole: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  question: string
  options: { id: string; text: string; correct: boolean; feedback: string }[]
  feedback: string
  oscoa_references: string[]
}

const contractQuestions: SeedQuestion[] = [
  // Crown 1 — Offer & Invitation to Treat
  {
    page: 'A',
    section: 'A1',
    micro_skill: 'A1.1',
    crown_level: 1,
    type: 'mcq',
    loophole: false,
    difficulty: 'easy',
    tags: ['offer', 'carlill', 'invitation-to-treat'],
    question: 'Which of the following is a legally binding offer under English contract law?',
    options: [
      { id: 'a', text: 'A shop displaying a bottle of wine with a £12 price tag', correct: false, feedback: 'A shop display is an invitation to treat — *Pharmaceutical Society of Great Britain v Boots Cash Chemists (Southern) Ltd* [1953] 1 QB 401.' },
      { id: 'b', text: 'A newspaper advertisement stating "Black leather sofa £200 — first come first served"', correct: false, feedback: 'Advertisements are generally invitations to treat — *Partridge v Crittenden* [1968] 1 WLR 1204.' },
      { id: 'c', text: 'A website stating "Items in your basket are subject to acceptance at checkout"', correct: false, feedback: 'This describes an invitation to treat.' },
      { id: 'd', text: 'A company\'s written statement: "We will pay £100 to any person who uses our product as directed and still catches influenza"', correct: true, feedback: '*Carlill v Carbolic Smoke Ball Co* [1893] 1 QB 256 established that advertisements can be offers when there is a clear promise to pay with proof of sincerity.' },
    ],
    feedback: 'The key insight from *Carlill* [1893] is the proof of sincerity — the company deposited £1,000 in a bank, demonstrating intention to be bound.',
    oscoa_references: ['Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256', 'Pharmaceutical Society of Great Britain v Boots Cash Chemists (Southern) Ltd [1953] 1 QB 401', 'Partridge v Crittenden [1968] 1 WLR 1204'],
  },
  {
    page: 'A',
    section: 'A1',
    micro_skill: 'A1.1',
    crown_level: 1,
    type: 'tf',
    loophole: false,
    difficulty: 'easy',
    tags: ['offer', 'invitation-to-treat', 'shop-display'],
    question: '"A customer takes an item from a supermarket shelf and walks with it to the checkout. At this point, the customer has made an offer to purchase the item." — True or False?',
    options: [
      { id: 't', text: 'True', correct: false, feedback: 'The display of goods is an invitation to treat. The customer makes the offer at the checkout — *Boots* [1953].' },
      { id: 'f', text: 'False', correct: true, feedback: 'Correct. *Pharmaceutical Society of Great Britain v Boots Cash Chemists (Southern) Ltd* [1953] 1 QB 401: the display is an invitation to treat. The customer makes the offer when presenting goods at the checkout, and the cashier accepts.' },
    ],
    feedback: 'This principle was established in *Boots* [1953] to accommodate the practical need for a pharmacist to supervise sales at the checkout rather than at every shelf.',
    oscoa_references: ['Pharmaceutical Society of Great Britain v Boots Cash Chemists (Southern) Ltd [1953] 1 QB 401'],
  },
  {
    page: 'A',
    section: 'A1',
    micro_skill: 'A1.2',
    crown_level: 1,
    type: 'mcq',
    loophole: false,
    difficulty: 'medium',
    tags: ['termination', 'revocation', 'counter-offer'],
    question: 'An offeror offers to sell a farm for £1,000. The offeree replies "I will give £950." The offeror refuses. The offeree then says "I accept your original offer of £1,000." What is the legal position?',
    options: [
      { id: 'a', text: 'Contract formed at £1,000 — the offeree accepted the original terms', correct: false, feedback: 'A counter-offer destroys the original offer. It cannot be later accepted.' },
      { id: 'b', text: 'No contract — the £950 counter-offer destroyed the original offer (*Hyde v Wrench* (1840) 3 Beav 334)', correct: true, feedback: 'Correct. According to *Hyde v Wrench* (1840), a counter-offer operates as a rejection of the original offer. The offeree cannot later revive and accept it.' },
      { id: 'c', text: 'Contract formed at £950 — the offeror rejected the counter-offer', correct: false, feedback: 'The offeror refused the counter-offer, so no contract was formed.' },
      { id: 'd', text: 'The original offer remains open because the offeree ultimately accepted', correct: false, feedback: 'The original offer was destroyed by the counter-offer.' },
    ],
    feedback: 'Hyde v Wrench (1840) is the classic authority: a counter-offer kills the original offer. This is the mirror image rule — acceptance must be unconditional.',
    oscoa_references: ['Hyde v Wrench (1840) 3 Beav 334'],
  },
  // More Crown 1 questions...
  {
    page: 'A',
    section: 'A3',
    micro_skill: 'A3.1',
    crown_level: 1,
    type: 'mcq',
    loophole: false,
    difficulty: 'easy',
    tags: ['consideration', 'currie-v-misa'],
    question: 'In *Currie v Misa* (1875) LR 10 Ex 153, Lush J defined consideration as:',
    options: [
      { id: 'a', text: 'A promise made freely and without expectation', correct: false, feedback: 'Consideration requires an exchange of value, not gratuitous promises.' },
      { id: 'b', text: 'Some right, interest, profit or benefit accruing to the one party, or some forbearance, detriment, loss or responsibility given, suffered or undertaken by the other', correct: true, feedback: 'Correct. This is the classic definition from *Currie v Misa* (1875).' },
      { id: 'c', text: 'A moral duty to perform what one has promised', correct: false, feedback: 'Moral obligation alone is not sufficient consideration in English law.' },
      { id: 'd', text: 'Any act done in contemplation of future benefit', correct: false, feedback: 'This is too broad — the act must be at the promisor\'s request with mutual understanding of payment.' },
    ],
    feedback: 'Without consideration, a gratuitous promise is unenforceable unless made by deed (LP(MP)A 1989, s.1).',
    oscoa_references: ['Currie v Misa (1875) LR 10 Ex 153'],
  },
  // Crown 2 — Acceptance & Postal Rule
  {
    page: 'A',
    section: 'A2',
    micro_skill: 'A2.2',
    crown_level: 2,
    type: 'scenario',
    loophole: false,
    difficulty: 'medium',
    tags: ['postal-rule', 'acceptance', 'adams-v-lindsell'],
    question: 'On Day 1, A posts a letter offering to sell a vintage car. On Day 3, B receives the letter and posts acceptance the same day. On Day 4, A telephones B and says "I\'ve changed my mind — the offer is withdrawn." On Day 5, A receives B\'s letter of acceptance. Is there a contract?',
    options: [
      { id: 'a', text: 'Yes — acceptance was effective on Day 3 (posting) per the postal rule', correct: true, feedback: 'Correct. *Adams v Lindsell* (1818) 106 ER 250: acceptance is effective on posting. The revocation on Day 4 came too late.' },
      { id: 'b', text: 'No — revocation was communicated on Day 4 before acceptance was received', correct: false, feedback: 'Under the postal rule, acceptance is effective on posting, not receipt. The contract was formed on Day 3.' },
      { id: 'c', text: 'Yes — revocation must be in writing to be effective', correct: false, feedback: 'Oral revocation can be effective — but here it was too late because the contract was already formed.' },
      { id: 'd', text: 'No — acceptance is effective only when received (Day 5) but revocation was communicated first (Day 4)', correct: false, feedback: 'The postal rule is an exception to the general rule. Acceptance is effective on posting, not receipt.' },
    ],
    feedback: 'The postal rule (*Adams v Lindsell*) is an exception to the general rule that acceptance must be communicated. It protects the offeree who acts in reliance. However, the offeror can exclude it: *Holwell Securities v Hughes* [1974] — "notice in writing" requires actual communication.',
    oscoa_references: ['Adams v Lindsell (1818) 106 ER 250', 'Holwell Securities Ltd v Hughes [1974] 1 WLR 155'],
  },
  // Crown 4 — Loopholes
  {
    page: 'A',
    section: 'A28',
    micro_skill: 'A28.1',
    crown_level: 5,
    type: 'scenario',
    loophole: true,
    difficulty: 'hard',
    tags: ['entire-agreement', 'collateral-contract', 'loophole', 'andrea-merzario'],
    question: 'Your client signed an investment contract containing: "This agreement constitutes the entire agreement and supersedes all prior representations." Before signing, the bank\'s agent said: "Don\'t worry — this product is 100% capital guaranteed." The product lost 40% of value. The bank relies on the entire agreement clause. Which argument(s) could succeed for your client?',
    options: [
      { id: 'a', text: 'The oral representation constitutes a collateral contract — *J Evans & Son (Portsmouth) Ltd v Andrea Merzario Ltd* [1976] 1 WLR 1078', correct: true, feedback: 'Correct. A collateral oral warranty can operate alongside the written contract despite an entire agreement clause if it was intended to have contractual force.' },
      { id: 'b', text: 'The client has no remedy — the entire agreement clause is binding', correct: false, feedback: 'Entire agreement clauses are not absolute. Courts may find a collateral contract or that the clause is unfair under CRA 2015.' },
      { id: 'c', text: 'The client can claim fraudulent misrepresentation — fraud carves out entire agreement clauses (*SERE Holdings v Volkswagen Group UK Ltd* [2014])', correct: true, feedback: 'Correct. Fraudulent misrepresentation cannot be excluded by an entire agreement clause. *SERE Holdings* [2014] EWHC 1551 (Comm).' },
      { id: 'd', text: 'If the client is a consumer, the entire agreement clause may be an unfair term under Consumer Rights Act 2015, s.62', correct: true, feedback: 'Correct. CRA 2015 s.62 renders unfair terms not binding on consumers. A clause preventing reliance on pre-contractual statements may be unfair.' },
    ],
    feedback: 'Multiple viable arguments: collateral contract (*Andrea Merzario* [1976]), fraud carve-out (*SERE Holdings* [2014]), and CRA 2015 unfair terms. The best argument depends on the facts: if the representation was knowingly false, fraud is strongest. If the client is a consumer, CRA 2015 provides statutory protection.',
    oscoa_references: ['J Evans & Son (Portsmouth) Ltd v Andrea Merzario Ltd [1976] 1 WLR 1078', 'SERE Holdings Ltd v Volkswagen Group UK Ltd [2014] EWHC 1551 (Comm)', 'Consumer Rights Act 2015, s.62'],
  },
]

async function seed() {
  console.log(`Seeding ${contractQuestions.length} questions...`)
  const { data, error } = await supabase
    .from('questions')
    .insert(contractQuestions)
    .select('id')

  if (error) {
    console.error('Seed error:', error.message)
  } else {
    console.log(`Seeded ${data.length} questions successfully.`)
  }
}

seed()
