import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload } from 'lucide-react';

interface AdvertiseFormProps {
  onClose: () => void;
}

export const AdvertiseForm: React.FC<AdvertiseFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    contact: '',
    email: '',
    location: '',
    details: '',
    houseNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappNumber = "258852408905";
    const message = `Olá, gostaria de anunciar o meu imóvel:
- Contacto: ${formData.contact}
- Email: ${formData.email}
- Localização: ${formData.location}
- Detalhes da Casa: ${formData.details}
- Número da Casa: ${formData.houseNumber}
- Por favor, verifique a foto que enviarei em seguida.`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-navy uppercase">Anunciar Imóvel</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Contacto" required className="w-full p-3 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, contact: e.target.value})} />
          <input type="email" placeholder="Email" required className="w-full p-3 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="text" placeholder="Localização" required className="w-full p-3 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, location: e.target.value})} />
          <textarea placeholder="Detalhes da Casa" required className="w-full p-3 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, details: e.target.value})}></textarea>
          <input type="text" placeholder="Número" required className="w-full p-3 rounded-xl border border-gray-200" onChange={e => setFormData({...formData, houseNumber: e.target.value})} />
          <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-gold transition-all">
            <Upload />
            <span className="text-xs">Anexar foto da casa</span>
          </div>
          <button type="submit" className="w-full bg-gold text-navy font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-gold/90 transition-all">Enviar para WhatsApp</button>
        </form>
      </motion.div>
    </div>
  );
};
