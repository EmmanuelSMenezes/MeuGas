'use client'

import { FaApple, FaGooglePlay, FaMobileAlt } from 'react-icons/fa'

export default function AppDownload() {
  return (
    <section id="download" className="section-container bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <FaMobileAlt />
                <span>Baixe Agora</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Baixe o app e peça seu gás agora!
              </h2>

              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Disponível gratuitamente para Android e iOS. Comece a economizar
                hoje mesmo!
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <FaGooglePlay className="text-3xl text-primary" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Disponível no</div>
                    <div className="font-bold text-lg">Google Play</div>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <FaApple className="text-3xl text-primary" />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Baixar na</div>
                    <div className="font-bold text-lg">App Store</div>
                  </div>
                </a>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-white/80">Grátis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">4.8★</div>
                  <div className="text-sm text-white/80">Avaliação</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-white/80">Downloads</div>
                </div>
              </div>
            </div>

            {/* Right Content - App Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                {/* Placeholder for phone mockup */}
                <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl flex items-center justify-center border-8 border-gray-700">
                  <div className="text-white text-center p-8">
                    <FaMobileAlt className="text-8xl mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-bold">App Screenshot</p>
                    <p className="text-sm opacity-50 mt-2">
                      Substitua por imagem real do app
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 -right-10 w-32 h-32 bg-secondary-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute bottom-10 -left-10 w-32 h-32 bg-white rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>

        {/* QR Code Section (Optional) */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Ou escaneie o QR Code para baixar
          </p>
          <div className="inline-block bg-white p-6 rounded-2xl shadow-lg">
            <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">QR Code</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

