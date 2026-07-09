import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Home, 
  Building2, 
  Map, 
  ShoppingBag, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Tag,
  Key,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';
import { Property, Lead } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { MapSection } from './components/MapSection';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetails } from './components/PropertyDetails';
import { AdminPanel } from './components/AdminPanel';
import { FinancingSimulator } from './components/FinancingSimulator';
import { Blog } from './components/Blog';
import { ComparisonModal } from './components/ComparisonModal';
import { AdvertiseForm } from './components/AdvertiseForm';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    minPrice: '0',
    maxPrice: 'all',
    location: 'all',
    keyword: ''
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [comparisonList, setComparisonList] = useState<Property[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showAdvertiseModal, setShowAdvertiseModal] = useState(false);
  const [showLeadSuccess, setShowLeadSuccess] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('edsongroup_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleComparison = (property: Property) => {
    setComparisonList(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, property];
    });
  };

  const handleAdminAccess = () => {
    setShowPasswordModal(true);
  };

  const verifyPassword = () => {
    if (adminPassword === '090600') {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setAdminPassword('');
    } else {
      alert('Palavra-passe incorrecta.');
    }
  };

  useEffect(() => {
    localStorage.setItem('edsongroup_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubProperties = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(fetched);
    });

    const qTest = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubTestimonials = onSnapshot(qTest, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTestimonials(fetched);
    });

    return () => {
      unsubProperties();
      unsubTestimonials();
    };
  }, []);

  const filteredProperties = properties.filter(p => {
    if (p.isDeleted) return false;
    if (filters.type !== 'all' && p.type !== filters.type) return false;
    if (filters.category !== 'all' && p.category !== filters.category) return false;
    if (filters.maxPrice !== 'all' && p.price > Number(filters.maxPrice)) return false;
    if (filters.location !== 'all' && p.location !== filters.location) return false;
    if (filters.keyword && !p.title.toLowerCase().includes(filters.keyword.toLowerCase()) && !p.location.toLowerCase().includes(filters.keyword.toLowerCase())) return false;
    return true;
  });

  const featuredProperties = properties.filter(p => p.featured && !p.isDeleted).slice(0, 3);
  const favoriteProperties = properties.filter(p => favorites.includes(p.id) && !p.isDeleted);

  const handleLeadSubmit = async (type: 'visit' | 'quote' | 'announcement', data?: any) => {
    const lead: Partial<Lead> = {
      name: data?.name || 'Cliente Interessado',
      contact: data?.contact || 'Ver Detalhes',
      message: data?.message || `Interesse em ${selectedProperty?.title || 'imóvel'}`,
      propertyId: selectedProperty?.id,
      type,
      status: 'new',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'leads'), lead);
      setShowLeadSuccess(true);
      setTimeout(() => setShowLeadSuccess(false), 5000);
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error submitting lead:', error);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isAdminMode) {
    return (
      <>
        <AdminPanel />
        <button 
          onClick={() => setIsAdminMode(false)}
          className="fixed bottom-8 left-8 z-[200] bg-navy text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-2xl hover:bg-gold hover:text-navy transition-all"
        >
          Sair do Admin
        </button>
      </>
    );
  }

  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-navy-dark min-h-screen selection:bg-gold/30 selection:text-navy transition-colors duration-300">
        <Navbar 
          isAdmin={isAdminMode} 
          onAdminClick={handleAdminAccess} 
          onNavigate={scrollToSection}
          hasFavorites={favoriteProperties.length > 0}
          onAdvertiseClick={() => setShowAdvertiseModal(true)}
        />
        
        <main>
          <section id="home">
            <Hero onSearch={() => scrollToSection('catalog')} />
          </section>

          {/* Featured Section */}
          <section className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-center justify-between mb-16">
                <div>
                  <h2 className="text-4xl font-black text-navy tracking-tight">Imóveis em <span className="text-gold">Destaque</span></h2>
                  <p className="text-gray-500 mt-2 font-medium">As melhores oportunidades selecionadas pela nossa equipa.</p>
                </div>
                <button onClick={() => scrollToSection('catalog')} className="text-gold font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  Ver Todos <ArrowRight size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {featuredProperties.map(p => (
                  <PropertyCard 
                    key={p.id} 
                    property={p} 
                    onClick={() => setSelectedProperty(p)} 
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={(e) => toggleFavorite(e, p.id)}
                    onToggleComparison={(e) => { e.stopPropagation(); toggleComparison(p); }}
                    isSelectedForComparison={comparisonList.some(comp => comp.id === p.id)}
                  />
                ))}
                {featuredProperties.length === 0 && (
                  <div className="col-span-3 py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                    <Home size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold">Nenhum imóvel em destaque no momento.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Favorites Section */}
          <AnimatePresence>
            {favoriteProperties.length > 0 && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="py-24 bg-white overflow-hidden"
                id="favorites"
              >
                <div className="max-w-7xl mx-auto px-8">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-gold/10 text-gold rounded-2xl flex items-center justify-center">
                      <Star size={24} fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-navy tracking-tight">Meus <span className="text-gold">Favoritos</span></h2>
                      <p className="text-gray-500 font-medium text-sm">Os imóveis que guardou para ver mais tarde.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {favoriteProperties.map(p => (
                      <PropertyCard 
                        key={p.id} 
                        property={p} 
                        onClick={() => setSelectedProperty(p)} 
                        isFavorite={true}
                        onToggleFavorite={(e) => toggleFavorite(e, p.id)}
                        onToggleComparison={(e) => { e.stopPropagation(); toggleComparison(p); }}
                        isSelectedForComparison={comparisonList.some(comp => comp.id === p.id)}
                      />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Catalog Section */}
          <section id="catalog" className="py-32 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-8">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-black text-navy tracking-tight mb-4">Encontre o seu <span className="text-gold">Lugar</span></h2>
                <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                  Filtre por localização, preço e tipo de imóvel para encontrar exatamente o que procura.
                </p>
              </div>

              <div className="mb-16">
                <FilterBar filters={filters} setFilters={setFilters} resultsCount={filteredProperties.length} />
              </div>

              <div className="mb-24">
                <MapSection properties={filteredProperties} onPropertyClick={(p) => setSelectedProperty(p)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProperties.map(p => (
                  <PropertyCard 
                    key={p.id} 
                    property={p} 
                    onClick={() => setSelectedProperty(p)} 
                    isFavorite={favorites.includes(p.id)}
                    onToggleFavorite={(e) => toggleFavorite(e, p.id)}
                    onToggleComparison={(e) => { e.stopPropagation(); toggleComparison(p); }}
                    isSelectedForComparison={comparisonList.some(comp => comp.id === p.id)}
                  />
                ))}
                {filteredProperties.length === 0 && (
                  <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <Search size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-bold">Não encontramos imóveis com os filtros selecionados.</p>
                    <button 
                      onClick={() => setFilters({ type: 'all', category: 'all', minPrice: '0', maxPrice: 'all', location: 'all' })}
                      className="mt-6 text-gold font-bold hover:underline"
                    >
                      Limpar todos os filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Category Icons Section */}
          <section className="py-24 bg-navy text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] rounded-full translate-x-1/3"></div>
            <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: <Home size={32} />, label: 'Casas Luxuosas', desc: 'Conforto e elegância' },
                  { icon: <Building2 size={32} />, label: 'Apartamentos', desc: 'Vistas incríveis' },
                  { icon: <Map size={32} />, label: 'Terrenos', desc: 'Construa o seu sonho' },
                  { icon: <ShoppingBag size={32} />, label: 'Comercial', desc: 'Expanda o seu negócio' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className="text-gold mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="text-xl font-bold mb-2">{item.label}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Simulator Section */}
          <section id="simulator" className="py-32 bg-gray-50/50 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-5xl font-black text-navy leading-tight mb-8 tracking-tight">
                  Planear o seu <span className="text-gold">Futuro</span> nunca foi tão fácil.
                </h2>
                <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10">
                  Use o nosso simulador para ter uma estimativa clara das prestações mensais para o seu novo imóvel. Transparência em cada passo do seu investimento.
                </p>
                <ul className="space-y-6">
                  {[
                    'Cálculo baseado em taxas reais de mercado',
                    'Simulação flexível de entrada e prazo',
                    'Apoio especializado no processo bancário'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-700 font-bold">
                      <CheckCircle className="text-gold" size={24} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <FinancingSimulator />
            </div>
          </section>

          {/* Lead Capture Form Section */}
          <section className="py-32">
            <div className="max-w-7xl mx-auto px-8">
              <div className="bg-navy rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16 shadow-2xl shadow-navy/30">
                <div className="relative z-10 text-white md:w-1/2">
                  <h2 className="text-5xl font-black leading-tight mb-8 tracking-tight">
                    Quer vender ou arrendar o seu imóvel?
                  </h2>
                  <p className="text-gold-light text-lg font-medium mb-10">
                    Deixe connosco! Temos a maior rede de compradores e investidores em Moçambique prontos para o seu negócio.
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                      <p className="text-4xl font-black mb-1 text-gold">98%</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Sucesso em Vendas</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                      <p className="text-4xl font-black mb-1 text-gold">15d</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Tempo Médio</p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 bg-white p-10 rounded-[3rem] shadow-2xl md:w-1/2">
                  <h3 className="text-2xl font-bold text-navy mb-8">Anuncie Grátis</h3>
                  <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    const message = `Olá, gostaria de anunciar o meu imóvel:
  - Nome: ${target.name.value}
  - Contacto: ${target.phone.value}
  - Email: ${target.email.value}
  - Localização: ${target.location.value}
  - Detalhes da Casa: ${target.type.value}
  - Número da Casa: ${target.houseNumber.value}
  - Por favor, verifique a foto que enviarei em seguida.`;
                    window.open(`https://wa.me/258852408905?text=${encodeURIComponent(message)}`, '_blank');
                    target.reset();
                  }}>
                    <input required name="name" type="text" placeholder="O seu nome" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" />
                    <input required name="phone" type="tel" placeholder="O seu contacto" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" />
                    <input required name="email" type="email" placeholder="O seu email" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" />
                    <input required name="location" type="text" placeholder="Localização" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" />
                    <input required name="houseNumber" type="text" placeholder="Número da Casa" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none" />
                    <select required name="type" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none">
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="terreno">Terreno</option>
                      <option value="comercial">Espaço Comercial</option>
                    </select>
                    <button className="w-full p-5 bg-navy text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-navy/20 hover:bg-gold hover:text-navy transition-all active:scale-95">
                      Enviar para WhatsApp
                    </button>
                  </form>
                </div>

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </section>

          {/* Blog Section */}
          <section id="blog" className="scroll-mt-20">
            <Blog />
          </section>

          {/* About Section */}
          <section id="about" className="py-32 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="relative">
                  <div className="relative rounded-[4rem] overflow-hidden aspect-square shadow-2xl border-[12px] border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" 
                      alt="Our Team" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gold/10 flex items-center gap-6">
                    <div className="p-5 bg-gold/10 text-gold rounded-2xl">
                      <Users size={32} />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-navy">100+</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Especialistas</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-5xl font-black text-navy tracking-tight leading-tight mb-8">
                    Especialistas no <span className="text-gold">Mercado</span> Moçambicano.
                  </h2>
                  <div className="space-y-8">
                    {[
                      { title: 'Missão', text: 'Facilitar o acesso à habitação digna e segura através de tecnologia e transparência.' },
                      { title: 'Visão', text: 'Ser a plataforma imobiliária de referência em Moçambique pela confiança e agilidade.' },
                      { title: 'Valores', text: 'Ética profissional, foco no cliente e inovação constante em todos os processos.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 group">
                        <div className="w-12 h-12 shrink-0 bg-gold/10 text-gold rounded-2xl flex items-center justify-center font-black group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-navy mb-2">{item.title}</h4>
                          <p className="text-gray-500 font-medium leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-32 bg-navy-dark text-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-8 relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black tracking-tight mb-4">O que dizem os nossos <span className="text-gold">Clientes</span></h2>
                <p className="text-gray-400 font-medium max-w-2xl mx-auto">Histórias reais de quem encontrou o seu lugar connosco.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.length > 0 ? (
                  testimonials.map((t, i) => (
                    <div key={t.id} className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                      <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                      </div>
                      <p className="text-lg font-medium text-gray-300 italic mb-8 leading-relaxed">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                          {t.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white">{t.name}</p>
                          <p className="text-[10px] font-bold text-gold uppercase tracking-widest">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Ricardo Santos', role: 'Investidor', text: 'Edson Group Real Estate superou todas as expectativas. Encontraram o imóvel perfeito para o meu portfólio em tempo recorde.' },
                    { name: 'Ana Macuácua', role: 'Proprietária', text: 'Vender a minha casa nunca foi tão fácil. O profissionalismo da equipa e a qualidade do anúncio fizeram toda a diferença.' },
                    { name: 'José Langa', role: 'Comprador', text: 'O simulador de financiamento ajudou-me imenso a planear a compra da minha primeira casa. Recomendo vivamente!' }
                  ].map((t, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10">
                      <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="text-amber-400 fill-amber-400" />)}
                      </div>
                      <p className="text-lg font-medium text-gray-300 italic mb-8 leading-relaxed">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gold/20"></div>
                        <div>
                          <p className="font-bold text-white">{t.name}</p>
                          <p className="text-[10px] font-bold text-gold uppercase tracking-widest">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppButton />

        {/* Mobile Bottom Navigation Capsule as shown in the screenshot */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[190] w-[90%] max-w-md bg-navy/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] py-3 px-6 shadow-2xl flex justify-between items-center text-white">
          {/* ... existing mobile nav ... */}
          <button 
            onClick={() => {
              scrollToSection('home');
              setFilters(prev => ({ ...prev, type: 'all' }));
            }}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
              filters.type === 'all' ? 'text-gold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-full transition-all ${filters.type === 'all' ? 'bg-gold/10 text-gold' : ''}`}>
              <Home size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Início</span>
            {filters.type === 'all' && <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse mt-0.5"></div>}
          </button>

          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, type: 'venda' }));
              scrollToSection('catalog');
            }}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
              filters.type === 'venda' ? 'text-gold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-full transition-all ${filters.type === 'venda' ? 'bg-gold/10 text-gold' : ''}`}>
              <Tag size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Vendas</span>
            {filters.type === 'venda' && <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse mt-0.5"></div>}
          </button>

          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, type: 'arrendamento' }));
              scrollToSection('catalog');
            }}
            className={`flex flex-col items-center gap-1 flex-1 py-1 transition-all ${
              filters.type === 'arrendamento' ? 'text-gold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className={`p-2 rounded-full transition-all ${filters.type === 'arrendamento' ? 'bg-gold/10 text-gold' : ''}`}>
              <Key size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Arrendar</span>
            {filters.type === 'arrendamento' && <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse mt-0.5"></div>}
          </button>

          <button 
            onClick={handleAdminAccess}
            className="flex flex-col items-center gap-1 flex-1 py-1 text-gray-400 hover:text-white transition-all"
          >
            <div className="p-2 rounded-full">
              <User size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Perfil</span>
          </button>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {comparisonList.length > 0 && (
            <button
              onClick={() => setShowComparisonModal(true)}
              className="fixed bottom-24 right-8 z-[190] bg-gold text-navy px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
            >
              Comparar ({comparisonList.length})
            </button>
          )}

          {showComparisonModal && (
            <ComparisonModal
              properties={comparisonList}
              onClose={() => setShowComparisonModal(false)}
            />
          )}
          {showAdvertiseModal && (
            <AdvertiseForm onClose={() => setShowAdvertiseModal(false)} />
          )}
          
          {selectedProperty && (
            <PropertyDetails 
              property={selectedProperty} 
              onClose={() => setSelectedProperty(null)}
              onLeadSubmit={handleLeadSubmit}
            />
          )}
          
          {showPasswordModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[500] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-8"
            >
              <div className="bg-white p-8 rounded-[3rem] w-full max-w-sm shadow-2xl">
                <h3 className="text-xl font-black text-navy mb-6">Acesso Administrador</h3>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Código de acesso"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-gold outline-none mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-navy"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 p-4 bg-gray-100 rounded-2xl font-bold text-navy hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={verifyPassword}
                    className="flex-1 p-4 bg-navy text-white rounded-2xl font-black hover:bg-gold hover:text-navy transition-all"
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {showLeadSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 border-2 border-emerald-400"
            >
              <CheckCircle size={24} />
              <div>
                <p className="font-black uppercase text-xs tracking-widest">Sucesso!</p>
                <p className="text-sm font-medium">O seu pedido foi enviado. Contactaremos em breve.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}




