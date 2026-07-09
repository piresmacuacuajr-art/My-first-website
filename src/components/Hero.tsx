import React from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, ArrowRight, Home, ShieldCheck, Star } from 'lucide-react';

interface HeroProps {
  onSearch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Background Decorations inspired by the card */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-navy rounded-l-[20rem] -z-10 translate-x-32 hidden lg:block overflow-hidden">
        <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-r from-gold via-gold/50 to-transparent opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent)]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-3xl lg:text-4xl font-medium text-navy leading-tight tracking-widest mb-6 uppercase">
            Encontre a sua <br />
            <span className="relative inline-block text-gold">
              Próxima
              <span className="absolute left-0 -bottom-1.5 w-full h-[2px] bg-gold rounded-full"></span>
            </span> <br />
            Conquista
          </h1>

          <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg mb-12">
            "Realizamos o sonho da casa própria e conectamos investidores às melhores oportunidades imobiliárias."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button 
              onClick={onSearch}
              className="px-10 py-5 bg-navy text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-navy/20 hover:bg-gold hover:text-navy hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              Explorar Imóveis <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-white text-navy border-2 border-gold/20 rounded-[2rem] font-black uppercase tracking-widest hover:border-gold transition-all flex items-center justify-center gap-3 group">
              Anunciar Imóvel <Home size={20} className="group-hover:text-gold" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
            <div>
              <p className="text-3xl font-black text-navy mb-1">500+</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Imóveis Vendidos</p>
            </div>
            <div>
              <p className="text-3xl font-black text-navy mb-1">10+</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Anos de Mercado</p>
            </div>
            <div>
              <p className="text-3xl font-black text-navy mb-1">100%</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Satisfação</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.2, 0, 0.1, 1] }}
          className="relative lg:translate-x-12"
        >
          <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl shadow-navy/20 border-4 border-white">
            <img 
              src="/src/assets/images/luxury_house_hero_1783524422704.jpg" 
              alt="Luxury Villa" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
          </div>

          {/* Floating Elements with Gold styling */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-gold/10 flex items-center gap-4 max-w-[240px]"
          >
            <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Segurança Total</p>
              <p className="text-[10px] text-gray-500 font-medium">Processos 100% Legais</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                ))}
              </div>
              <p className="text-xs font-bold text-gray-900">+2.5k Clientes</p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
              <span className="text-[10px] font-bold text-gray-500 ml-2">4.9/5 Avaliação</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
