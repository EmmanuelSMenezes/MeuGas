import type { Metadata } from 'next'
import { Urbanist, Kumbh_Sans } from 'next/font/google'
import './globals.css'

const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  display: 'swap',
})

const kumbhSans = Kumbh_Sans({
  subsets: ['latin'],
  variable: '--font-kumbh-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MeuGas - Peça botijão de gás rápido, seguro e pelo melhor preço',
  description: 'O MeuGas conecta você ao fornecedor mais próximo, com entrega rápida e acompanhamento em tempo real. Baixe o app agora!',
  keywords: 'gás, botijão, delivery, entrega rápida, app de gás, meugas',
  authors: [{ name: 'MeuGas' }],
  openGraph: {
    title: 'MeuGas - Delivery de Gás Rápido e Seguro',
    description: 'Peça botijão de gás pelo app com entrega rastreada e melhor preço',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeuGas - Delivery de Gás',
    description: 'Peça botijão de gás rápido e seguro',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#FF6A00',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${kumbhSans.variable} ${urbanist.variable} font-body`}>{children}</body>
    </html>
  )
}

