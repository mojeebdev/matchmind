import type { Metadata } from 'next'
import { LegalLayout, legalStyles } from '@/components/legal/LegalLayout'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How MatchMind collects, uses, and protects your data — accounts, agent history, email alerts, and third-party services.',
  alternates: {
    canonical: absoluteUrl('/privacy'),
  },
  openGraph: {
    url: absoluteUrl('/privacy'),
    title: 'Privacy Policy | MatchMind',
    description:
      'How MatchMind collects, uses, and protects your data — accounts, agent history, email alerts, and third-party services.',
  },
}

const { h2, p, ul } = legalStyles

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 7, 2026">
      <p style={p}>
        MatchMind (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is operated by BlindspotLab. This Privacy
        Policy explains how we handle information when you use MatchMind at{' '}
        <a href={absoluteUrl('/')} style={{ color: 'var(--gold)' }}>
          app.matchmind.xyz
        </a>{' '}
        and related subdomains (including agent.matchmind.xyz and auth.matchmind.xyz).
      </p>

      <h2 style={h2}>Information we collect</h2>
      <p style={p}>When you create an account or use MatchMind, we may collect:</p>
      <ul style={ul}>
        <li>Account details: email address, display name, and password (stored as a secure hash)</li>
        <li>Profile preferences: username, supported country, favorite player, and email alert settings</li>
        <li>Agent interactions: questions you ask while signed in and the responses returned to you</li>
        <li>Authentication data: session tokens and, if you choose Google sign-in, basic profile info from Google</li>
        <li>Technical data: browser type, device information, and usage logs typical of web applications</li>
      </ul>

      <h2 style={h2}>How we use your information</h2>
      <p style={p}>We use your information to:</p>
      <ul style={ul}>
        <li>Provide and personalize the MatchMind football intelligence agent</li>
        <li>Save your interaction history and fan profile context for signed-in users</li>
        <li>Send service emails you request or enable (welcome, password reset, founder welcome, match alerts)</li>
        <li>Operate, secure, and improve the product</li>
        <li>Comply with legal obligations and prevent abuse</li>
      </ul>

      <h2 style={h2}>Third-party services</h2>
      <p style={p}>MatchMind relies on trusted providers to operate:</p>
      <ul style={ul}>
        <li>
          <strong style={{ color: 'var(--ink-primary)' }}>Google</strong> — OAuth sign-in (optional) and Gemini AI
          responses
        </li>
        <li>
          <strong style={{ color: 'var(--ink-primary)' }}>MongoDB Atlas</strong> — account, profile, and interaction
          storage
        </li>
        <li>
          <strong style={{ color: 'var(--ink-primary)' }}>Resend</strong> — transactional email delivery
        </li>
        <li>
          <strong style={{ color: 'var(--ink-primary)' }}>Vercel</strong> — hosting and analytics
        </li>
      </ul>
      <p style={p}>
        These providers process data according to their own privacy policies. We share only what is necessary to
        deliver the service.
      </p>

      <h2 style={h2}>Cookies and sessions</h2>
      <p style={p}>
        We use essential cookies and similar technologies to keep you signed in across MatchMind subdomains. These
        are required for authentication and are not used for third-party advertising.
      </p>

      <h2 style={h2}>Data retention</h2>
      <p style={p}>
        We retain account and interaction data while your account is active. You may request deletion of your account
        and associated data by contacting us at the email below.
      </p>

      <h2 style={h2}>Your choices</h2>
      <ul style={ul}>
        <li>Update profile and email alert preferences in your account settings</li>
        <li>Opt out of non-essential email alerts in your profile</li>
        <li>Request access, correction, or deletion of your personal data by email</li>
      </ul>

      <h2 style={h2}>Children</h2>
      <p style={p}>
        MatchMind is not directed at children under 13, and we do not knowingly collect personal information from
        children under 13.
      </p>

      <h2 style={h2}>Changes</h2>
      <p style={p}>
        We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page
        will reflect the latest version.
      </p>
    </LegalLayout>
  )
}