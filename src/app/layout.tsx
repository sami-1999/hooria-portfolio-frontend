import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hooria Zaman Khan - Video Editor | Portfolio',
  description: 'Professional video editor specializing in scroll-stopping reels, AI UGC ads, and cinematic storytelling that converts.',
  keywords: 'video editor, reels, tiktok, youtube, AI ads, UGC, video editing, portfolio',
  author: 'Hooria Zaman Khan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
