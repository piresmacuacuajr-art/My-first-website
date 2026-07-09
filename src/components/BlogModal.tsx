import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogModalProps {
  post: BlogPost;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
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
          className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white text-white hover:text-navy rounded-full transition-all backdrop-blur-md">
              <X size={24} />
            </button>
          </div>
          <div className="overflow-auto p-8">
            <h2 className="text-3xl font-black text-navy mb-4">{post.title}</h2>
            <div className="flex items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">
              <div className="flex items-center gap-2"><Calendar size={14} /> {post.date}</div>
              <div className="flex items-center gap-2"><User size={14} /> {post.author}</div>
            </div>
            <div className="prose prose-navy max-w-none text-gray-600 leading-relaxed">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
