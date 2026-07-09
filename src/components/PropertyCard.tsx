import React from 'react';
import { motion } from 'motion/react';
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isSelectedForComparison: boolean;
  onToggleComparison: (e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onClick, 
  isFavorite, 
  onToggleFavorite, 
  isSelectedForComparison,
  onToggleComparison
}) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className={`bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-300 group cursor-pointer ${isSelectedForComparison ? 'border-gold shadow-lg shadow-gold/20' : 'border-gray-100 shadow-sm hover:shadow-xl'}`}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0] || 'https://via.placeholder.com/400x300'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            property.type === 'venda' ? 'bg-navy text-white' : 'bg-emerald-500 text-white'
          }`}>
            {property.type === 'venda' ? 'Venda' : 'Arrendar'}
          </span>
          <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-navy">
            {property.category}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={onToggleFavorite}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm backdrop-blur-sm ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={onToggleComparison}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm backdrop-blur-sm ${
              isSelectedForComparison 
                ? 'bg-gold text-navy' 
                : 'bg-white/90 text-gray-400 hover:text-gold'
            }`}
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center gap-1 text-gold mb-2">
          <MapPin size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">{property.location}</span>
        </div>
        <h3 className="text-xl font-bold text-navy mb-3 line-clamp-1 group-hover:text-gold transition">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-4 mb-6 text-gray-500">
          {property.bedrooms && (
            <div className="flex items-center gap-1.5">
              <Bed size={16} />
              <span className="text-sm font-semibold">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1.5">
              <Bath size={16} />
              <span className="text-sm font-semibold">{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Square size={16} />
            <span className="text-sm font-semibold">{property.area} m²</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase">Preço</span>
            <span className="text-2xl font-black text-navy">
              {property.price.toLocaleString('pt-PT')} <span className="text-sm font-bold text-gold">MZN</span>
            </span>
          </div>
          <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-3xl flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-all">
             <PlusCircle size={28} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PlusCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
