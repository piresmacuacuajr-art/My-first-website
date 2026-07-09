import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bed, Bath, Square, Tag } from 'lucide-react';
import { Property } from '../types';

interface ComparisonModalProps {
  properties: Property[];
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ properties, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-black text-navy">Comparar Imóveis</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <X size={24} />
            </button>
          </div>
          
          <div className="overflow-auto p-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b"></th>
                  {properties.map(p => (
                    <th key={p.id} className="p-4 border-b font-bold text-navy">{p.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 font-bold text-gray-500">Preço</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-4 font-black text-navy">{p.price.toLocaleString('pt-PT')} MZN</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-500">Área</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-4 font-semibold text-navy">{p.area} m²</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-500">Quartos</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-4 font-semibold text-navy">{p.bedrooms}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-500">Casas de Banho</td>
                  {properties.map(p => (
                    <td key={p.id} className="p-4 font-semibold text-navy">{p.bathrooms}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
