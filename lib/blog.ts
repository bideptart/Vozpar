/**
 * File-based blog content for Vozpar.
 * Add a new entry to BLOG_POSTS to publish a post — the index and [slug]
 * pages render from this single source. Content is a list of typed blocks.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "html"; html: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "callout"; html: string; variant?: "warn" }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cards"; items: { title: string; body: string }[] }
  | { type: "figure"; svg: string; caption: string }
  | { type: "image"; src: string; alt: string }
  | { type: "faq"; items: { q: string; a: string }[] }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string // ISO yyyy-mm-dd
  readingMinutes: number
  author: string
  featured?: boolean
  cover?: string
  content: Block[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "speech-to-speech-vs-cascaded-voice-ai",
    cover: "/blog/speech-to-speech-vs-cascaded-voice-ai/cover.jpg",
    title: "Speech-to-speech vs cascaded voice AI: latency decides the call",
    excerpt:
      "Speech-to-speech vs cascaded voice AI decides how fast and human a call feels. Compare the two architectures, their latency, and which to pick in 2026.",
    category: "Architecture",
    date: "2026-06-16",
    readingMinutes: 10,
    author: "The Vozpar Team",
    featured: true,
    content: [
            { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "On a phone call, speed is not a vanity metric. It is the difference between a conversation that feels human and one that feels like waiting for a machine. The architecture under the hood, speech-to-speech or cascaded, sets that ceiling before you tune anything else. This guide explains how each works, why latency stacks the way it does, and how to choose the right one for your use case.",
      },
      { type: "h2", text: "How cascaded voice AI works" },
      { type: "image", src: "/blog/speech-to-speech-vs-cascaded-voice-ai/cascaded.jpg", alt: "How cascaded voice AI works" },
      {
        type: "p",
        text: "The cascaded approach, sometimes called STT, LLM, TTS, chains three separate models. First speech-to-text transcribes what the caller said. Then a language model reads that text and decides on a reply. Then text-to-speech turns the reply back into audio. Each model can be excellent on its own, yet they run in series, and the call pays for every handoff between them.",
      },
      {
        type: "p",
        text: "Public benchmarks put the stages in rough terms: speech-to-text near 350 ms, the language model near 375 ms, and text-to-speech near 100 ms, plus media edge, buffering, and short service hops between each. Add them and total response time often clears 800 ms before the caller hears a word. That is well past the point where a person notices the lag.",
      },
      {
        type: "p",
        text: "The delay is only half the cost. Every time audio is flattened into text, nuance is thrown away. The transcript of \"no, that is fine\" reads the same whether the caller was relieved or quietly furious, because tone does not survive the trip to plain text. The language model then reasons over words alone, and the text-to-speech stage guesses at delivery from scratch. Errors compound, too: a transcription mistake early in the chain becomes a confident wrong answer later, since each stage trusts the output of the one before it. None of this means cascaded systems are bad. It means the architecture spends effort rebuilding, imperfectly, the very signals that were present in the original audio.",
      },
      { type: "h2", text: "How speech-to-speech works" },
      { type: "image", src: "/blog/speech-to-speech-vs-cascaded-voice-ai/speech-to-speech.jpg", alt: "How speech-to-speech works" },
      {
        type: "p",
        text: "Speech-to-speech, also called audio-native or voice to voice, collapses that chain into one model. It hears audio and produces audio directly, with no text intermediary. By skipping the transcription and synthesis stages and the hops between them, it removes the largest sources of delay. Streaming audio-native systems can keep response times below the 200 to 300 ms threshold where delay becomes perceptible.",
      },
      {
        type: "callout",
        html: "Reported results favor the shorter path: removing the separate speech-to-text and text-to-speech stages can cut latency by a large margin versus a non-streaming cascaded pipeline. Fewer stages, fewer milliseconds.",
      },
      {
        type: "p",
        text: "There is a second benefit beyond speed. When audio is flattened to plain text, tone, pauses, and emotion fall out. An audio-native model keeps them, so it can hear the caller's intonation and shape its own reply with matching warmth and timing. This is the design Vozpar runs on: a single audio-native engine instead of a brittle transcribe-then-speak relay, which is what lets callers hear pauses and emotion that feel right.",
      },
      {
        type: "p",
        text: "Interruptions are where the difference becomes obvious. On a real call, people talk over each other constantly. They cut in to correct a detail, to say \"actually, wait,\" or to answer before the agent finishes. A cascaded pipeline struggles here, because an interruption means tearing down a half-finished transcribe-reason-speak cycle and starting again, which produces the awkward stammer everyone recognizes as a bot. An audio-native model that streams can stop the instant it hears the caller, listen, and respond in stride, the way a person naturally yields the floor. That single behavior, smooth barge-in, does more to make a call feel human than almost anything else, and it is far easier to achieve when there is one model in the loop rather than three.",
      },
      { type: "h2", text: "Latency, side by side" },
      { type: "image", src: "/blog/speech-to-speech-vs-cascaded-voice-ai/latency.jpg", alt: "Latency, side by side" },
      {
        type: "p",
        text: "The clearest way to compare is to line the two paths up against the things callers actually feel.",
      },
      {
        type: "table",
        head: ["Dimension", "Cascaded (STT, LLM, TTS)", "Speech-to-speech"],
        rows: [
          ["Typical latency", "Often 800 ms or more", "Can stay under 300 ms"],
          ["Stages in series", "Three models plus hops", "One audio-native model"],
          ["Tone and emotion", "Lost in the text step", "Preserved end to end"],
          ["Interruptions", "Harder, pipeline must reset", "Natural barge-in"],
          ["Debuggability", "Per-stage visibility", "Fewer seams to inspect"],
        ],
      },
      {
        type: "p",
        text: "Sub-second latency is the headline number to watch. A reply that lands inside 300 ms feels like a person; one that lands at 800 ms feels like dead air, and callers start talking over it.",
      },
      {
        type: "p",
        text: "It is worth understanding why that threshold is so unforgiving. In natural human conversation, the gap between turns is astonishingly small, often around 200 ms, and we are exquisitely tuned to it. A pause longer than that reads as hesitation, confusion, or distraction, the same way it would from a person. So when an agent consistently takes most of a second to respond, callers do not consciously think \"high latency\"; they think the line is laggy, or that the agent did not understand, and they repeat themselves or interrupt. That repetition then collides with a pipeline still finishing its previous turn, and the call degrades into the stop-start rhythm that screams automation. The architecture decision, made long before any prompt tuning, is what sets the ceiling on how natural that rhythm can ever feel.",
      },
      { type: "h2", text: "When cascaded still makes sense" },
      { type: "image", src: "/blog/speech-to-speech-vs-cascaded-voice-ai/when-cascaded.jpg", alt: "When cascaded still makes sense" },
      {
        type: "p",
        text: "Speed is not the only thing teams optimize for. Cascaded pipelines dominate some enterprise deployments for reasons worth respecting.",
      },
      {
        type: "cards",
        items: [
          { title: "Per-stage visibility", body: "You can inspect the transcript, the model decision, and the audio separately, which simplifies audits." },
          { title: "Provider flexibility", body: "Mix and match many speech and language vendors rather than a short list of audio-native options." },
          { title: "Mature tooling", body: "Fallbacks, logging, and guardrails are well trodden across the cascaded stack." },
          { title: "Debugging control", body: "When something goes wrong, you can localize it to one stage instead of one fused model." },
        ],
      },
      {
        type: "p",
        text: "If your priority is forensic control at every step and you can tolerate higher latency, cascaded earns its place. For most customer-facing calls, where the call has to feel human, the latency cost is the deciding factor and audio-native wins.",
      },
      {
        type: "p",
        text: "A simple way to decide is to name the stakes of the conversation. Internal tooling, batch QA, or a workflow where a half-second delay costs nothing can lean cascaded and enjoy the visibility. A sales line, a receptionist, a support number, or any call where a hesitation makes the caller doubt they are being heard should lean audio-native. It is also worth noting that the two are not always mutually exclusive in a stack: some teams run audio-native for the live conversation and still log full transcripts for analytics and compliance afterward, which captures much of the auditability without paying the latency tax during the call itself. Pick the property your callers will feel, then let that, not the spec sheet, settle the architecture.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "Speech-to-speech and cascaded voice AI are not just implementation details, they set the experience. Cascaded gives you visibility and provider choice at the cost of stacked latency. Speech-to-speech trades some of that granularity for speed and preserved emotion, which is what makes a call sound human. Decide which property your callers will feel most, then pick the architecture that protects it.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "What is the difference between speech-to-speech and cascaded voice AI?", a: "Cascaded voice AI chains three models: speech-to-text, then a language model, then text-to-speech. Speech-to-speech uses a single audio-native model that hears audio and speaks audio directly, with no text step in the middle, which removes several handoffs and cuts latency." },
          { q: "Why does latency matter on a voice call?", a: "Humans notice delay past roughly 200 to 300 milliseconds. Beyond that, replies feel laggy and callers start talking over the agent. Lower latency keeps turn-taking natural, so the conversation feels like a person rather than a machine waiting for a pipeline to catch up." },
          { q: "Is speech-to-speech always faster than cascaded?", a: "Usually, yes. Speech-to-speech skips the speech-to-text and text-to-speech stages and the service hops between them, which can cut total response time substantially. Cascaded pipelines add each stage in series, so latency stacks even when each model is fast on its own." },
          { q: "When is cascaded voice AI still the better choice?", a: "Cascaded pipelines give you per-stage visibility, easier debugging, and a wide choice of speech and language providers. Teams with strict audit or provider-flexibility needs sometimes prefer that control, accepting higher latency in exchange for transparency at each step." },
          { q: "Does speech-to-speech preserve tone and emotion?", a: "Yes. Because audio is never flattened into plain text, a speech-to-speech model can read the caller's intonation and pacing and shape its own reply to match. That is why audio-native calls carry warmth and timing that a transcribe-then-speak pipeline tends to lose." },
        ],
      },
    ],
  },

  {
    slug: "ai-voice-agent-pricing-per-minute",
    cover: "/blog/ai-voice-agent-pricing-per-minute/cover.jpg",
    title: "AI voice agent pricing: what you actually pay per minute",
    excerpt:
      "AI voice agent pricing looks simple at $0.10 per minute, but add-ons change the math. See what AI voice agents really cost per minute in 2026, line by line.",
    category: "Pricing",
    date: "2026-06-16",
    readingMinutes: 9,
    author: "The Vozpar Team",
    content: [
            { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "AI voice agent pricing reads like a single number on a landing page, then arrives as something larger on the invoice. The gap is not a trick so much as a bundling choice, and once you know the layers you can compare any vendor in minutes. This guide breaks down what an AI voice agent really costs per minute in 2026, where the hidden charges hide, and how to model your own monthly spend before you sign anything.",
      },
      { type: "h2", text: "What AI voice agents cost per minute in 2026" },
      { type: "image", src: "/blog/ai-voice-agent-pricing-per-minute/cost-per-minute.jpg", alt: "What AI voice agents cost per minute in 2026" },
      {
        type: "p",
        text: "Across the market, published AI voice agent pricing spans a wide band: roughly $0.05 to $1.50 per minute, and enterprise voice with managed support can run past $2. The spread is not random. It tracks how much of the call stack the rate covers and how much hand-holding comes with it.",
      },
      {
        type: "table",
        head: ["Tier", "Typical rate", "What it usually means"],
        rows: [
          ["Self-serve", "$0.05 to $0.12 / min", "You configure and run it yourself, often usage based with no minimum seat"],
          ["Business", "$0.50 to $1 / min", "More integrations, support, and call routing baked in"],
          ["Enterprise", "$1 to $2+ / min", "SLAs, dedicated support, advanced analytics and compliance"],
        ],
      },
      {
        type: "p",
        text: "A useful anchor: Vozpar lists three usage tiers at $0.15, $0.12, and $0.10 per minute, with the rate dropping as your volume rises. That sits firmly in the self-serve band, which is where most teams should start before paying for managed layers they may not need yet.",
      },
      {
        type: "p",
        text: "Why does the same product span such a wide range? Three forces push the number around. The first is bundling, which we cover below: a low rate often means more line items live outside it. The second is support and accountability. A $1.50 rate frequently buys an SLA, a named contact, and someone to call at 2am, while a $0.10 rate assumes you run the agent yourself. The third is volume, since per-minute rates almost always step down as you commit more, because the vendor's own infrastructure cost falls with scale. None of these is good or bad on its own. The mistake is comparing a managed enterprise rate against a self-serve rate as if they were the same purchase. They are not, and the right tier depends on how much you want to own versus hand off.",
      },
      { type: "h2", text: "The hidden layers behind the headline rate" },
      { type: "image", src: "/blog/ai-voice-agent-pricing-per-minute/hidden-layers.jpg", alt: "The hidden layers behind the headline rate" },
      {
        type: "p",
        text: "Most platforms advertise the orchestration rate, the cost of running the conversation loop. That figure often excludes the parts that actually make the call happen. When you stack them, a \"$0.05\" agent can land closer to $0.14 all-in.",
      },
            {
        type: "cards",
        items: [
          { title: "Speech-to-text", body: "Converting caller audio to text in cascaded systems, billed per minute of audio processed." },
          { title: "Language model", body: "The reasoning that decides what to say. Heavier models cost more per token." },
          { title: "Text-to-speech", body: "Turning the reply into a voice. Premium neural voices carry a premium price." },
          { title: "Telephony", body: "Actual phone minutes over the PSTN. Often billed by your carrier, not the platform." },
        ],
      },
      {
        type: "p",
        text: "One design choice removes several of these layers. An audio-native engine that goes voice to voice skips the separate speech-to-text and text-to-speech meters, because there is no transcription or synthesis stage to bill. That is why Vozpar folds the voice model into a single per-minute figure. Telephony stays its own clear line: route through the carrier you already use, or provision an optional number from the platform, with US numbers from $2 a month and other regions from $5. Either way the phone line shows up as a visible item rather than a markup buried inside the voice rate.",
      },
      {
        type: "p",
        text: "The practical test when you read any rate card is one blunt question: does this number include the language model and the voice, or just the loop that connects them? If the answer is vague, assume the worst and ask for an all-in figure in writing. A vendor that is confident in its pricing will give you one without flinching. A vendor that cannot, or will not, is telling you something about the invoice that is coming. Keep that habit and you will rarely be surprised by a bill.",
      },
      { type: "h2", text: "Pricing models: prepaid credit, usage, and seats" },
      { type: "image", src: "/blog/ai-voice-agent-pricing-per-minute/pricing-models.jpg", alt: "Pricing models: prepaid credit, usage, and seats" },
      {
        type: "p",
        text: "Beyond the rate, the billing model shapes your risk. There are three common shapes, and each rewards a different buyer.",
      },
      { type: "h3", text: "Prepaid credit" },
      {
        type: "p",
        text: "You top up a balance and draw it down per minute. It caps your exposure and suits teams testing a use case. Watch the expiry window: some credit expires fast. As a reference point, Vozpar uses $20, $50, or $100 top-ups with credit valid for 60 days.",
      },
      { type: "h3", text: "Pure usage" },
      {
        type: "p",
        text: "Pay only for minutes used, no base fee. Clean for variable volume, but model a busy month so a spike does not surprise you.",
      },
      { type: "h3", text: "Per-seat or subscription" },
      {
        type: "p",
        text: "A flat monthly fee, sometimes with minutes included. Predictable, but you pay whether the line is busy or quiet, which punishes seasonal callers.",
      },
      {
        type: "p",
        text: "There is no universally correct model, only a correct fit. A law firm with steady weekday intake may prefer the predictability of a subscription. A seasonal home-services contractor whose phones explode in July and go quiet in February is far better served by pure usage or prepaid credit, where the bill tracks the actual season. Map your call volume across a full year before you choose, and weight the busy months heavily, because that is when a poorly chosen model hurts most.",
      },
      { type: "h2", text: "How to estimate your real monthly cost" },
      { type: "image", src: "/blog/ai-voice-agent-pricing-per-minute/estimate-cost.jpg", alt: "How to estimate your real monthly cost" },
      {
        type: "p",
        text: "The math is simple once you separate voice from telephony. Use this order so nothing slips through:",
      },
      {
        type: "callout",
        html: "<strong>Monthly voice spend</strong> = (expected call minutes) x (all-in per-minute rate)<br/><strong>Plus</strong> carrier telephony minutes, billed by your provider<br/><strong>Plus</strong> any fixed platform or seat fee",
      },
      {
        type: "p",
        text: "Worked example: a clinic expects 5,000 answered minutes a month. At a $0.12 all-in rate, the voice line is about $600. Telephony is separate, often a few cents a minute, and there is no seat fee on a usage model. The lesson is not the exact figure, it is the habit: get one all-in voice rate, then add phone minutes as their own line so you can audit both. Before you commit, it is fair and smart to price two or three vendors the same way and validate the numbers against your own call volume.",
      },
      {
        type: "p",
        text: "It also pays to compare against the cost you are replacing, not just rival platforms. A part-time human handling overflow and after-hours calls carries a wage, payroll tax, benefits, training, and the calls they still miss while on a break or asleep. When you put the AI voice line next to that fully loaded number rather than against zero, the per-minute rate usually looks small. The honest caveat is that minutes can run higher than you expect if calls are long or volume spikes, so model a busy month, not an average one, and set a top-up ceiling you are comfortable with. Used that way, a transparent per-minute rate becomes a budgeting tool rather than a guessing game.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "AI voice agent pricing is only confusing when the layers stay hidden. Ask for an all-in per-minute rate, find out which of the five cost components it includes, keep telephony as its own line, and model a realistic month before signing. Do that and the cheapest sticker rarely wins; the clearest rate card does.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "How much does an AI voice agent cost per minute?", a: "Published AI voice agent pricing runs from about $0.05 to $1.50 per minute in 2026. Entry self-serve platforms sit at $0.05 to $0.12, business tiers land near $0.50 to $1, and enterprise voice with managed support and SLAs can pass $2 per minute." },
          { q: "Why is my AI voice agent bill higher than the advertised rate?", a: "Many platforms advertise only the orchestration rate. Your real bill can add speech-to-text, the language model, text-to-speech, telephony, and platform fees. Stacked together these can double or triple the headline number, so read the full rate card first." },
          { q: "What is included in a transparent per-minute price?", a: "A transparent price folds the voice model, reasoning, and platform into one figure. Telephony is often separate because carriers bill it directly. Ask whether speech-to-text, text-to-speech, and concurrency are inside the quoted rate or added on top." },
          { q: "Do AI voice agent minutes or credits expire?", a: "It depends on the provider. Some prepaid credit sets an expiry window. On Vozpar, voice credit stays valid for 60 days from purchase, and top-ups start at $20 with no contract, so you commit only to what you expect to use." },
          { q: "How do I estimate my monthly AI voice agent cost?", a: "Multiply expected call minutes by the all-in per-minute rate, then add carrier telephony and any platform fee. For 5,000 minutes at $0.12 all-in plus telephony, budget the voice line near $600 and confirm the carrier charge as a separate line." },
        ],
      },
    ],
  },

  {
    slug: "ai-voice-agent-for-real-estate",
    cover: "/blog/ai-voice-agent-for-real-estate/cover.jpg",
    title: "AI voice agent for real estate: stop losing leads to missed calls",
    excerpt:
      "An AI voice agent for real estate answers every lead instantly, qualifies buyers, and books showings 24/7. See the missed-call math and how to deploy one.",
    category: "Real Estate",
    date: "2026-06-16",
    readingMinutes: 9,
    author: "The Vozpar Team",
    content: [
            { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "In real estate, the agent who answers first usually wins the deal. Yet busy agents miss a large share of calls, and roughly half of all leads come in after the office closes. An AI voice agent for real estate fixes the math: it answers every call on the first ring, qualifies the lead, and books the showing while the prospect is still interested. Here is what it does, the numbers behind it, and how to put one on your line.",
      },
      { type: "h2", text: "The missed-call problem, in numbers" },
      { type: "image", src: "/blog/ai-voice-agent-for-real-estate/missed-call.jpg", alt: "The missed-call problem, in numbers" },
      {
        type: "p",
        text: "Lead loss in real estate is rarely about effort. It is about timing. The data is consistent and unforgiving:",
      },
      {
        type: "table",
        head: ["Signal", "What the research shows"],
        rows: [
          ["Missed calls", "Busy agents miss roughly 40 percent of incoming calls"],
          ["Speed to lead", "Replying within 5 minutes makes you about 21x more likely to qualify the lead"],
          ["After hours", "Around half of leads arrive outside business hours"],
          ["Follow-up", "A majority of internet leads are wasted due to slow or no follow-up"],
        ],
      },
      {
        type: "p",
        text: "Put together, the picture is clear. The lead exists, the intent is real, and the deal is lost to a voicemail box. A buyer who reaches a voicemail at 9 pm simply dials the next listing.",
      },
      {
        type: "p",
        text: "It helps to translate the loss into dollars, because the abstraction hides the pain. Picture an agent who gets forty inbound inquiries a week and misses sixteen of them, a conservative forty percent. Say one in ten qualified calls eventually becomes a closing, and an average commission is several thousand dollars. Even a handful of missed inquiries a month carries an expected value that dwarfs the cost of answering them. This is why the missed-call problem is not a customer-service footnote for brokerages, it is a revenue line. The leads were paid for already, through portals, ads, and signage. Letting them hit voicemail is paying to generate demand and then declining to pick up the phone when it arrives.",
      },
      { type: "h2", text: "What an AI voice agent does for agents and brokerages" },
      { type: "image", src: "/blog/ai-voice-agent-for-real-estate/what-it-does.jpg", alt: "What an AI voice agent does for agents and brokerages" },
      {
        type: "p",
        text: "An AI voice agent acts as an always-on member of the team. It does the repetitive front-line work so human agents spend their hours on the conversations that close.",
      },
      {
        type: "cards",
        items: [
          { title: "Answers instantly, 24/7", body: "Every inbound call picked up on the first ring, including nights and weekends." },
          { title: "Qualifies the lead", body: "Asks budget, timeline, financing, and property interest, then scores and routes." },
          { title: "Books showings", body: "Checks your calendar and confirms a viewing slot before the caller hangs up." },
          { title: "Updates the CRM", body: "Logs every detail and follow-up automatically, so nothing slips through." },
        ],
      },
      {
        type: "p",
        text: "It also runs outbound: lead revival on aging records, instant speed-to-lead callbacks the moment a web form is filled, and follow-up that never forgets. When a call needs a human, it warm-transfers with full context so the buyer never repeats themselves.",
      },
      {
        type: "p",
        text: "The outbound side is where many teams find the surprise upside. Most CRMs are full of leads that went cold simply because no one called them back in time, or at all. An agent can work that aging list patiently, reviving prospects a human team would never get to, and hand the ones who re-engage straight to an agent. On the inbound side, speed to lead is the whole game: when a buyer fills out a form on a listing, a callback within seconds, while they are still looking at the photos, converts at a wildly higher rate than one that comes the next morning. Doing that by hand across every portal and every hour is impossible for a human team. It is routine for an agent that never sleeps, never forgets a follow-up, and treats the two-hundredth call of the day with the same energy as the first.",
      },
      { type: "h2", text: "A day in the life: the 9 pm inquiry" },
      { type: "image", src: "/blog/ai-voice-agent-for-real-estate/day-in-life.jpg", alt: "A day in the life: the 9 pm inquiry" },
            {
        type: "p",
        text: "A buyer calls about a listing at 9 pm. The agent picks up on the first ring, confirms which property, asks whether they are pre-approved and when they want to tour, then offers two showing windows and books one. The CRM is updated, the human agent gets a briefed handoff in the morning, and the lead never had a reason to call anyone else. That single saved call is the whole argument: at typical conversion rates and commissions, the expected value of one captured inquiry is large, which is why missed calls quietly cost brokerages thousands a month.",
      },
      {
        type: "p",
        text: "Now compare that to the status quo. The same buyer calls at 9 pm, reaches voicemail, and leaves a half-hearted message, or more often leaves none and calls the next agent on the search results. By the time someone listens to the message the next morning, the buyer has already booked a showing with a competitor who answered. Nothing about the first agent's skill or listings decided that outcome; availability did. The agent who was reachable won, and the one who was asleep lost a lead they had already paid to generate. Multiply that across a year of evenings and weekends and the pattern, not any single call, is what separates a growing pipeline from a leaking one.",
      },
      { type: "h2", text: "How to deploy one without disrupting your stack" },
      { type: "image", src: "/blog/ai-voice-agent-for-real-estate/deploy.jpg", alt: "How to deploy one without disrupting your stack" },
      {
        type: "p",
        text: "You do not need to change phone numbers or rebuild your tools. The path is short:",
      },
      {
        type: "callout",
        html: "<strong>1.</strong> Design the agent with your scripts, qualifying questions, and guardrails. <strong>2.</strong> Connect your listings, FAQs, calendar, and CRM. <strong>3.</strong> Route your existing number and go live, inbound and outbound from one dashboard.",
      },
      {
        type: "p",
        text: "Because Vozpar connects to the carrier you already use, your numbers and billing can stay where they are, or you can provision a dedicated number from the platform if you prefer. Pre-tuned real estate playbooks give you a running start, with scripts already shaped around qualifying buyers, booking showings, and following up. You scale from one line to a full team without per-seat math, and the agent updates your CRM and calendar as it works.",
      },
      {
        type: "p",
        text: "A sensible rollout starts narrow. Point the agent at your after-hours and overflow calls first, the ones currently going to voicemail, where there is no downside because those leads were already being lost. Listen to the transcripts for a week, tune the qualifying questions and the handoff rules, then widen its scope as your confidence grows. Keep a clean warm-transfer path to your best agents for the buyers who are ready to talk now, so the human touch lands exactly where it matters. As always, trial it against your real calls and validate the numbers before you roll it out brokerage-wide, because the goal is more booked showings, not just more answered calls.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "Real estate runs on speed to lead, and missed calls quietly drain the pipeline. An AI voice agent answers every inquiry instantly, qualifies it, books the showing, and logs the lead, day or night. Start by aiming it at your after-hours and overflow calls, keep a clean handoff to your agents, and let the captured deals make the case.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "What does an AI voice agent for real estate do?", a: "It answers buyer and seller calls instantly, qualifies the lead, answers listing questions, and books showings on your calendar. It works inbound and outbound, around the clock, so leads that arrive after hours still get a live response." },
          { q: "How many calls do real estate agents miss?", a: "Industry estimates put missed calls around 40 percent for busy agents, and a large share of leads arrive after business hours. Since speed to lead drives conversion, every unanswered call is a prospect likely calling the next agent on their list." },
          { q: "Can an AI agent qualify real estate leads?", a: "Yes. The agent asks about budget, timeline, financing, and the property of interest, then scores and routes the lead. Hot prospects can be warm-transferred to an agent immediately, while others are booked or added to follow-up, all logged to your CRM." },
          { q: "Does it work with my existing phone number and CRM?", a: "It should. A good platform connects to the carrier you already use, so your number stays put with no porting, and integrates with your CRM and calendar through tools and function calling. The agent updates records and books slots during the call." },
          { q: "Is an AI cold caller for real estate legal?", a: "Outbound AI calls are legal when you follow consent and disclosure rules. AI-generated voices count as artificial voices under the TCPA, so telemarketing calls need prior express written consent, and you must disclose at the start that the call uses AI." },
        ],
      },
    ],
  },

  {
    slug: "ai-receptionist-for-small-business",
    cover: "/blog/ai-receptionist-for-small-business/cover.jpg",
    title: "AI receptionist for small business: how it works",
    excerpt:
      "An AI receptionist for small business answers every call 24/7, books appointments, and qualifies leads. See how it works, what it costs, and where it fits.",
    category: "Guide",
    date: "2026-06-16",
    readingMinutes: 8,
    author: "The Vozpar Team",
    content: [
            { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "Every missed call is a customer who called a competitor next. For a small business that cannot staff a front desk around the clock, that adds up fast. An AI receptionist for small business closes the gap: it answers instantly, day or night, handles the routine work, and hands off only what truly needs a person. Here is how it works, what it costs, and how to tell if it fits your shop.",
      },
      { type: "h2", text: "What an AI receptionist actually does" },
      { type: "image", src: "/blog/ai-receptionist-for-small-business/what-it-does.jpg", alt: "What an AI receptionist actually does" },
      {
        type: "p",
        text: "An AI receptionist is an automated front desk that picks up the phone and takes action. It is not a phone tree. It listens, understands intent, and responds in plain language. The core jobs are consistent across industries:",
      },
      {
        type: "cards",
        items: [
          { title: "Answers every call", body: "Greets the caller instantly and never sends them to voicemail, even at peak or after close." },
          { title: "Books appointments", body: "Checks the calendar, confirms a slot, and reschedules, which cuts no-shows." },
          { title: "Answers FAQs", body: "Hours, location, pricing, and policy questions answered from your own knowledge base." },
          { title: "Captures and routes", body: "Logs caller details, qualifies the lead, and warm-transfers anything that needs a human." },
        ],
      },
      {
        type: "p",
        text: "The difference from old auto-attendants is judgment. The agent decides what the caller needs, then does it, rather than reading a menu and hoping someone presses the right number.",
      },
      {
        type: "p",
        text: "That judgment shows up in small ways callers notice. A real receptionist does not make a frustrated customer repeat their phone number three times, and a good AI agent does not either. It remembers what was said earlier in the call, handles a caller who interrupts halfway through a sentence, and switches language when it hears one. It can pull an answer from your actual hours and policies instead of guessing, and when a question lands outside its scope, it says so plainly and routes the caller to a person rather than looping. The goal is not to trick anyone into thinking they reached a human. It is to give every caller a fast, competent answer at any hour, which is exactly what most people wanted from your front desk in the first place.",
      },
      { type: "h2", text: "Why missed calls cost small businesses real money" },
      { type: "image", src: "/blog/ai-receptionist-for-small-business/missed-calls.jpg", alt: "Why missed calls cost small businesses real money" },
      {
        type: "p",
        text: "The case for an AI receptionist is mostly arithmetic. A human answers one call at a time, takes lunch, and goes home. Calls that arrive during those gaps go unanswered, and a large share of callers will not leave a message. They simply dial the next listing.",
      },
      {
        type: "callout",
        html: "An AI receptionist answers several calls at once, never sleeps, and carries no salary, benefits, or training overhead. The first benefit is not personality, it is coverage: the calls you were already losing now get picked up.",
      },
      {
        type: "p",
        text: "For appointment-driven businesses, that coverage maps straight to revenue. A booked slot from a 9 pm caller is income you would not have captured. Multiply by a month of after-hours and overflow calls and the line item becomes hard to ignore.",
      },
      {
        type: "p",
        text: "Consider the shape of a typical week. Calls cluster at lunch, when your one front-desk person is eating, and after five, when the office is closed. Those are precisely the windows a single human cannot cover, and they are when a large share of callers reach voicemail and hang up. Industry estimates of missed inbound calls for busy small offices often sit between twenty and forty percent. Even at the low end, on a hundred calls a week that is twenty conversations lost, and a portion of those were ready to book, buy, or return. An AI receptionist does not get you a better salesperson; it simply stops the leak. For most owners, recovering even half of those missed calls pays for the service many times over, before you count the staff hours freed up for higher-value work.",
      },
      { type: "h2", text: "How it works behind the scenes" },
      { type: "image", src: "/blog/ai-receptionist-for-small-business/how-it-works.jpg", alt: "How it works behind the scenes" },
      {
        type: "p",
        text: "You do not need to host models or wire up infrastructure. Setup follows three plain steps, and the first agent can be live the same day.",
      },
            {
        type: "p",
        text: "First you design the agent: choose a voice, describe its job in plain English, and set guardrails. Then you connect your knowledge so it answers from your real hours, services, and policies rather than a generic script. Finally you route your phone number through the platform and go live. Because Vozpar connects to the carrier you already use, your numbers and billing can stay exactly where they are with no porting and no downtime, or you can provision a dedicated number from the platform if you would rather.",
      },
      {
        type: "p",
        text: "Two design choices keep the agent from feeling generic. The first is grounding it in your own source of truth, so it cites your real policies and prices instead of inventing plausible-sounding answers. The second is the guardrails: clear rules about what it must never promise, when it should escalate, and how it should speak. A few hours spent writing those rules well is the difference between an agent that protects your reputation and one that improvises. Start with your most common ten or fifteen call reasons, script those tightly, and let the agent route everything else to a person while you expand its coverage over the first couple of weeks.",
      },
      { type: "h2", text: "What it costs and how to choose" },
      { type: "image", src: "/blog/ai-receptionist-for-small-business/cost.jpg", alt: "What it costs and how to choose" },
      {
        type: "p",
        text: "An AI receptionist is usually billed per minute, not per salary, which flips the economics for a small business. Self-serve voice rates commonly sit around $0.10 to $0.15 per minute. A shop handling a few thousand answered minutes a month typically spends a fraction of a part-time hire, with no benefits, sick days, or training time.",
      },
      {
        type: "table",
        head: ["Factor", "What to check"],
        rows: [
          ["Latency", "Sub-second response so the call feels natural, not robotic"],
          ["Interruptions", "Can the caller talk over the agent and be understood"],
          ["Integrations", "Calendar, CRM, and your knowledge base, connected natively"],
          ["Handoff", "Clean warm-transfer to a human with full context"],
          ["Billing", "Clear per-minute rate, no contract, numbers billed by your carrier"],
        ],
      },
      {
        type: "p",
        text: "Score vendors on those five and the choice gets simple. It is also fair to trial two and compare how each handles your trickiest real calls before you commit.",
      },
      {
        type: "p",
        text: "When you run that trial, test the edges, not the happy path. Call in with background noise, talk over the agent mid-sentence, ask a question that is not in the script, and request a transfer to a human. How the agent handles those moments tells you far more than a clean demo ever will. Check that it books a real slot on your live calendar, that the details land in your CRM correctly, and that the handoff carries context so your staff are not starting from scratch. A receptionist that answers fast but fumbles the booking or loses the notes creates work instead of removing it. The ones worth keeping feel less like a robot reading a flowchart and more like a calm, well-trained team member who never clocks out.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "An AI receptionist for small business earns its place by answering the calls you were already losing, then booking, qualifying, and routing them without adding headcount. Start with coverage as the goal, connect it to your real knowledge and calendar, and keep a clean handoff to your team for the calls that need a human touch.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "What is an AI receptionist for small business?", a: "It is an automated phone agent that answers calls, greets callers, books appointments, answers common questions, and captures details around the clock. It understands natural speech and takes action instead of routing callers through menu trees." },
          { q: "How much does an AI receptionist cost?", a: "Most AI receptionists bill per minute rather than per salary. Self-serve voice rates commonly run $0.10 to $0.15 per minute, so a small business handling a few thousand minutes a month often spends far less than a part-time human, with no benefits or training cost." },
          { q: "Can an AI receptionist book appointments?", a: "Yes. A capable AI receptionist connects to your calendar, checks availability, books, reschedules, and sends confirmations during the call. Native Google, Outlook, and Calendly integrations let it confirm a slot before the caller hangs up, which reduces no-shows." },
          { q: "Will callers know they are talking to an AI?", a: "Modern audio-native agents pause, handle interruptions, and respond in real time, so many callers do not notice at first. For outbound and many regulated calls you should disclose that the call uses AI, which keeps you compliant and builds trust." },
          { q: "Does an AI receptionist replace my staff?", a: "It replaces the routine load, not your team. The AI handles repeat questions, after-hours calls, and overflow, then warm-transfers anything that needs a human. Staff spend their time on the conversations that actually need judgment and care." },
        ],
      },
    ],
  },

  {
    slug: "tcpa-compliance-ai-outbound-calling",
    cover: "/blog/tcpa-compliance-ai-outbound-calling/cover.jpg",
    title: "TCPA compliance for AI outbound calling: a 2026 playbook",
    excerpt:
      "TCPA compliance for AI outbound calling in 2026: consent rules, the AI disclosure requirement, DNC and calling windows, plus a practical checklist for teams.",
    category: "Compliance",
    date: "2026-06-16",
    readingMinutes: 10,
    author: "The Vozpar Team",
    content: [
            { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "AI can dial, qualify, and follow up at a scale no human team can match, which is exactly why regulators are watching. TCPA class actions rose sharply in 2025, and AI voices are now squarely inside the rules. This playbook lays out what TCPA compliance for AI outbound calling looks like in 2026: who the rules cover, the consent and disclosure standards, and a checklist you can hand to your team. One caveat up front: this is general information, not legal advice, so validate your program with counsel.",
      },
      { type: "h2", text: "AI voices are covered by the TCPA" },
      { type: "image", src: "/blog/tcpa-compliance-ai-outbound-calling/covered.jpg", alt: "AI voices are covered by the TCPA" },
      {
        type: "p",
        text: "The starting point is settled. The FCC has confirmed that AI-generated and AI-cloned voices count as artificial voices for TCPA purposes. That single ruling pulls AI outbound calling under the same framework that governs prerecorded and artificial-voice campaigns. If your agent speaks in a synthetic voice and dials consumers, you are operating inside the TCPA, full stop.",
      },
      {
        type: "callout",
        variant: "warn",
        html: "<strong>Why it matters:</strong> recent AI-calling class actions have settled in the range of roughly $5 million to $20 million, and filings jumped close to double year over year. The downside of getting this wrong is not a warning letter, it is litigation.",
      },
      {
        type: "p",
        text: "It is worth being precise about why AI raises the stakes rather than lowering them. The TCPA was written around prerecorded and artificial-voice calls and autodialers, and a synthetic agent is squarely an artificial voice. Statutory damages run per call, commonly cited at $500 and up to $1,500 for willful violations, and because an AI system can place thousands of calls a day, a small configuration mistake multiplies fast. A human team that dials the wrong list makes a few dozen bad calls before someone notices. An automated campaign can make tens of thousands before the morning is over. Scale is the feature you are buying, and it is also the reason compliance has to be built in from the start rather than bolted on after the first complaint.",
      },
      { type: "h2", text: "Consent and the AI disclosure rule" },
      { type: "image", src: "/blog/tcpa-compliance-ai-outbound-calling/consent.jpg", alt: "Consent and the AI disclosure rule" },
      {
        type: "p",
        text: "Consent is the spine of compliance, and the standard depends on what kind of call you place.",
      },
      {
        type: "table",
        head: ["Call type", "Consent standard"],
        rows: [
          ["AI-voice telemarketing", "Prior express written consent for mobile and residential lines"],
          ["Informational, non-marketing", "Prior express consent, which can be oral (reminders, account notices)"],
          ["Purchased lead lists", "High risk: verify a specific consent basis before dialing"],
        ],
      },
      {
        type: "p",
        text: "Two shifts deserve attention. First, the old practice of shared consent through lead generators, where one form let many businesses call, has been eliminated, so consent must now be specific to your business. Second, when in doubt, default to written consent. The cost of collecting it is trivial next to the cost of defending a call you should not have made.",
      },
      {
        type: "p",
        text: "Good consent is also documented consent. It is not enough to believe you had permission; you need to be able to show when it was given, how, and for what. That means capturing the language the person agreed to, a timestamp, and the source, then storing it somewhere you can retrieve on demand. Treat purchased lists with bundled or vague consent as a liability rather than an asset, because in a dispute the burden of proving consent falls on the caller, not the recipient. The safest programs collect their own consent through their own forms and keep the record attached to the number, so that if a call is ever challenged, the proof is one lookup away instead of a frantic search through a vendor's data.",
      },
      { type: "h3", text: "Disclose the AI at the start of every call" },
      {
        type: "p",
        text: "Beyond consent, there is a disclosure duty. The FCC requires businesses using AI agents for outbound calls to disclose, at the beginning of the call, that the call is from an automated system or uses artificial intelligence. This is not a footnote you bury later in the script. It belongs in the opening line, before the pitch.",
      },
      {
        type: "p",
        text: "The practical version is simple: write the disclosure into the first sentence of every outbound agent and test that it fires on every call. A clear opener also builds trust, and trust tends to lift answer and completion rates rather than hurt them.",
      },
      { type: "h2", text: "Calling windows, do-not-call, and revocation" },
      { type: "image", src: "/blog/tcpa-compliance-ai-outbound-calling/windows.jpg", alt: "Calling windows, do-not-call, and revocation" },
      {
        type: "p",
        text: "Consent and disclosure get you in the door. Operational hygiene keeps you there.",
      },
      {
        type: "cards",
        items: [
          { title: "Calling windows", body: "Stay within local hours, commonly 8am to 9pm in the recipient's time zone." },
          { title: "DNC scrubbing", body: "Honor the National do-not-call registry and your own internal suppression list." },
          { title: "Instant revocation", body: "When someone opts out, log it immediately and stop calling that number." },
          { title: "Records and logs", body: "Keep consent proof, transcripts, and opt-out timestamps you can produce on demand." },
        ],
      },
      {
        type: "p",
        text: "This is where platform features earn their keep. Live transcripts with intent and event capture, configurable PII redaction, encrypted storage, and SOC 2-aligned infrastructure give you the audit trail and data controls that compliance reviews ask for. Vozpar builds those controls in, which makes documenting consent, disclosures, and opt-outs far less manual. The tooling does not replace counsel, but it makes a defensible program practical to run.",
      },
      {
        type: "p",
        text: "State law adds a layer on top of the federal rules, and it is where many programs trip. A number of states maintain their own do-not-call lists, mini-TCPA statutes, and tighter calling windows or consent standards than the federal baseline, and a few are notably aggressive about enforcement. Because your callers may sit in any state, the practical move is to design to the strictest rule you are likely to touch rather than the loosest, and to scrub against state registries alongside the national one. Revocation deserves the same rigor: when someone says stop, in any words, the system should capture it, suppress the number immediately, and never let a later campaign quietly call it again. Honoring an opt-out a day late is still a violation, so the safe default is to make it instant and irreversible.",
      },
      { type: "h2", text: "Your pre-launch compliance checklist" },
      { type: "image", src: "/blog/tcpa-compliance-ai-outbound-calling/checklist.jpg", alt: "Your pre-launch compliance checklist" },
      {
        type: "p",
        text: "Before a single outbound campaign goes live, walk this list:",
      },
      {
        type: "callout",
        html: "<strong>1.</strong> Confirm written consent for any telemarketing list, specific to your business. <strong>2.</strong> Put the AI disclosure in the first line of every script. <strong>3.</strong> Scrub against National and internal DNC lists. <strong>4.</strong> Enforce local calling windows. <strong>5.</strong> Wire opt-out capture to stop calls in real time. <strong>6.</strong> Retain consent proof, transcripts, and timestamps. <strong>7.</strong> Have counsel review the program and your state-law exposure.",
      },
      {
        type: "p",
        text: "Run this list before the first campaign, then revisit it on a schedule rather than treating it as a one-time gate. Rules shift, registries update, and a script that was compliant in January can drift out of bounds by summer as someone edits the opening line or adds a new list. A short monthly review, who changed what, which lists were scrubbed, how many opt-outs were honored and how fast, keeps small mistakes from compounding into a class action. Compliance is not a launch checkbox; it is an operating habit.",
      },
      { type: "h2", text: "Conclusion" },
      {
        type: "p",
        text: "TCPA compliance for AI outbound calling is not a barrier to using voice agents, it is the price of using them well. AI voices are covered, consent must be express and specific, disclosure belongs at the top of the call, and your operations need clean DNC, calling windows, and records. Build those into the program from day one, lean on tooling that captures the audit trail, and confirm the details with a lawyer before you dial.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "Does the TCPA apply to AI voice calls?", a: "Yes. The FCC has confirmed that AI-generated and AI-cloned voices are artificial voices under the TCPA. That means AI outbound calls fall under the same consent, disclosure, and do-not-call rules that govern prerecorded and artificial-voice calls." },
          { q: "What consent do I need for AI outbound telemarketing?", a: "For AI-voice telemarketing to mobile or residential lines, the standard is prior express written consent. For purely informational, non-marketing calls such as appointment reminders or account notices, prior express consent applies, which can be oral. When unsure, get written consent." },
          { q: "Do I have to tell people the call uses AI?", a: "Yes. The FCC requires businesses using AI agents for outbound calls to disclose at the start of the call that it is from an automated system or uses artificial intelligence. Build that disclosure into the opening line of every outbound script." },
          { q: "What changed with the one-to-one consent rule?", a: "The practice of shared consent through lead generators, where one form authorized many businesses to call, has been eliminated. Consent now needs to be specific to your business. Treat purchased lists with bundled consent as high risk and verify the basis before calling." },
          { q: "What are the calling-window and DNC rules?", a: "Calls should run within local calling windows, commonly 8am to 9pm in the recipient's time zone, and you must honor the National and any internal do-not-call lists. Scrub your lists, log opt-outs immediately, and stop calling numbers that revoke consent." },
        ],
      },
    ],
  },

  {
    slug: "ai-voice-agent-for-dental-clinics",
    cover: "/blog/ai-voice-agent-for-dental-clinics/cover.jpg",
    title: "AI voice agent for dental & medical clinics: 0 missed calls & 40% fewer no-shows",
    excerpt:
      "Dental front desks miss over 30% of incoming patient calls during peak hours. Discover how AI voice agents automate scheduling, triage emergencies, and eliminate no-shows 24/7.",
    category: "Healthcare",
    date: "2026-07-20",
    readingMinutes: 8,
    author: "The Vozpar Team",
    content: [
      { type: "h2", text: "Introduction" },
      { type: "image", src: "/blog/ai-voice-agent-for-dental-clinics/cover.jpg", alt: "AI Voice Agent for Dental & Medical Clinics Workflow" },
      {
        type: "p",
        text: "In dental and medical practices, the front desk is simultaneously checking in patients, processing insurance, taking payments, and answering ringing phones. When morning rushes hit, incoming calls go straight to voicemail. Studies show that over 65% of patients seeking a new dentist will hang up and call another practice if they hit a voicemail box. An AI voice agent acts as an automated, 24/7 clinical receptionist that answers every call on the first ring, books appointments directly into your EHR/PMS system, and confirms patient visits.",
      },
      { type: "h2", text: "The true cost of missed patient calls" },
      {
        type: "table",
        head: ["Metric", "Traditional Front Desk", "Vozpar AI Receptionist"],
        rows: [
          ["Answer rate", "65% - 75% during peak hours", "100% on 1st ring, 24/7/365"],
          ["Appointment no-shows", "15% - 25% average", "Reduced by 40% with automated calls"],
          ["After-hours inquiries", "Voicemail (80% drop-off)", "Instant booking & emergency triage"],
          ["Average handling cost", "$4.50 - $7.00 per call", "$0.10 - $0.15 per minute"],
        ],
      },
      {
        type: "h2",
        text: "Key features of a medical AI voice receptionist",
      },
      { type: "image", src: "/blog/ai-voice-agent-for-dental-clinics/features.jpg", alt: "Key features of a medical AI voice receptionist" },
      {
        type: "cards",
        items: [
          { title: "Smart PMS Integration", body: "Direct bidirectional sync with Dentrix, OpenDental, and Eaglesoft for live calendar booking." },
          { title: "After-Hours Emergency Triage", body: "Identifies urgent cases (severe pain, swelling, trauma) and warm-transfers to on-call doctors instantly." },
          { title: "Pre-Op & Recall Reminders", body: "Automates outbound confirmation calls and pre-procedure fasting instructions." },
          { title: "Multilingual Support", body: "Seamlessly switches between English, Spanish, and French to serve diverse patient demographics." },
        ],
      },
      { type: "h2", text: "HIPAA & Patient Privacy Compliance" },
      {
        type: "p",
        text: "Healthcare voice AI must adhere to strict security boundaries. Vozpar encrypts audio in transit via TLS 1.3 and at rest with AES-256. No Protected Health Information (PHI) is retained in public training sets, and standard Business Associate Agreements (BAA) ensure full compliance for private practices and enterprise MSOs.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "Can the AI agent integrate with Dentrix or OpenDental?", a: "Yes. Vozpar connects via secure APIs to check real-time chair availability, book new appointments, and update patient chart notes without manual data entry." },
          { q: "How does the AI handle patient emergencies?", a: "If a caller mentions severe pain, bleeding, or urgent trauma, the AI immediately initiates an emergency protocol and warm-transfers the call to the doctor on call." },
          { q: "Is the voice AI HIPAA compliant?", a: "Yes. Vozpar executes Business Associate Agreements (BAAs), uses end-to-end encryption for all call streams, and redacts sensitive PII automatically." },
        ],
      },
    ],
  },

  {
    slug: "sub-300ms-voice-ai-latency-guide",
    cover: "/blog/speech-to-speech-vs-cascaded-voice-ai/latency.jpg",
    title: "Why sub-300ms latency is mandatory for conversational AI voice agents",
    excerpt:
      "Human conversation relies on a 200ms turn-taking baseline. Learn how streaming WebRTC, neural audio engines, and full-duplex barge-in eliminate robotic delays.",
    category: "Engineering",
    date: "2026-07-24",
    readingMinutes: 9,
    author: "The Vozpar Team",
    content: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "In human speech dynamics, turn-taking happens in approximately 200 milliseconds. When an AI voice agent takes 1,000ms or more to respond, the human brain instantly registers the delay as an uncomfortable pause, leading callers to talk over the agent or doubt its comprehension. Achieving sub-300ms end-to-end latency is the single most critical engineering benchmark for realistic voice AI.",
      },
      { type: "h2", text: "The anatomy of latency: Where milliseconds vanish" },
      {
        type: "table",
        head: ["Pipeline Stage", "Legacy HTTP Stack", "Vozpar Audio-Native Engine"],
        rows: [
          ["Audio Transport", "REST HTTP Post (150ms)", "WebRTC / SIP UDP Streaming (20ms)"],
          ["Speech Recognition (STT)", "Whisper Batch (350ms)", "Streaming Neural ASR (60ms)"],
          ["Reasoning & Synthesis", "Sequential LLM -> TTS (500ms)", "Speech-to-Speech Native Transformer (110ms)"],
          ["Total Response Time", "1,000ms - 1,400ms", "190ms - 240ms"],
        ],
      },
      { type: "h2", text: "Full-Duplex & Natural Interruption (Barge-In)" },
      {
        type: "p",
        text: "Real conversations are fluid. Callers frequently cut in with 'Wait, actually...' or 'Hold on'. Legacy systems require completing the entire spoken output before listening again. Vozpar's full-duplex acoustic pipeline detects user voice activity within 30ms and immediately halts speech generation, allowing the agent to yield naturally.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "What is full-duplex barge-in?", a: "Full-duplex barge-in allows callers to interrupt the AI agent mid-sentence. The AI immediately stops speaking and listens, mimicking natural human conversation." },
          { q: "How does Vozpar achieve sub-300ms response times?", a: "By using ultra-low latency WebRTC streaming and direct speech-to-speech models, bypassing sequential text conversions." },
        ],
      },
    ],
  },

  {
    slug: "ai-voice-agent-for-financial-services",
    cover: "/blog/tcpa-compliance-ai-outbound-calling/cover.jpg",
    title: "AI voice agents for financial services: 24/7 lead intake & SOC-2 compliance",
    excerpt:
      "Mortgage brokers, wealth managers, and insurance agencies handle massive call volumes. See how AI voice agents qualify leads, collect loan details, and enforce strict financial compliance.",
    category: "Finance",
    date: "2026-07-25",
    readingMinutes: 9,
    author: "The Vozpar Team",
    content: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "In financial services—whether mortgage origination, wealth management, or insurance brokerage—speed to lead dictates customer acquisition cost. When a prospective borrower submits an inquiry for a mortgage rate quote, calling them back within 30 seconds yields an 8x higher conversion rate than calling back in 15 minutes. Vozpar AI voice agents handle instant inbound and outbound intake, gather preliminary financial parameters, and warm-transfer qualified clients to certified advisors.",
      },
      { type: "h2", text: "Key Workflows for Financial Voice AI" },
      {
        type: "cards",
        items: [
          { title: "Mortgage Pre-Qualification", body: "Gathers loan amount, credit tier, property value, and income status before assigning to a loan officer." },
          { title: "Policy & Claims Intake", body: "Captures first-notice-of-loss details 24/7, generating structured incident reports automatically." },
          { title: "Wealth Consultation Scheduling", body: "Qualifies net worth thresholds and books appointments directly onto advisor calendars." },
          { title: "Automated Payment Reminders", body: "Conducts compliant outbound reminders for overdue premium payments or loan installments." },
        ],
      },
      { type: "h2", text: "Security, Encryption & Financial Compliance" },
      {
        type: "p",
        text: "Financial deployments require bank-grade security protocols. Vozpar operates with SOC-2 Type II audit alignment, zero data retention for training, automated PII (Personally Identifiable Information) masking on transcripts, and TLS 1.3 encrypted voice streams.",
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "Is caller data encrypted?", a: "Yes. All voice streams use TLS 1.3 and media payloads are encrypted with AES-256 at rest." },
          { q: "Can the AI route high-net-worth leads to senior advisors?", a: "Yes. Conditional logic evaluates caller criteria in real time and transfers VIP leads to dedicated phone lines." },
        ],
      },
    ],
  },

  {
    slug: "ai-voice-agent-for-home-services-contractors",
    cover: "/blog/ai-receptionist-for-small-business/cover.jpg",
    title: "AI voice agent for HVAC, plumbing & electrical: Never miss an emergency job",
    excerpt:
      "When a homeowner's furnace breaks at 10 PM, they call until someone picks up. Discover how AI voice agents dispatch emergency crews and capture high-margin jobs 24/7.",
    category: "Home Services",
    date: "2026-07-25",
    readingMinutes: 8,
    author: "The Vozpar Team",
    content: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "For HVAC contractors, plumbers, roofers, and electricians, missed calls are lost revenue. Homeowners facing a burst pipe or broken air conditioner in the middle of summer will not leave a voicemail; they dial the next contractor on Google. A Vozpar AI voice agent acts as an emergency dispatcher that answers on the first ring, collects job location and service type, and routes emergency calls directly to on-call technicians.",
      },
      { type: "h2", text: "Comparing Dispatch Options" },
      {
        type: "table",
        head: ["Metric", "Traditional Answering Service", "Vozpar AI Voice Dispatch"],
        rows: [
          ["Cost per month", "$800 - $2,500/mo + per call fees", "$0.10 - $0.15 / min (Usage based)"],
          ["Errors & missed details", "Common (misspelled addresses)", "0 Errors (Structured CRM logging)"],
          ["Dispatch Speed", "5 - 15 minutes manual relay", "Instant SMS & call dispatch"],
          ["Capacity", "1 call at a time per agent", "Unlimited concurrent calls"],
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "Can the AI integrate with ServiceTitan or Housecall Pro?", a: "Yes. Vozpar posts job addresses, customer notes, and booked times directly to ServiceTitan, Housecall Pro, and Jobber." },
          { q: "How does emergency dispatch work?", a: "If a caller reports an urgent issue (water leak, gas smell, no heat), the AI triggers an immediate SMS alert and phone call to your technician." },
        ],
      },
    ],
  },

  {
    slug: "voice-ai-crm-integration-playbook",
    cover: "/blog/ai-voice-agent-pricing-per-minute/cover.jpg",
    title: "Integrating AI voice agents with Salesforce, HubSpot, and GoHighLevel",
    excerpt:
      "Learn how real-time webhooks, custom function calling, and automated transcript parsing push call data directly into your CRM within milliseconds.",
    category: "Integrations",
    date: "2026-07-25",
    readingMinutes: 10,
    author: "The Vozpar Team",
    content: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "An AI voice agent is only as powerful as the ecosystem it connects to. When an agent finishes a call, valuable customer data—intent, sentiment, qualified answers, and requested follow-ups—must flow seamlessly into your primary CRM. This technical playbook outlines how to connect Vozpar's voice engine to Salesforce, HubSpot, and GoHighLevel using webhooks and OpenAPI tool schemas.",
      },
      { type: "h2", text: "The Architectural Flow" },
      {
        type: "cards",
        items: [
          { title: "1. Real-Time Function Calling", body: "During the call, the AI executes tool calls to lookup customer account data or check calendar slots." },
          { title: "2. Post-Call Webhook Dispatch", body: "Upon call completion, a JSON payload containing audio recording URLs, sentiment score, and full transcript is sent." },
          { title: "3. Automated CRM Mapping", body: "Field mapping automatically creates leads, updates deals, and assigns follow-up tasks to human sales reps." },
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          { q: "Can the voice agent query my CRM during a live call?", a: "Yes. Using OpenAPI function definitions, the agent fetches customer balance, account status, or appointment history in under 150ms." },
          { q: "Which CRMs are supported out of the box?", a: "Salesforce, HubSpot, GoHighLevel, Zoho, Pipedrive, and custom REST API endpoints." },
        ],
      },
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  return `${d} ${months[m - 1]} ${y}`
}
