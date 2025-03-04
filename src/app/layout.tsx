import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ClearStorage } from '@/components/clear-storage'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LifeFlow - 生活タスク統合マネージャー',
  description: '仕事と家庭のタスクを一元管理するアプリケーション'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning data-theme="light" className="light">
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className={inter.className}>
        <Providers>
          <ClearStorage />
          {children}
        </Providers>
      </body>
    </html>
  )
} 