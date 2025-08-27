import '@/styles/globals.scss'
import { Poppins } from 'next/font/google'
import Header from '@/components/Header'
import { AuthProvider } from '@/lib/auth-context'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '600', '800'], // Example weights, adjust as needed
  variable: '--font-poppins',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={poppins.className}>
      <body className={poppins.variable}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
