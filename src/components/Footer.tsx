import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Send } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-dark text-white pt-24 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <Logo light />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Building Dreams Through Real Estate. Sua parceira de confiança no mercado imobiliário em Moçambique.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-gray-400 hover:bg-gold hover:text-navy transition-all shadow-lg border border-gold/10">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-gold">Navegação</h4>
            <ul className="space-y-6">
              {['Início', 'Imóveis', 'Comprar', 'Arrendar', 'Administração de Propriedades', 'Sobre Nós'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
                    <div className="w-0 h-0.5 bg-gold group-hover:w-4 transition-all duration-300"></div>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-gold">Contactos</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Sede</span>
                <span className="text-gray-300 font-medium">Vaz Spenser Street, Q28, No. 125, Matola, Moçambique</span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">E-mail</span>
                <a href="mailto:info@edsongroup.co.mz" className="text-gray-300 font-medium hover:text-gold transition-colors">info@edsongroup.co.mz</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Telefone</span>
                <span className="text-gray-300 font-medium">+258 85 240 8905<br />+258 87 292 1104</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-10 text-gold">Website</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Visite-nos para mais informações e soluções de investimento.</p>
            <a href="https://www.edsongroup.co.mz" className="text-gold font-black text-sm hover:underline">www.edsongroup.co.mz</a>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            © 2026 Edson Group Real Estate. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Termos de Uso</a>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-20"></div>
    </footer>
  );
};
