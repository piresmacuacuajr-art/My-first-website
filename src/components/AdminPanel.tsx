import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  MapPin, 
  Home, 
  Tag, 
  Image as ImageIcon, 
  X, 
  Settings,
  MessageSquare,
  LayoutDashboard,
  Star
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Property, Lead } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export const AdminPanel: React.FC = () => {
  const [activeView, setActiveView] = useState<'properties' | 'leads' | 'settings' | 'trash' | 'testimonials'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    furniturePrice: 0,
    location: 'Maputo',
    type: 'venda',
    category: 'casa',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: [],
    featured: false,
    status: 'available',
    coordinates: { lat: -25.9667, lng: 32.5833 }
  });

  const [testimonialData, setTestimonialData] = useState({
    name: '',
    role: '',
    text: '',
    avatar: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    const newImages = [...(formData.images || [])];
    
    for (const file of files as File[]) {
      const storageRef = ref(storage, `properties/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      newImages.push(url);
    }
    setFormData({ ...formData, images: newImages });
    setUploading(false);
  };

  useEffect(() => {
    const unsubProperties = onSnapshot(query(collection(db, 'properties'), orderBy('createdAt', 'desc')), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(fetched);
    });

    const unsubLeads = onSnapshot(query(collection(db, 'leads'), orderBy('createdAt', 'desc')), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
      setLeads(fetched);
    });

    const unsubTestimonials = onSnapshot(query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')), (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTestimonials(fetched);
    });

    return () => {
      unsubProperties();
      unsubLeads();
      unsubTestimonials();
    };
  }, []);

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingProperty?.id || Date.now().toString();
    const newProperty = {
      ...formData,
      id,
      createdAt: editingProperty?.createdAt || new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'properties', id), newProperty);
      setShowAddForm(false);
      setEditingProperty(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        location: 'Maputo',
        type: 'venda',
        category: 'casa',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        images: [],
        featured: false,
        status: 'available',
        coordinates: { lat: -25.9667, lng: 32.5833 }
      });
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Mover este imóvel para o lixo? Ele será eliminado permanentemente após 30 dias.')) {
      try {
        await setDoc(doc(db, 'properties', id), { 
          isDeleted: true, 
          deletedAt: new Date().toISOString() 
        }, { merge: true });
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleRestoreProperty = async (id: string) => {
    try {
      await setDoc(doc(db, 'properties', id), { 
        isDeleted: false, 
        deletedAt: null 
      }, { merge: true });
    } catch (error) {
      console.error('Error restoring property:', error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja eliminar permanentemente este imóvel?')) {
      try {
        await deleteDoc(doc(db, 'properties', id));
      } catch (error) {
        console.error('Error permanent deleting property:', error);
      }
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingTestimonial?.id || Date.now().toString();
    const newTestimonial = {
      ...testimonialData,
      id,
      createdAt: editingTestimonial?.createdAt || new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'testimonials', id), newTestimonial);
      setShowTestimonialForm(false);
      setEditingTestimonial(null);
      setTestimonialData({
        name: '',
        role: '',
        text: '',
        avatar: ''
      });
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleUpdateLeadStatus = async (id: string, status: Lead['status']) => {
    try {
      await setDoc(doc(db, 'leads', id), { status }, { merge: true });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-8 fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Admin<span className="text-blue-600">Hub</span></h1>
        </div>

        <nav className="space-y-2 flex-grow">
          <button 
            onClick={() => setActiveView('properties')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'properties' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Home size={18} /> Imóveis
          </button>
          <button 
            onClick={() => setActiveView('leads')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'leads' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={18} /> Contactos
          </button>
          <button 
            onClick={() => setActiveView('testimonials')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'testimonials' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Star size={18} /> Depoimentos
          </button>
          <button 
            onClick={() => setActiveView('trash')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'trash' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Trash2 size={18} /> Lixo
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
              activeView === 'settings' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings size={18} /> Definições
          </button>
        </nav>

        <div className="pt-8 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full border-2 border-white"></div>
            <div>
              <p className="text-sm font-bold text-gray-900">Admin Edson Group</p>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-grow p-12">
        <AnimatePresence mode="wait">
          {activeView === 'properties' && (
            <motion.div
              key="properties"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Imóveis</h2>
                  <p className="text-gray-500 mt-1">Gerencie seu catálogo de imóveis e destaques.</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                >
                  <Plus size={20} /> Novo Imóvel
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Total de Imóveis', value: properties.filter(p => !p.isDeleted).length, icon: <Home className="text-blue-600" />, bg: 'bg-blue-50' },
                  { label: 'Em Destaque', value: properties.filter(p => p.featured && !p.isDeleted).length, icon: <Star className="text-amber-500" />, bg: 'bg-amber-50' },
                  { label: 'Para Venda', value: properties.filter(p => p.type === 'venda' && !p.isDeleted).length, icon: <Tag className="text-emerald-600" />, bg: 'bg-emerald-50' },
                  { label: 'Para Arrendar', value: properties.filter(p => p.type === 'arrendamento' && !p.isDeleted).length, icon: <Tag className="text-purple-600" />, bg: 'bg-purple-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className={`p-4 ${stat.bg} rounded-2xl`}>{stat.icon}</div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Imóvel</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Tipo</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Preço</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.filter(p => !p.isDeleted).map(property => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                              <img 
                                src={property.images[0]} 
                                alt="" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 line-clamp-1">{property.title}</p>
                              <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                                <MapPin size={12} />
                                <span className="text-[10px] font-medium">{property.location}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            property.type === 'venda' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {property.type}
                          </span>
                        </td>
                        <td className="p-6">
                          <p className="text-sm font-bold text-gray-900">{property.price.toLocaleString('pt-MZ')} MZN</p>
                        </td>
                        <td className="p-6">
                          <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                            property.status === 'available' ? 'text-emerald-600' : 'text-gray-400'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${property.status === 'available' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                            {property.status === 'available' ? 'Disponível' : 'Indisponível'}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                setEditingProperty(property);
                                setFormData(property);
                                setShowAddForm(true);
                              }}
                              className="p-3 hover:bg-blue-50 hover:text-blue-600 text-gray-400 rounded-xl transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProperty(property.id)}
                              className="p-3 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeView === 'trash' && (
            <motion.div
              key="trash"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-12">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lixo</h2>
                <p className="text-gray-500 mt-1">Imóveis eliminados. Serão removidos permanentemente após 30 dias.</p>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Imóvel</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Data de Eliminação</th>
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {properties.filter(p => p.isDeleted).map(property => (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img src={property.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                            <p className="text-sm font-bold text-gray-900">{property.title}</p>
                          </div>
                        </td>
                        <td className="p-6 text-sm text-gray-500">
                          {new Date(property.deletedAt).toLocaleDateString()}
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2">
                            <button onClick={() => handleRestoreProperty(property.id)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all">Recuperar</button>
                            <button onClick={() => handlePermanentDelete(property.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all">Eliminar Permanente</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeView === 'testimonials' && (
            <motion.div
              key="testimonials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestão de Depoimentos</h2>
                  <p className="text-gray-500 mt-1">Gerencie os depoimentos exibidos no site.</p>
                </div>
                <button 
                  onClick={() => setShowTestimonialForm(true)}
                  className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                >
                  <Plus size={20} /> Novo Depoimento
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">
                        {t.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed mb-6">"{t.text}"</p>
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingTestimonial(t); setTestimonialData(t); setShowTestimonialForm(true); }} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit3 size={16}/></button>
                      <button onClick={() => deleteDoc(doc(db, 'testimonials', t.id))} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-12">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Contactos e Leads</h2>
                <p className="text-gray-500 mt-1">Acompanhe as solicitações de clientes e proprietários.</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {leads.map(lead => (
                  <div key={lead.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between">
                    <div className="flex gap-6">
                      <div className={`p-4 rounded-2xl ${
                        lead.type === 'visit' ? 'bg-blue-50 text-blue-600' : 
                        lead.type === 'announcement' ? 'bg-amber-50 text-amber-500' : 
                        'bg-purple-50 text-purple-600'
                      }`}>
                        {lead.type === 'visit' ? <Search size={24} /> : 
                         lead.type === 'announcement' ? <Home size={24} /> : 
                         <MessageSquare size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">{lead.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            lead.status === 'new' ? 'bg-amber-100 text-amber-600' : 
                            lead.status === 'contacted' ? 'bg-blue-100 text-blue-600' : 
                            'bg-emerald-100 text-emerald-600'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4 font-medium">
                          <span className="flex items-center gap-2"><ImageIcon size={14}/> {lead.contact}</span>
                          {lead.email && <span className="flex items-center gap-2"><MessageSquare size={14}/> {lead.email}</span>}
                          <span className="flex items-center gap-2"><LayoutDashboard size={14}/> {lead.type}</span>
                        </div>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-2xl italic leading-relaxed border border-gray-100">
                          "{lead.message}"
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                        className="bg-gray-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">Novo</option>
                        <option value="contacted">Contactado</option>
                        <option value="closed">Concluído</option>
                      </select>
                      <button 
                        onClick={() => deleteDoc(doc(db, 'leads', lead.id))}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-bold"
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {editingProperty ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">Preencha todos os detalhes técnicos do imóvel.</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-3 hover:bg-white text-gray-400 hover:text-gray-900 rounded-2xl transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProperty} className="p-10 overflow-y-auto space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Título do Anúncio</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Vivenda Moderna T4 na Matola"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Preço (MZN)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Preço Mobília Opcional (MZN)</label>
                    <input 
                      type="number" 
                      value={formData.furniturePrice}
                      onChange={(e) => setFormData({ ...formData, furniturePrice: Number(e.target.value) })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Localização</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    >
                      <option value="Maputo">Maputo Cidade</option>
                      <option value="Matola">Matola</option>
                      <option value="Marracuene">Marracuene</option>
                      <option value="Boane">Boane</option>
                      <option value="Beira">Beira</option>
                      <option value="Nampula">Nampula</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Negócio</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    >
                      <option value="venda">Venda</option>
                      <option value="arrendamento">Arrendamento</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    >
                      <option value="casa">Casa</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="terreno">Terreno</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Quartos</label>
                    <input 
                      type="number" 
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Casas de Banho</label>
                    <input 
                      type="number" 
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Área (m²)</label>
                    <input 
                      type="number" 
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Imagens e Vídeos</label>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                  {uploading && <p className="text-xs text-blue-600 font-bold">A carregar...</p>}
                  <textarea 
                    rows={3}
                    placeholder="Ou cole as URLs das imagens/vídeos aqui, separadas por vírgula"
                    value={formData.images?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Descrição Detalhada</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Latitude</label>
                    <input 
                      type="number" 
                      step="any"
                      value={formData.coordinates?.lat}
                      onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates!, lat: Number(e.target.value) } })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Longitude</label>
                    <input 
                      type="number" 
                      step="any"
                      value={formData.coordinates?.lng}
                      onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates!, lng: Number(e.target.value) } })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-blue-900 cursor-pointer">
                    Destacar este imóvel na página principal
                  </label>
                </div>

                <div className="pt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-grow p-5 bg-gray-100 text-gray-500 rounded-3xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow-[2] p-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    {editingProperty ? 'Guardar Alterações' : 'Publicar Imóvel'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {showTestimonialForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTestimonialForm(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl overflow-hidden rounded-[3rem] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Depoimento</h3>
                <button onClick={() => setShowTestimonialForm(false)} className="p-3 text-gray-400 hover:text-gray-900 transition-all"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveTestimonial} className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nome do Cliente</label>
                  <input required value={testimonialData.name} onChange={(e) => setTestimonialData({ ...testimonialData, name: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Cargo / Papel</label>
                  <input required value={testimonialData.role} onChange={(e) => setTestimonialData({ ...testimonialData, role: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Depoimento</label>
                  <textarea required rows={4} value={testimonialData.text} onChange={(e) => setTestimonialData({ ...testimonialData, text: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                </div>
                <button type="submit" className="w-full p-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Salvar Depoimento</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
