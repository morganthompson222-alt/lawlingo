import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

const STORIES = {
  'A': {
    id: 'contract-offer',
    page: 'A',
    title: 'The Offer That Wasn\'t',
    scenes: [
      { id: 1, character: 'Anna', dialogue: 'I need you to review this case. Mr Patel saw a vintage Ferrari advertised in Classic Cars Monthly for £50,000. He immediately posted a cheque with a letter saying "I accept." But the magazine says the seller denied him the car.', side: 'left' },
      { id: 2, character: 'Marcus', dialogue: 'Was the advertisement an offer or an invitation to treat?', side: 'right', question: {
        id: 'story-a-1',
        page: 'A',
        type: 'mcq',
        question: 'Was the Ferrari advertisement an offer or an invitation to treat?',
        options: [
          { id: 'a', text: 'An offer — but only if the seller\'s car is still available', correct: false },
          { id: 'b', text: 'An invitation to treat — advertisements are generally not offers (*Partridge v Crittenden* [1968])', correct: true },
          { id: 'c', text: 'An offer — all advertisements are offers', correct: false },
          { id: 'd', text: 'Neither — an advertisement is a puff', correct: false },
        ],
        feedback: 'Correct! *Partridge v Crittenden* [1968] 1 WLR 1204 established the general rule. But the seller\'s statement "First person to send full payment secures the car" changes things — akin to *Carlill* [1893] as a unilateral offer.',
        oscoa_references: ['Partridge v Crittenden [1968] 1 WLR 1204', 'Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256'],
        loophole: false, difficulty: 'easy', tags: [], crown_level: 1, section: '', micro_skill: '',
      }},
      { id: 3, character: 'Anna', dialogue: 'But the seller\'s advertisement said "First person to send full payment secures the car." Now that changes things!', side: 'left' },
      { id: 4, character: 'Marcus', dialogue: 'Exactly. *Carlill v Carbolic Smoke Ball Co* [1893] — proof of sincerity. The seller\'s words created a unilateral offer. But does the postal rule apply to payment, not just acceptance?', side: 'right' },
      { id: 5, character: 'Anna', dialogue: 'The postal rule applies to acceptance, not payment. Payment is effective on receipt. So the car was "secured" when payment was received, not when mailed.', side: 'left' },
      { id: 6, character: 'Marcus', dialogue: 'But there\'s more. The contract contained an entire agreement clause. The seller\'s agent told Mr Patel: "The engine has been completely rebuilt — it\'s as good as new." The engine failed. Is the entire agreement clause a bar?', side: 'right' },
      { id: 7, character: 'Anna', dialogue: 'Not necessarily. *J Evans & Son (Portsmouth) Ltd v Andrea Merzario Ltd* [1976] — an oral collateral warranty can coexist with the written contract. And if it was fraudulent, *SERE Holdings v Volkswagen* [2014] — fraud carves out entire agreement clauses.', side: 'left' },
    ],
  },
  'C': {
    id: 'criminal-manslaughter',
    page: 'C',
    title: 'The Boiling Point',
    scenes: [
      { id: 1, character: 'DI Raymond', dialogue: 'Tom, your neighbour heard a loud argument. You said you "couldn\'t take it anymore." Your wife was found with severe head injuries. She died at the scene. Did you intend to kill her?', side: 'left' },
      { id: 2, character: 'Tom', dialogue: 'No... I just lost control. She told me she had been... she said terrible things. I didn\'t mean it.', side: 'right' },
      { id: 3, character: 'Helen (Solicitor)', dialogue: 'I need to assess the partial defences. Was there a qualifying trigger for loss of control under the Coroners and Justice Act 2009?', side: 'left', question: {
        id: 'story-c-1',
        page: 'C',
        type: 'msq',
        question: 'Which elements must D prove for the defence of loss of control?',
        options: [
          { id: 'a', text: 'D lost self-control (CJA 2009, s.54(1)(a))', correct: true },
          { id: 'b', text: 'The loss of self-control had a qualifying trigger (s.55)', correct: true },
          { id: 'c', text: 'A person of D\'s sex and age with normal tolerance might have reacted similarly (s.54(1)(c))', correct: true },
          { id: 'd', text: 'The loss of self-control was sudden', correct: false },
        ],
        feedback: 's.54(2) explicitly provides that loss of self-control need not be sudden. The three required elements are (a), (b), and (c).',
        oscoa_references: ['Coroners and Justice Act 2009, ss.54-56'],
        loophole: false, difficulty: 'medium', tags: [], crown_level: 3, section: '', micro_skill: '',
      }},
      { id: 4, character: 'Dr Asante (Psychiatrist)', dialogue: 'Tom meets the criteria for major depressive disorder — a recognised medical condition under ICD-11. In my opinion, the depression alone would have substantially impaired his self-control.', side: 'right' },
      { id: 5, character: 'Helen', dialogue: 'The jury heard evidence of both loss of control and diminished responsibility. Under s.54(2), they can find voluntary manslaughter on either basis.', side: 'left' },
      { id: 6, character: 'Foreman', dialogue: 'We find the defendant not guilty of murder, but guilty of voluntary manslaughter by reason of diminished responsibility.', side: 'right' },
    ],
  },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')

  if (page && STORIES[page as keyof typeof STORIES]) {
    return NextResponse.json(STORIES[page as keyof typeof STORIES])
  }

  return NextResponse.json(Object.values(STORIES))
}
