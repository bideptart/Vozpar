import {
  Home,
  Stethoscope,
  HeartPulse,
  Wrench,
  UtensilsCrossed,
  Car,
  Scale,
  GraduationCap,
  ShoppingBag,
  Dumbbell,
  type LucideIcon,
} from "lucide-react"

export type Industry = {
  slug: string
  name: string
  icon: LucideIcon
  short: string
  /** 2-3 sentence positioning paragraph for the dedicated section. */
  pitch: string
  /** Bullet points: things the agent does on day one. */
  jobs: string[]
  /** A handful of representative real-world phrases the agent handles well. */
  sampleLines: string[]
}

export const INDUSTRIES: Industry[] = [
  {
    slug: "real-estate",
    name: "Real estate",
    icon: Home,
    short:
      "Qualifies every buyer and seller lead around the clock, books showings straight onto your calendar, and follows up the instant a listing gets a hit.",
    pitch:
      "Most leads go cold in the first five minutes — on hold, or leaving a voicemail nobody returns. 9278.ai answers instantly, qualifies buyers and sellers with the same discipline as your best agent, and books the showing directly on your calendar, so every conversation you join starts with context instead of a cold callback.",
    jobs: [
      "Answers Zillow, Redfin, and website leads in under three seconds",
      "Qualifies budget, timeline, financing, and motivation before you pick up",
      "Books and reschedules showings directly on your team calendar",
      "Sends listing follow-ups by SMS and email, automatically",
      "Hands warm buyers to your top agent live, mid-call",
    ],
    sampleLines: [
      "Hi! I saw you just inquired about the colonial on Maple — are you working with an agent yet?",
      "Quick question — are you pre-approved, or would you like me to introduce a lender?",
      "I have Tuesday at 4 or Saturday at 11 open for a showing — which works better?",
    ],
  },
  {
    slug: "dental",
    name: "Dental practices",
    icon: Stethoscope,
    short:
      "Confirms appointments, fills last-minute cancellations, and answers insurance and treatment questions — without pulling the front desk off the patient in the chair.",
    pitch:
      "Front desks miss a fifth to nearly half of inbound calls during lunch and after hours. 9278.ai picks up every one: confirms cleanings, refills cancellations from your waitlist, answers insurance questions with precision, and routes only the genuine emergencies to your team.",
    jobs: [
      "Confirms and reschedules cleanings, hygiene, and ortho visits",
      "Fills last-minute openings straight from your cancellation list",
      "Verifies benefits and explains estimated patient cost",
      "Triages emergencies — toothache, broken crown — and warm-transfers",
      "Sends pre-visit instructions and intake forms automatically",
    ],
    sampleLines: [
      "Hi Mrs. Patel, this is the office at Sunrise Dental confirming your cleaning tomorrow at 2:30. Reply 1 to confirm or 2 to reschedule.",
      "Sure — your plan covers two cleanings a year, and your last one was in January, so you're due.",
      "That sounds like a real toothache. Let me get Dr. Lee on the line right now.",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare clinics",
    icon: HeartPulse,
    short:
      "Handles patient intake, prescription refills, and reminder calls with a calm, HIPAA-aware bedside tone your patients won't distinguish from a person.",
    pitch:
      "Health systems are buried in repetitive phone work. 9278.ai automates intake, refill requests, post-visit follow-ups, and benefits questions with a warm, unhurried bedside tone that elderly and ESL patients genuinely respond to.",
    jobs: [
      "Captures new-patient intake and demographic details",
      "Routes prescription refill requests to the pharmacy",
      "Runs post-discharge follow-up and symptom tracking",
      "Confirms appointments with a built-in re-confirmation flow",
      "Explains benefits and copay details clearly, every time",
    ],
    sampleLines: [
      "Just checking in — on a scale of 0 to 10, how is your pain today compared to right after surgery?",
      "Of course. I can request a refill for your lisinopril at the CVS on Main — does that still work for you?",
      "Take a breath. I'm going to ask a few short questions, and then a nurse will call you back within ten minutes.",
    ],
  },
  {
    slug: "home-services",
    name: "Home services",
    icon: Wrench,
    short:
      "Captures every after-hours service request, dispatches the right technician, and makes sure a slow callback never costs you the job again.",
    pitch:
      "HVAC, plumbing, electrical, and roofing contractors live and die by callback speed. 9278.ai answers every after-hours and weekend call, captures the job details, prices emergencies correctly, and books the right technician straight onto your dispatch board.",
    jobs: [
      "Handles after-hours emergency intake — no AC, no heat, water leak",
      "Triages same-day versus scheduled work",
      "Books directly into ServiceTitan, Housecall Pro, and Jobber",
      "Quotes accurate price ranges by job type and zip code",
      "Sends estimate-day reminders and arrival-window updates",
    ],
    sampleLines: [
      "Got it — no cold air, started this afternoon, and you've got a 2-year-old at home. I'm marking this priority.",
      "Our next emergency window is 7–9pm tonight. Tech rate is $129 plus parts. Want me to lock that in?",
      "Mike is 22 minutes out. I'll text you when he's at the door.",
    ],
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    icon: UtensilsCrossed,
    short:
      "Takes reservations, confirms large parties, and answers hours and menu questions fluently — in any accent your guests speak.",
    pitch:
      "Phones during dinner rush are a tax on your host stand. 9278.ai handles reservations, confirms large parties, answers hours and menu questions, and routes catering inquiries — so your hosts can stay focused on the room, not the receiver.",
    jobs: [
      "Books and modifies reservations on OpenTable and Resy",
      "Qualifies large-party and private-event requests",
      "Answers hours, parking, and dress-code questions",
      "Handles allergen and dietary inquiries with live menu lookups",
      "Captures catering and gift-card leads",
    ],
    sampleLines: [
      "We have a 4-top open Friday at 7:30 or 8:45 — which would you like?",
      "All our pasta is made fresh daily. The tagliatelle is egg-based, but the spaghetti is vegan.",
      "For a party of 12 we'd recommend the back room — let me grab a few details.",
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    icon: Car,
    short:
      "Books service, follows up on every test drive, and keeps the BDC lines open around the clock, across every rooftop you run.",
    pitch:
      "Dealerships still lose deals overnight. 9278.ai handles service scheduling, test-drive follow-ups, parts inquiries, and trade-in questions — for a single rooftop or a multi-state dealer group, on one platform.",
    jobs: [
      "Books service appointments by VIN and mileage",
      "Follows up on test drives with credit pre-qualification",
      "Answers parts and warranty inquiries",
      "Captures trade-in valuation leads",
      "Coordinates loaner-vehicle dispatch",
    ],
    sampleLines: [
      "Looks like your 2022 Outback is due for the 30k service. I have Thursday at 8 or Friday at 10:30 — which works?",
      "I can get you a Carfax estimate on your trade if I have the VIN — got a minute to grab it?",
      "Loaner vehicle is confirmed. We'll have it ready when you drop off Tuesday at 7:30am.",
    ],
  },
  {
    slug: "legal",
    name: "Legal",
    icon: Scale,
    short:
      "Screens new clients, qualifies cases by jurisdiction and statute of limitations, and books consults — without a paralegal chained to the phone.",
    pitch:
      "Personal-injury, immigration, and family-law firms live or die on lead intake. 9278.ai screens every inbound call against your conflict and qualification rules, captures the facts your attorneys actually need, and books a paid consult before the lead shops your competitor.",
    jobs: [
      "Routes by practice area and runs conflict checks",
      "Screens statute-of-limitations and jurisdiction fit",
      "Books paid consults with payment capture",
      "Sends pre-consult document-collection reminders",
      "Handles Spanish-language intake out of the box",
    ],
    sampleLines: [
      "I'm sorry to hear about the accident. Was a police report filed, and were you treated at a hospital?",
      "Got it — that puts you within the two-year window in Texas. Let me get you on the attorney's calendar.",
      "Antes de la consulta, necesitaremos su identificación y el reporte del accidente.",
    ],
  },
  {
    slug: "education",
    name: "Education",
    icon: GraduationCap,
    short:
      "Runs admissions intake, financial-aid follow-ups, and student-success calls — without burning out your enrollment counselors.",
    pitch:
      "Higher-ed and trade schools field hundreds of inquiries a day. 9278.ai handles first-touch outreach, chases financial-aid documents, and runs re-enrollment campaigns, so your counselors only talk to leads who are genuinely ready.",
    jobs: [
      "Follows up on inquiry forms within 60 seconds",
      "Checks application status and chases missing documents",
      "Answers financial-aid questions and sends FAFSA reminders",
      "Sends class-start reminders and books orientation",
      "Runs at-risk student check-ins between terms",
    ],
    sampleLines: [
      "Hi Marcus — I saw you started an application for the medical-assisting program. Want me to walk you through next steps?",
      "Looks like we're still missing your high-school transcript. Want me to text you the upload link?",
      "Just checking in — the next term starts Jan 22. Are you still planning to register?",
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce",
    icon: ShoppingBag,
    short:
      "Handles order status, returns, and sizing questions 24/7 in any language, in a tone that matches your brand.",
    pitch:
      "DTC brands hit support volume spikes the moment a campaign takes off. 9278.ai absorbs the surge — order status, returns, sizing, and post-purchase upsells — and escalates only the genuinely upset customers to a human.",
    jobs: [
      "Provides order status and tracking updates",
      "Handles returns, exchanges, and warranty intake",
      "Answers sizing, fit, and product-recommendation questions",
      "Runs upsell and replenishment follow-up calls",
      "Executes win-back campaigns for lapsed customers",
    ],
    sampleLines: [
      "Looks like your order shipped Monday and is out for delivery today before 6pm.",
      "Totally understandable. I'll get a return label sent — should I refund to the card you paid with?",
      "Based on your last order, the size 9 should fit a touch better than the 8.5. Want me to swap it?",
    ],
  },
  {
    slug: "fitness",
    name: "Fitness & wellness",
    icon: Dumbbell,
    short:
      "Books classes, recovers no-shows, and sells memberships for studios and gyms — without a front-desk human on every call.",
    pitch:
      "Boutique gyms, yoga studios, and PT clinics fill classes by phone and text. 9278.ai books classes, recovers no-shows within minutes, sells memberships, and re-engages lapsed members, at a fraction of the cost of an answering service.",
    jobs: [
      "Books classes and trainers on Mindbody, Mariana Tek, and ClubReady",
      "Handles membership freeze, cancel, and upgrade requests",
      "Recovers no-shows within minutes of class ending",
      "Runs trial-to-member upsell calls",
      "Wins back lapsed members at month-end",
    ],
    sampleLines: [
      "Hey Sam — saw you missed the 6am class. Want me to grab you the 5pm spot tonight?",
      "Your trial wraps on Friday. I can lock in the unlimited plan at $149 if I do it before Sunday — interested?",
      "We can freeze your membership for up to 90 days at no cost. Want me to set that up?",
    ],
  },
]

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug)
}
