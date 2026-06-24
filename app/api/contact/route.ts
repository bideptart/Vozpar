import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export const runtime = "nodejs"

type ContactBody = {
  name?: string
  email?: string
  mobile?: string
  company?: string
  subject?: string
  message?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(request: Request) {
  let body: ContactBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.trim()
  const mobile = body.mobile?.trim()
  const company = body.company?.trim() || "—"
  const subject = body.subject?.trim() || "New contact enquiry"
  const message = body.message?.trim()

  if (!name || !email || !mobile || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email, mobile, and message." },
      { status: 400 },
    )
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Please provide a valid email address." }, { status: 400 })
  }

  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT ?? 465)
  const secure = (process.env.SMTP_SECURE ?? "true") === "true"
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD
  const to = process.env.CONTACT_TO || user

  if (!host || !user || !pass) {
    console.error("Contact form: SMTP environment variables are not configured.")
    return NextResponse.json(
      { ok: false, error: "Email service is not configured. Please try again later." },
      { status: 500 },
    )
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Mobile: ${mobile}`,
    `Company: ${company}`,
    `Subject: ${subject}`,
    "",
    "User Query:",
    message,
  ]
  const html = `
    <h2>New contact enquiry — 9278.ai</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Mobile</strong></td><td>${escapeHtml(mobile)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${escapeHtml(company)}</td></tr>
      <tr><td><strong>Subject</strong></td><td>${escapeHtml(subject)}</td></tr>
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:14px;font-weight:600;margin:16px 0 4px">User Query:</p>
    <p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px;margin:0">${escapeHtml(message)}</p>
  `

  // Thank-you acknowledgement sent to the person who submitted the form.
  const firstName = name.split(/\s+/)[0] || name
  const ackText = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out to 9278.ai — we've received your message and a member of our team will get back to you, usually within one business day.",
    "",
    "For reference, here's a copy of what you sent:",
    "",
    `Subject: ${subject}`,
    message,
    "",
    "If it's urgent, just reply to this email or write to support@9278.ai.",
    "",
    "Warm regards,",
    "The 9278.ai Team",
  ].join("\n")
  const ackHtml = `
    <div style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#171717">
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thanks for reaching out to <strong>9278.ai</strong> — we&rsquo;ve received your message and a member of our team
      will get back to you, usually within one business day.</p>
      <p style="margin-top:20px;color:#525252">For reference, here&rsquo;s a copy of what you sent:</p>
      <div style="border:1px solid #e5e5e5;border-radius:8px;padding:12px 14px;margin:8px 0;background:#fafafa">
        <p style="margin:0 0 6px"><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</p>
      </div>
      <p style="color:#525252">If it&rsquo;s urgent, just reply to this email or write to
      <a href="mailto:support@9278.ai" style="color:#DC2626">support@9278.ai</a>.</p>
      <p style="margin-top:20px">Warm regards,<br/>The 9278.ai Team</p>
    </div>
  `

  try {
    // 1) Internal notification (required — its failure fails the request).
    await transporter.sendMail({
      from: `"9278.ai Contact" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact] ${subject}`,
      text: lines.join("\n"),
      html,
    })

    // 2) Thank-you to the submitter (best-effort — don't fail the request if it bounces).
    try {
      await transporter.sendMail({
        from: `"9278.ai" <${user}>`,
        to: `"${name}" <${email}>`,
        replyTo: "support@9278.ai",
        subject: "Thanks for contacting 9278.ai — we'll be in touch",
        text: ackText,
        html: ackHtml,
      })
    } catch (ackErr) {
      console.error("Contact form: acknowledgement email failed (notification still sent).", ackErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact form: failed to send email.", err)
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message right now. Please email support@9278.ai instead." },
      { status: 502 },
    )
  }
}
