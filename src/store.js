import { writable } from 'svelte/store'

const GITHUB_URL = 'https://github.com/Nyxox-debug/campusChatAnton'

export { GITHUB_URL }

const WELCOME_MESSAGE = {
  id: 0,
  role: 'assistant',
  content: "Hello! I'm your Campus Support Assistant. Please select your role below to get started.",
  timestamp: new Date()
}

export const messages = writable([WELCOME_MESSAGE])
export const isLoading = writable(false)
export const userRole = writable(null)

const knowledgeBase = {
  student: {
    admissions: "For admissions inquiries, visit the Admissions Office (Block A, Room 101) Mon–Fri 8am–5pm, or email admissions@university.edu. Deadlines: Undergraduate – March 31 · Postgraduate – June 30.",
    fees: "Tuition fees: Undergraduate ₦150,000–₦300,000 · Postgraduate ₦200,000–₦450,000 depending on faculty. Pay via the student portal at portal.university.edu or at any GTBank branch using your student ID.",
    results: "Check results on the student portal under 'Academic Records'. Published within 6 weeks of exams. For transcript requests, visit the Registrar's office with your student ID.",
    courses: "Course registration opens two weeks before each semester. Log into the portal → 'Course Registration' → select your courses. Contact your HOD if a course is locked.",
    library: "Library hours: Mon–Sat 7am–10pm · Sun 12pm–8pm. Your student ID is your library card. Remote e-journal access available via the library portal.",
    hostel: "Hostel allocation is done online via the student portal during registration. Fees: Male ₦45,000/session · Female ₦50,000/session. Contact Student Affairs for issues.",
    default: "I can help with admissions, fees, results, course registration, library access, and hostel queries. Could you be more specific about what you need?"
  },
  staff: {
    payroll: "Salaries are processed on the 25th of each month. View payslips on the HR portal at hr.university.edu. Report discrepancies to the Bursar's office within 5 working days.",
    leave: "Submit annual leave requests at least 2 weeks in advance via the HR portal. You are entitled to 30 days annual leave. Medical leave requires a doctor's certificate within 48 hours.",
    it: "IT support: Log a ticket at helpdesk.university.edu or call ext. 5000. Guides for email setup, VPN, and password reset are in the IT knowledge base.",
    procurement: "Purchase requests need HOD approval before submission to Procurement. Use the online form at procurement.university.edu. Processing takes 5–10 working days.",
    training: "Staff development programs are on the HR portal. External training needs HOD + HR approval. Submit certificates to HR within one week of completion.",
    default: "I can assist with payroll, leave requests, IT support, procurement, and training programs. What do you need help with?"
  }
}

function detectTopic(message, role) {
  const lower = message.toLowerCase()
  const kb = knowledgeBase[role]
  if (!kb) return "Please select your role first to get relevant help."

  if (role === 'student') {
    if (lower.match(/admiss|apply|application|enroll/)) return kb.admissions
    if (lower.match(/fee|tuit|pay|payment|school fee/)) return kb.fees
    if (lower.match(/result|grade|score|transcript|cgpa/)) return kb.results
    if (lower.match(/course|register|class|subject|unit/)) return kb.courses
    if (lower.match(/librar|book|journal|read/)) return kb.library
    if (lower.match(/hostel|accommodat|room|lodge/)) return kb.hostel
  } else {
    if (lower.match(/salary|payroll|pay|payslip|wage/)) return kb.payroll
    if (lower.match(/leave|annual|vacation|off|medical/)) return kb.leave
    if (lower.match(/\bit\b|tech|computer|email|vpn|password|internet/)) return kb.it
    if (lower.match(/procure|purchase|buy|order|request/)) return kb.procurement
    if (lower.match(/train|develop|workshop|seminar/)) return kb.training
  }
  return kb.default
}

export function resetChat(role) {
  const welcomeText = role === 'student'
    ? "Welcome, Student! I can help you with admissions, fees, academic records, course registration, library, and hostel queries. What do you need help with?"
    : "Welcome, Staff Member! I can assist with payroll, leave requests, IT support, procurement, and training. How can I help?"

  messages.set([
    {
      id: Date.now(),
      role: 'assistant',
      content: welcomeText,
      timestamp: new Date()
    }
  ])
  userRole.set(role)
}

export async function sendMessage(userMessage, role) {
  const userMsg = { id: Date.now(), role: 'user', content: userMessage, timestamp: new Date() }
  messages.update(msgs => [...msgs, userMsg])
  isLoading.set(true)

  await new Promise(r => setTimeout(r, 800 + Math.random() * 500))

  const response = detectTopic(userMessage, role)
  const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: response, timestamp: new Date() }
  messages.update(msgs => [...msgs, assistantMsg])
  isLoading.set(false)
}

export async function sendMessageWithAI(userMessage, role, history) {
  isLoading.set(true)
  const systemPrompt = role === 'student'
    ? 'You are a helpful campus support assistant for students. Help with admissions, fees, results, course registration, library, and hostels. Be friendly and concise.'
    : 'You are a helpful campus support assistant for staff. Help with payroll, leave, IT support, procurement, and training. Be professional and efficient.'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [...history, { role: 'user', content: userMessage }]
    })
  })
  const data = await res.json()
  isLoading.set(false)
  return data.content[0].text
}
