'use client'

import { IntlProvider, ThemeProvider } from '@ory/elements'
import { ReactNode, Suspense } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ThemeProvider theme="light">
        <IntlProvider defaultLocale="en">{children}</IntlProvider>
      </ThemeProvider>
    </Suspense>
  )
}
