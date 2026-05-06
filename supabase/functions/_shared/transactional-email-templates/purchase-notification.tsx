/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Row, Column, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  full_name?: string
  email?: string
  company?: string
  role?: string
  pack?: string
  preferred_campus?: string
  payment_method?: string
  seats_notes?: string
  extra_notes?: string
}

const row = (label: string, value?: string) => (
  value ? (
    <Row style={{ marginBottom: '8px' }}>
      <Column style={{ width: '160px', verticalAlign: 'top' }}>
        <Text style={labelStyle}>{label}</Text>
      </Column>
      <Column>
        <Text style={valStyle}>{value}</Text>
      </Column>
    </Row>
  ) : null
)

const Email = (p: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Purchase request: {p.pack || 'pack'} — {p.company || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>New purchase request</Heading>
        <Section style={card}>
          {row('Pack', p.pack)}
          {row('Preferred campus', p.preferred_campus)}
          {row('Payment method', p.payment_method)}
          {row('Name', p.full_name)}
          {row('Email', p.email)}
          {row('Company', p.company)}
          {row('Role', p.role)}
        </Section>
        {p.seats_notes ? (
          <>
            <Hr style={hr} />
            <Text style={labelStyle}>Seats / split notes</Text>
            <Text style={quote}>{p.seats_notes}</Text>
          </>
        ) : null}
        {p.extra_notes ? (
          <>
            <Hr style={hr} />
            <Text style={labelStyle}>Other notes</Text>
            <Text style={quote}>{p.extra_notes}</Text>
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `Purchase request: ${d.pack || 'pack'} — ${d.company || '—'}`,
  displayName: 'Purchase — RW team notification',
  previewData: {
    full_name: 'Jane Doe', email: 'jane@acme.com', company: 'Acme Corp', role: 'CSR Director',
    pack: '6-Pack', preferred_campus: 'Detroit — August 2026', payment_method: 'invoice',
    seats_notes: 'Likely splitting 4 Detroit + 2 DC.', extra_notes: 'Need to align with FY26 budget cycle.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { backgroundColor: '#EC5C2A', height: '4px', width: '48px', margin: '0 0 24px' }
const h1 = { fontSize: '22px', fontWeight: '700', color: '#0A3454', margin: '0 0 20px' }
const card = { backgroundColor: '#f7f9fa', padding: '16px 18px', borderRadius: '6px' }
const labelStyle = { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0 0 2px', fontWeight: '600' }
const valStyle = { fontSize: '14px', color: '#0A3454', margin: '0' }
const quote = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0', padding: '12px 16px', borderLeft: '3px solid #B8D8DC', backgroundColor: '#fafbfc' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
