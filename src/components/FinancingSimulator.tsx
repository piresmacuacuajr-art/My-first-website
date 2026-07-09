import React, { useState } from 'react';
import { Calculator, CreditCard, Calendar, Info, ArrowRight } from 'lucide-react';

export const FinancingSimulator: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [years, setYears] = useState(20);
  const interestRate = 0.15; // 15% annual interest rate

  const loanAmount = propertyValue - downPayment;
  const monthlyRate = interestRate / 12;
  const numberOfPayments = years * 12;
  
  const monthlyPayment = loanAmount > 0 
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : 0;

  return (
    <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl shadow-navy/10 border border-gold/10 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/5 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-navy rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-navy/20">
            <Calculator size={28} className="text-gold" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-navy tracking-tight">Simulador Crédito</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Taxas Reais Moçambique</p>
          </div>
        </div>

        <div className="space-y-10 mb-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Valor do Imóvel</label>
              <span className="text-sm font-black text-gold">{propertyValue.toLocaleString()} MZN</span>
            </div>
            <input 
              type="range" 
              min="500000" 
              max="50000000" 
              step="100000"
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Entrada (Down Payment)</label>
              <span className="text-sm font-black text-gold">{downPayment.toLocaleString()} MZN</span>
            </div>
            <input 
              type="range" 
              min="100000" 
              max={propertyValue * 0.8}
              step="50000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">Prazo (Anos)</label>
              <span className="text-sm font-black text-gold">{years} Anos</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-gold"
            />
          </div>
        </div>

        <div className="bg-navy rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CreditCard size={120} className="text-gold" />
          </div>
          
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-2">Prestação Mensal Estimada</p>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-5xl font-black tracking-tighter">{Math.round(monthlyPayment).toLocaleString()}</span>
              <span className="text-xl font-bold text-gray-400">MZN/mês</span>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Taxa Juro Anual</p>
                <p className="text-sm font-black text-gold">15.00%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Montante do Empréstimo</p>
                <p className="text-sm font-black text-gold">{loanAmount.toLocaleString()} MZN</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-start gap-4 p-6 bg-gold/5 rounded-3xl border border-gold/10">
          <Info className="text-gold shrink-0" size={20} />
          <p className="text-[11px] text-navy font-medium leading-relaxed">
            *Os valores apresentados são meras simulações e podem variar de acordo com a instituição financeira e o seu perfil de crédito. Taxas sujeitas a alteração pelo Banco de Moçambique.
          </p>
        </div>

        <button className="w-full mt-8 p-6 bg-navy text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gold hover:text-navy transition-all shadow-xl shadow-navy/20 group">
          Solicitar Apoio Bancário <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
