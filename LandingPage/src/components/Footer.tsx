'use client'

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="section-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <div className="mb-6">
              <Image
                src="/images/logo-white.png"
                alt="MeuGas"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Conectando você ao fornecedor de gás mais próximo, com entrega
              rápida e segura.
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors"
              >
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#como-funciona"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#beneficios"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Benefícios
                </a>
              </li>
              <li>
                <a
                  href="#parceiros"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Para Parceiros
                </a>
              </li>
              <li>
                <a
                  href="#download"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Baixar App
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/termos"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="/privacidade"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Política de Cookies
                </a>
              </li>
              <li>
                <a
                  href="http://parceiro.meugas.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Portal do Parceiro
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-primary mt-1 flex-shrink-0" />
                <a
                  href="mailto:contato@meugas.app"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  contato@meugas.app
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone className="text-primary mt-1 flex-shrink-0" />
                <a
                  href="tel:+5511999999999"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  São Paulo, SP
                  <br />
                  Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} MeuGas. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm text-center md:text-right">
              Feito com ❤️ para facilitar sua vida
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

