'use client'

import { FaChartLine, FaDollarSign, FaRocket, FaStore } from 'react-icons/fa'

const features = [
  {
    icon: FaChartLine,
    title: 'Painel completo',
    description: 'Gerencie pedidos, estoque e entregas em um só lugar',
  },
  {
    icon: FaDollarSign,
    title: 'Preços flexíveis',
    description: 'Você define seus preços e promoções',
  },
  {
    icon: FaRocket,
    title: 'Mais pedidos',
    description: 'Alcance novos clientes na sua região',
  },
]

export default function ForPartners() {
  return (
    <section id="parceiros" className="section-container bg-gradient-to-br from-secondary-50 to-secondary-100">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-secondary-200 text-secondary-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <FaStore />
            <span>Para Distribuidoras</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tem uma distribuidora de gás?{' '}
            <span className="text-secondary">Ganhe mais</span> com o MeuGas.
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Aumente suas vendas, gerencie entregas e conquiste novos clientes
            com nossa plataforma completa.
          </p>

          {/* Features List */}
          <div className="space-y-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center">
                      <Icon className="text-secondary text-xl" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="http://parceiro.meugas.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex"
            >
              Acessar Portal do Parceiro
            </a>
            <a
              href="mailto:parceiros@meugas.app"
              className="btn-outline inline-flex"
            >
              Falar com Especialista
            </a>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="relative animate-slide-up">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Dashboard Parceiro
              </h3>
              <div className="bg-success-light text-success px-3 py-1 rounded-full text-sm font-semibold">
                Ativo
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Pedidos Hoje</div>
                <div className="text-3xl font-bold text-primary">24</div>
                <div className="text-xs text-success mt-1">↑ 12% vs ontem</div>
              </div>
              <div className="bg-secondary-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Faturamento</div>
                <div className="text-3xl font-bold text-secondary">R$ 2.4k</div>
                <div className="text-xs text-success mt-1">↑ 8% vs ontem</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">
                Pedidos Recentes
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FaStore className="text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-gray-900">
                          Pedido #{1000 + i}
                        </div>
                        <div className="text-xs text-gray-500">
                          Há {i * 5} minutos
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">R$ 95,00</div>
                      <div className="text-xs text-warning">Em preparo</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 animate-bounce-slow">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Zero</div>
              <div className="text-sm text-gray-600">Burocracia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

