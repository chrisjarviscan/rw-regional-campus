/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  presenter_name?: string
  company_name?: string
}

const Email = ({ presenter_name, company_name }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Realized Worth business case is ready</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>
          {presenter_name ? `Your deck is on its way, ${presenter_name}.` : 'Your deck is on its way.'}
        </Heading>
        <Text style={text}>
          Thanks for using the Realized Worth business case builder
          {company_name ? ` for ${company_name}` : ''}. Your tailored deck —
          both PowerPoint and interactive HTML — should already be downloading
          in your browser.
        </Text>
        <Text style={text}>
          A copy of your inputs has been sent to the RW team so we can follow
          up if helpful. If you'd like a hand tightening the pitch before you
          present, just reply to this email and Nichole will jump in.
        </Text>
        <Text style={signoff}>
          — Nichole Giller<br />
          <span style={muted}>Realized Worth</span>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Realized Worth business case is ready',
  displayName: 'Business case — submitter confirmation',
  previewData: { presenter_name: 'Sam Patel', company_name: 'Acme Corp' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { backgroundColor: '#EC5C2A', height: '4px', width: '48px', margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#0A3454', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const signoff = { fontSize: '15px', color: '#0A3454', margin: '32px 0 0', lineHeight: '1.5' }
const muted = { color: '#6b7280', fontSize: '13px' }
