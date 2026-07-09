import React, { useRef } from 'react';
import { Property } from '../types';
import { X, MapPin, Bed, Bath, Maximize, MessageSquare, Calendar, ShieldCheck, Printer, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Map } from './Map';
import { PriceHistoryChart } from './PriceHistoryChart';

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
  onLeadSubmit: (type: 'visit' | 'quote') => void;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onClose, onLeadSubmit }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    const input = contentRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${property.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl print:hidden"
      />
      
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row print:shadow-none print:max-h-none print:overflow-visible"
      >
        <div className="absolute top-6 right-6 z-10 flex gap-2 print:hidden">
          <button 
            onClick={handleDownloadPDF}
            className="p-3 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full transition-all backdrop-blur-md"
          >
            <Download size={24} />
          </button>
          <button 
            onClick={() => window.print()}
            className="p-3 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full transition-all backdrop-blur-md"
          >
            <Printer size={24} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 bg-white/20 hover:bg-white text-white hover:text-gray-900 rounded-full transition-all backdrop-blur-md"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-3/5 h-64 md:h-auto bg-gray-100 relative overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-2 p-2">
            {property.images.map((img, i) => (
              <img 
                key={i}
                src={img} 
                alt="" 
                className="w-full h-auto object-cover rounded-2xl first:rounded-t-[3rem]"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/5 p-10 md:p-16 overflow-y-auto bg-white flex flex-col">
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                property.type === 'venda' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {property.type}
              </span>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500">
                {property.category}
              </span>
            </div>

            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
              {property.title}
            </h2>

            <div className="flex items-center gap-2 text-blue-600 font-bold mb-8">
              <MapPin size={18} />
              <span className="text-sm">{property.location}</span>
            </div>

            <div className="mb-8">
              <Map 
                lat={property.coordinates?.lat || -18.6657} 
                lng={property.coordinates?.lng || 35.5296} 
              />
            </div>

            <div className="text-4xl font-black text-blue-600 mb-2 tracking-tight">
              {property.price.toLocaleString('pt-MZ')} <span className="text-lg font-bold text-blue-300">MZN</span>
            </div>

            {property.furniturePrice && (
              <div className="mb-10 p-4 bg-gold/10 border border-gold/20 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold">Opção Mobiliado</span>
                  <span className="text-lg font-black text-navy">
                    +{property.furniturePrice.toLocaleString('pt-MZ')} MZN
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="bg-gray-50 p-8 rounded-3xl flex flex-col items-center gap-2 border border-gray-100">
                <Bed className="text-blue-500" size={20} />
                <span className="text-sm font-black text-gray-900">{property.bedrooms}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quartos</span>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl flex flex-col items-center gap-2 border border-gray-100">
                <Bath className="text-blue-500" size={20} />
                <span className="text-sm font-black text-gray-900">{property.bathrooms}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">WCs</span>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl flex flex-col items-center gap-2 border border-gray-100">
                <Maximize className="text-blue-500" size={20} />
                <span className="text-sm font-black text-gray-900">{property.area}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">m² Total</span>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-4">
                Descrição do Imóvel
              </h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                {property.description}
              </p>
            </div>

            {property.priceHistory && property.priceHistory.length > 0 && (
              <div className="mb-10 p-6 bg-gray-50 rounded-3xl">
                <PriceHistoryChart data={property.priceHistory} />
              </div>
            )}

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 text-sm font-bold text-gray-700">
                <ShieldCheck size={20} className="text-emerald-500" />
                <span>Documentação em Dia</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-gray-700">
                <Calendar size={20} className="text-blue-500" />
                <span>Disponível para Visitas Imediatas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100 mt-auto print:hidden">
            <button 
              onClick={() => onLeadSubmit('visit')}
              className="p-6 bg-gray-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-900/10 active:scale-95"
            >
              <Calendar size={18} /> Agendar Visita
            </button>
            <button 
              onClick={() => onLeadSubmit('quote')}
              className="p-6 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <MessageSquare size={18} /> Solicitar Info
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

