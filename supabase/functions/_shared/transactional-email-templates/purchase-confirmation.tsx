/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  full_name?: string
  pack?: string
  preferred_campus?: string
  payment_method?: string
}

const Email = ({ full_name, pack, preferred_campus, payment_method }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your {pack || 'pack'} purchase request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>
          {full_name ? `Thanks, ${full_name}.` : 'Thanks for your purchase request.'}
        </Heading>
        <Text style={text}>
          We received your request to purchase the {pack || 'pack'}
          {preferred_campus ? ` for ${preferred_campus}` : ''}.
          Nichole will follow up within one business day to confirm seats
          and walk you through {
            payment_method === 'credit_card' || payment_method === 'payment_link'
              ? 'credit card payment (note: 5% processing fee applies)'
              : payment_method === 'undecided'
                ? 'the payment options'
                : 'invoicing (Net 30)'
          }.
        </Text>
        <Text style={text}>
          If anything has changed since you submitted, just reply to this
          note and we'll update your request.
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
  subject: (d: Record<string, any>) => `Your ${d.pack || 'pack'} request — Realized Worth`,
  displayName: 'Purchase — submitter confirmation',
  previewData: { full_name: 'Jane Doe', pack: '6-Pack', preferred_campus: 'Detroit — August 2026', payment_method: 'invoice' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { backgroundColor: '#EC5C2A', height: '4px', width: '48px', margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#0A3454', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const signoff = { fontSize: '15px', color: '#0A3454', margin: '32px 0 0', lineHeight: '1.5' }
const muted = { color: '#6b7280', fontSize: '13px' }
