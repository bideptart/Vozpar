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
    <p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:14px;margin-top:16px">${escapeHtml(message)}</p>
  `

  try {
    await transporter.sendMail({
      from: `"9278.ai Contact" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `[Contact] ${subject}`,
      text: lines.join("\n"),
      html,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact form: failed to send email.", err)
    return NextResponse.json(
      { ok: false, error: "We couldn't send your message right now. Please email support@9278.ai instead." },
      { status: 502 },
    )
  }
}
