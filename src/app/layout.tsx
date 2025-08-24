import './globals.css'
import { Poppins } from 'next/font/google'
import Header from '@/components/Header'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '400', '600', '800'], // Example weights, adjust as neededs
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={poppins.className}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
