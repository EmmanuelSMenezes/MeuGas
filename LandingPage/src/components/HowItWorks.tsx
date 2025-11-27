'use client'

import { FaShoppingCart, FaSearchDollar, FaTruck } from 'react-icons/fa'

const steps = [
  {
    icon: FaShoppingCart,
    title: 'Escolha o botijão',
    description: 'Selecione o tipo e tamanho do botijão que você precisa no app',
    color: 'primary',
  },
  {
    icon: FaSearchDollar,
    title: 'Compare preço e tempo',
    description: 'Veja ofertas de distribuidoras próximas e escolha a melhor opção',
    color: 'secondary',
  },
  {
    icon: FaTruck,
    title: 'Receba rápido e seguro',
    description: 'Acompanhe a entrega em tempo real e receba com segurança',
    color: 'primary',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-container bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Como funciona?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Peça seu botijão de gás em 3 passos simples
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isPrimary = step.color === 'primary'

          return (
            <div
              key={index}
              className="relative group animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300 -z-10"></div>
              )}

              <div className="card text-center border-2 border-transparent hover:border-secondary-200 relative">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary-500 to-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
                    isPrimary
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                      : 'bg-gradient-to-br from-secondary-400 to-secondary-600'
                  } shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="text-white text-3xl" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <a href="#download" className="btn-primary inline-flex">
          Começar Agora
        </a>
      </div>
    </section>
  )
}

