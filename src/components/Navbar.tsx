import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone, User, LogIn, LayoutDashboard, MoreVertical, Sliders, Home, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onNavigate: (section: string) => void;
  hasFavorites: boolean;
  onAdvertiseClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isAdmin, onAdminClick, onNavigate, hasFavorites, onAdvertiseClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', id: 'home' },
    { label: 'Imóveis', id: 'catalog' },
    ...(hasFavorites ? [{ label: 'Favoritos', id: 'favorites' }] : []),
    { label: 'Blog', id: 'blog' },
    { label: 'Simulador', id: 'simulator' },
    { label: 'Sobre Nós', id: 'about' },
    { label: 'Contactos', id: 'footer' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl py-4 shadow-xl shadow-blue-900/5' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group"
        >
          <Logo />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 relative">
          {/* Options Dropdown (Three Dots Menu as highlighted in screenshot) */}
          <div className="relative">
            <button 
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-3 bg-gray-100/90 text-gray-900 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center shadow-sm"
              id="options-menu-btn"
            >
              <MoreVertical size={24} />
            </button>
            
            <AnimatePresence>
              {showOptionsMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-[160]" 
                    onClick={() => setShowOptionsMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-[170]"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 px-2">Opções</p>
                    <div className="h-[1px] bg-gray-100 mb-3 w-full" />
                    <button
                      onClick={() => {
                        onAdminClick();
                        setShowOptionsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-gold rounded-xl transition-all text-left"
                    >
                      <Sliders size={18} className="text-gray-500" />
                      <span>Painel Administrador</span>
                    </button>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowOptionsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-gold rounded-xl transition-all text-left"
                    >
                      {theme === 'light' ? <Moon size={18} className="text-gray-500" /> : <Sun size={18} className="text-gray-500" />}
                      <span>Alternar Tema ({theme === 'light' ? 'Escuro' : 'Claro'})</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-3 bg-gray-100 text-gray-900 rounded-2xl hover:bg-gray-200 transition-all"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white lg:hidden"
          >
            <div className="p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-3">
                  <Logo />
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-gray-100 text-gray-900 rounded-2xl"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8 flex-grow">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className="text-4xl font-black text-gray-900 hover:text-blue-600 transition-colors text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={() => {
                    onAdminClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full p-5 bg-gray-900 text-white rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  <User size={20} /> Login Administrador
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
