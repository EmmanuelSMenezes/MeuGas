'use client'

import { useState, useEffect } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import Image from 'next/image'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="MeuGas"
              width={140}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#como-funciona"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Como Funciona
            </a>
            <a
              href="#beneficios"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Benefícios
            </a>
            <a
              href="#parceiros"
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Para Parceiros
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="http://parceiro.meugas.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm"
            >
              Portal do Parceiro
            </a>
            <a
              href="#download"
              className="btn-primary text-sm"
            >
              Baixar App
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900 text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a
                href="#como-funciona"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a
                href="#beneficios"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Benefícios
              </a>
              <a
                href="#parceiros"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Para Parceiros
              </a>
              <div className="flex flex-col gap-3 mt-2">
                <a
                  href="http://parceiro.meugas.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-center"
                >
                  Portal do Parceiro
                </a>
                <a
                  href="#download"
                  className="btn-primary text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Baixar App
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

