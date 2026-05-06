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
  city?: string
  venue_capacity?: string
  booking_lead_time?: string
  champion_readiness?: string
  contribution_level?: string
  preferred_quarter?: string
  interest_reason?: string
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
    <Preview>New host application: {p.company || ''} — {p.city || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>New host application</Heading>
        <Section style={card}>
          {row('Name', p.full_name)}
          {row('Email', p.email)}
          {row('Company', p.company)}
          {row('City', p.city)}
          {row('Venue capacity', p.venue_capacity)}
          {row('Booking lead time', p.booking_lead_time)}
          {row('Champion readiness', p.champion_readiness)}
          {row('Contribution level', p.contribution_level)}
          {row('Preferred quarter', p.preferred_quarter)}
        </Section>
        {p.interest_reason ? (
          <>
            <Hr style={hr} />
            <Text style={labelStyle}>Why they want to host</Text>
            <Text style={quote}>{p.interest_reason}</Text>
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New host application: ${d.company || '—'} (${d.city || '—'})`,
  displayName: 'Host — RW team notification',
  previewData: {
    full_name: 'Jordan Lee', email: 'jordan@acme.com', company: 'Acme Corp',
    city: 'Detroit', venue_capacity: '50-75', booking_lead_time: '3-6 months',
    champion_readiness: 'Yes — already identified',
    contribution_level: 'Venue + lunch + champions',
    preferred_quarter: 'Q3 2026',
    interest_reason: 'We have an active ERG and a beautiful downtown space — this is a natural fit for us.',
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
