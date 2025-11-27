'use client'

import {
  FaDollarSign,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaCreditCard,
  FaStar,
  FaClock,
} from 'react-icons/fa'

const benefits = [
  {
    icon: FaDollarSign,
    title: 'Economia e Transparência',
    description: 'Compare preços em tempo real e escolha a melhor oferta. Sem taxas escondidas.',
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Entrega Rastreada',
    description: 'Acompanhe seu pedido em tempo real, do pedido até a entrega na sua porta.',
  },
  {
    icon: FaCreditCard,
    title: 'Pagamento Seguro',
    description: 'Pague com cartão, PIX ou dinheiro. Seus dados estão sempre protegidos.',
  },
  {
    icon: FaShieldAlt,
    title: 'Parceiros Verificados',
    description: 'Todas as distribuidoras são verificadas e avaliadas pelos usuários.',
  },
  {
    icon: FaClock,
    title: 'Entrega Rápida',
    description: 'Receba seu botijão em até 1 hora. Agende ou peça para agora.',
  },
  {
    icon: FaStar,
    title: 'Avaliações Reais',
    description: 'Veja avaliações de outros clientes antes de escolher seu fornecedor.',
  },
]

export default function Benefits() {
  return (
    <section id="beneficios" className="section-container bg-gray-50">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Por que escolher o MeuGas?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Benefícios que fazem a diferença no seu dia a dia
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon

          return (
            <div
              key={index}
              className="card border-2 border-secondary-100 hover:border-secondary-300 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white text-2xl" />
                  </div>
                </div>

                <div className="flex-1">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-primary mb-2">100%</div>
          <div className="text-gray-600">Seguro</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-primary mb-2">24/7</div>
          <div className="text-gray-600">Suporte</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-primary mb-2">5000+</div>
          <div className="text-gray-600">Clientes</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
          <div className="text-gray-600">Avaliação</div>
        </div>
      </div>
    </section>
  )
}

