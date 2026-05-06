/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as interestConfirmation } from './interest-confirmation.tsx'
import { template as interestNotification } from './interest-notification.tsx'
import { template as hostConfirmation } from './host-confirmation.tsx'
import { template as hostNotification } from './host-notification.tsx'
import { template as businessCaseConfirmation } from './business-case-confirmation.tsx'
import { template as businessCaseNotification } from './business-case-notification.tsx'
import { template as purchaseConfirmation } from './purchase-confirmation.tsx'
import { template as purchaseNotification } from './purchase-notification.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'interest-confirmation': interestConfirmation,
  'interest-notification': interestNotification,
  'host-confirmation': hostConfirmation,
  'host-notification': hostNotification,
  'business-case-confirmation': businessCaseConfirmation,
  'business-case-notification': businessCaseNotification,
  'purchase-confirmation': purchaseConfirmation,
  'purchase-notification': purchaseNotification,
}
