import React from 'react';
import { Property } from '../types';

interface FilterBarProps {
  filters: {
    type: string;
    category: string;
    minPrice: string;
    maxPrice: string;
    location: string;
    keyword: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, resultsCount }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Onde procura?</label>
        <select
          value={filters.location}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, location: e.target.value }))}
          className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="all">Moçambique (Todas)</option>
          <option value="Maputo">Maputo</option>
          <option value="Matola">Matola</option>
          <option value="Beira">Beira</option>
          <option value="Nampula">Nampula</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Tipo de Imóvel</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, category: e.target.value }))}
          className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none appearance-none cursor-pointer"
        >
          <option value="all">Todos os tipos</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Palavra-chave</label>
        <input 
          type="text"
          placeholder="Ex: Sommerschield, Piscina"
          value={filters.keyword}
          onChange={(e) => setFilters((prev: any) => ({ ...prev, keyword: e.target.value }))}
          className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
        />
      </div>

      <div className="flex items-end md:col-span-2">
        <button
          className="w-full p-4 bg-navy text-white rounded-2xl text-sm font-bold hover:bg-gold hover:text-navy transition-all shadow-xl shadow-gray-900/10 active:scale-95"
        >
          Pesquisar {resultsCount} Imóveis Disponíveis
        </button>
      </div>
    </div>
  );
};
