import React from 'react';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { BlogModal } from './BlogModal';

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Como comprar uma casa em Moçambique: Guia Completo',
    excerpt: 'Saiba quais são os passos fundamentais e os cuidados a ter ao adquirir o seu primeiro imóvel.',
    content: `Comprar uma casa é um dos maiores investimentos que fará na sua vida. Em Moçambique, o processo exige atenção a detalhes legais e burocráticos.

Primeiro, defina o seu orçamento e procure um consultor imobiliário de confiança. A verificação da certidão de registo predial é crucial para garantir que o imóvel não tem ónus.

Em seguida, trate da escritura e do pagamento dos impostos, como o SISA (Imposto sobre a Transmissão de Imóveis). Não hesite em perguntar sobre cada etapa do processo.`,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
    category: 'Guia de Compra',
    date: '15 Jun 2026',
    author: 'Equipa Edson Group'
  },
  {
    id: '2',
    title: 'Documentos necessários para venda de imóveis',
    excerpt: 'Evite atrasos no processo de venda garantindo que tem toda a documentação legal em ordem.',
    content: `Para vender um imóvel com sucesso e sem percalços legais, deve ter em mãos:
- Certidão de Registo Predial (atualizada);
- Documento de Identificação do Proprietário;
- Certidão de Quitação de Impostos (IPRA);
- Planta da casa/terreno.

Manter estes documentos organizados acelera significativamente o processo de venda.`,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
    category: 'Jurídico',
    date: '10 Jun 2026',
    author: 'Consultoria Edson Group'
  },
  {
    id: '3',
    title: 'Tendências do mercado imobiliário em 2026',
    excerpt: 'Onde investir em Moçambique? Veja as zonas com maior potencial de valorização.',
    content: `O mercado imobiliário em Moçambique continua a crescer, com foco particular em zonas urbanas e áreas com desenvolvimento industrial e turístico.

Investir em propriedades que oferecem valor acrescentado — como localização próxima a serviços, segurança e infraestruturas — é a chave para uma boa valorização a médio e longo prazo.`,
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623abe5?auto=format&fit=crop&q=80',
    category: 'Mercado',
    date: '05 Jun 2026',
    author: 'Análise Edson Group'
  }
];

export const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      {selectedPost && <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
              Insights do <span className="text-blue-600">Mercado</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              Mantenha-se informado sobre as últimas tendências, dicas de investimento e guias práticos sobre o mercado imobiliário moçambicano.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-gray-900 border border-gray-100 rounded-2xl font-bold shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 group">
            Ver Todo o Blog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100 flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 rounded-full bg-white/90 text-blue-600 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-blue-500" /> {post.author}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">
                  {post.excerpt}
                </p>

                <button 
                  onClick={() => setSelectedPost(post)}
                  className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group/btn pt-6 border-t border-gray-50"
                >
                  Ler Artigo Completo 
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
