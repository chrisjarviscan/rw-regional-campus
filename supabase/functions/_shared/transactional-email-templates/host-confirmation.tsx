/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  full_name?: string
  city?: string
}

const Email = ({ full_name, city }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for your host application</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>
          {full_name ? `Thanks, ${full_name}.` : 'Thanks for stepping forward.'}
        </Heading>
        <Text style={text}>
          We received your application to host an Realized Worth Regional Campus
          {city ? ` in ${city}` : ''}. Nichole or someone from the team will
          reach out within a few business days to learn more and walk you
          through what hosting looks like.
        </Text>
        <Text style={text}>
          Questions in the meantime? Just reply to this email or write to{' '}
          campus@realizedworth.com.
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
  subject: 'We received your Realized Worth host application',
  displayName: 'Host — submitter confirmation',
  previewData: { full_name: 'Jordan Lee', city: 'Detroit' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { backgroundColor: '#EC5C2A', height: '4px', width: '48px', margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#0A3454', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const signoff = { fontSize: '15px', color: '#0A3454', margin: '32px 0 0', lineHeight: '1.5' }
const muted = { color: '#6b7280', fontSize: '13px' }
