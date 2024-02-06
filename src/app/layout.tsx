import Providers from '@/components/Providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '@ory/elements/assets/normalize.css'
import 'open-color/open-color.css'
import '../styles/index.css'

// Ory Elements
// optional fontawesome icons
import '@ory/elements/assets/fa-brands.min.css'
import '@ory/elements/assets/fa-solid.min.css'
import '@ory/elements/assets/fontawesome.min.css'
// optional fonts
import '@ory/elements/assets/inter-font.css'
import '@ory/elements/assets/jetbrains-mono-font.css'
// required styles for Ory Elements
import '@ory/elements/style.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FreeBSD SSO UI',
  description: 'FreeBSD Single Sign-on',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
