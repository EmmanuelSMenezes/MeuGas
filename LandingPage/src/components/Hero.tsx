'use client'

import { FaApple, FaGooglePlay, FaFire } from 'react-icons/fa'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-secondary-50 pt-20">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow animation-delay-2000"></div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <FaFire className="text-primary-500" />
              <span>Delivery de Gás Rápido e Seguro</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Peça botijão de gás{' '}
              <span className="text-primary">rápido</span>,{' '}
              <span className="text-secondary">seguro</span> e pelo{' '}
              <span className="text-primary">melhor preço</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              O MeuGas conecta você ao fornecedor mais próximo, com entrega
              rápida e acompanhamento em tempo real.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <a
                href="#download"
                className="btn-primary flex items-center justify-center gap-3 text-lg"
              >
                <FaGooglePlay className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs opacity-90">Baixar no</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </a>
              <a
                href="#download"
                className="btn-primary flex items-center justify-center gap-3 text-lg"
              >
                <FaApple className="text-2xl" />
                <div className="text-left">
                  <div className="text-xs opacity-90">Baixar na</div>
                  <div className="font-bold">App Store</div>
                </div>
              </a>
            </div>

            {/* Secondary CTA */}
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <a
                href="http://parceiro.meugas.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Portal do Parceiro
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Entregas/mês</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600">Parceiros</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-primary">4.8★</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>

          {/* Right Content - App Mockup */}
          <div className="relative animate-slide-up hidden lg:block">
            <div className="relative z-10">
              {/* Placeholder for app mockup - replace with actual image */}
              <div className="relative w-full h-[600px] bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <FaFire className="text-8xl mx-auto mb-4 opacity-50" />
                  <p className="text-2xl font-bold">App Mockup</p>
                  <p className="text-sm opacity-75 mt-2">
                    Substitua por screenshot real do app
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="bg-success-light text-success p-3 rounded-lg">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    Entrega Confirmada
                  </div>
                  <div className="text-xs text-gray-500">Em 30 minutos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

