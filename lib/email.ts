import nodemailer from 'nodemailer'

type SendEmailInput = {
  to: string
  subject: string
  text: string
  html: string
  from?: string
  replyTo?: string
}

export function getSystemFromAddress() {
  return process.env.EMAIL_FROM ?? 'MatchMind <onboarding@resend.dev>'
}

export function getFounderFromAddress() {
  return process.env.EMAIL_FOUNDER_FROM ?? 'Mojeeb from MatchMind <onboarding@resend.dev>'
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  )
}

export async function sendEmail({ to, subject, text, html, from, replyTo }: SendEmailInput) {
  const sender = from ?? getSystemFromAddress()

  if (process.env.RESEND_API_KEY) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [to],
        subject,
        text,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Resend error: ${body}`)
    }
    return
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    })
    return
  }

  if (process.env.NODE_ENV === 'development') {
    console.info('[email:dev]', { from: sender, to, subject, text })
    return
  }

  throw new Error('Email is not configured')
}