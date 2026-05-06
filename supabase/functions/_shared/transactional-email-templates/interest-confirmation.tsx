/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  full_name?: string
  campus?: string
}

const Email = ({ full_name, campus }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're on the 2026 Realized Worth list</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brandBar} />
        <Heading style={h1}>
          {full_name ? `Thanks, ${full_name}.` : 'Thanks for raising your hand.'}
        </Heading>
        <Text style={text}>
          You're on the list for the 2026 Realized Worth Regional Campus
          {campus ? ` — ${campus}` : ''}. We'll be in touch as soon as
          registration opens for the campus you chose.
        </Text>
        <Text style={text}>
          In the meantime, if a colleague should be on the list too, just
          reply to this note with their name and email.
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
  subject: 'You\'re on the 2026 Realized Worth list',
  displayName: 'Interest — submitter confirmation',
  previewData: { full_name: 'Jane Doe', campus: 'Detroit — August 2026' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }
const container = { padding: '32px 28px', maxWidth: '560px' }
const brandBar = { backgroundColor: '#EC5C2A', height: '4px', width: '48px', margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: '700', color: '#0A3454', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#333333', lineHeight: '1.6', margin: '0 0 16px' }
const signoff = { fontSize: '15px', color: '#0A3454', margin: '32px 0 0', lineHeight: '1.5' }
const muted = { color: '#6b7280', fontSize: '13px' }
