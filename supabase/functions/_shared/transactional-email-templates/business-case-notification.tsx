/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Row, Column, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  company_name?: string
  presenter_name?: string
  presenter_email?: string
  presenter_role?: string
  audience_role?: string
  decision_maker?: string
  preferred_city?: string
  preferred_quarter?: string
  seats_requested?: string
  headcount_bracket?: string
  has_champions?: string
  has_formal_training?: string
  selected_challenges?: string
  desired_outcomes?: string
  sponsor_name?: string
  budget_range?: string
  primary_ask?: string
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
    <Preview>New business case: {p.company_name || ''}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>New business case generated</Heading>
        <Section style={card}>
          {row('Company', p.company_name)}
          {row('Presenter', p.presenter_name)}
          {row('Email', p.presenter_email)}
          {row('Role', p.presenter_role)}
          {row('Audience', p.audience_role)}
          {row('Decision maker', p.decision_maker)}
          {row('Sponsor', p.sponsor_name)}
          {row('Preferred city', p.preferred_city)}
          {row('Preferred quarter', p.preferred_quarter)}
          {row('Seats requested', p.seats_requested)}
          {row('Headcount bracket', p.headcount_bracket)}
          {row('Has champions', p.has_champions)}
          {row('Existing training', p.has_formal_training)}
          {row('Budget range', p.budget_range)}
          {row('Primary ask', p.primary_ask)}
        </Section>
        {p.selected_challenges ? (
          <>
            <Hr style={hr} />
            <Text style={labelStyle}>Challenges</Text>
            <Text style={quote}>{p.selected_challenges}</Text>
          </>
        ) : null}
        {p.desired_outcomes ? (
          <>
            <Text style={labelStyle}>Desired outcomes</Text>
            <Text style={quote}>{p.desired_outcomes}</Text>
          </>
        ) : null}
        {p.extra_notes ? (
          <>
            <Text style={labelStyle}>Notes</Text>
            <Text style={quote}>{p.extra_notes}</Text>
          </>
        ) : null}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => `New business case: ${d.company_name || '—'}`,
  displayName: 'Business case — RW team notification',
  previewData: {
    company_name: 'Acme Corp', presenter_name: 'Sam Patel',
    presenter_email: 'sam@acme.com', presenter_role: 'Director, ESG',
    audience_role: 'CHRO', decision_maker: 'CHRO',
    preferred_city: 'Detroit', preferred_quarter: 'Q3 2026',
    seats_requested: '6', headcount_bracket: '5,000-15,000',
    has_champions: 'Yes', sponsor_name: 'Lisa Chen, CHRO',
    primary_ask: 'Approve 6-seat pack for 2026 Detroit campus',
    selected_challenges: 'Volunteering feels disconnected from skills development; ERG burnout',
    desired_outcomes: 'Stronger leadership pipeline; measurable employee engagement lift',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { backgroundColor: '#EC5C2A', height: '4px', width: '48px', margin: '0 0 24px' }
const h1 = { fontSize: '22px', fontWeight: '700', color: '#0A3454', margin: '0 0 20px' }
const card = { backgroundColor: '#f7f9fa', padding: '16px 18px', borderRadius: '6px' }
const labelStyle = { fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '8px 0 2px', fontWeight: '600' }
const valStyle = { fontSize: '14px', color: '#0A3454', margin: '0' }
const quote = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '0 0 12px', padding: '12px 16px', borderLeft: '3px solid #B8D8DC', backgroundColor: '#fafbfc' }
const hr = { borderColor: '#e5e7eb', margin: '20px 0' }
