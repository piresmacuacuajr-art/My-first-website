import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore';
import { db } from './lib/firebase';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  furniturePrice?: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  type: 'venda' | 'arrendamento';
  category: 'casa' | 'apartamento' | 'terreno' | 'comercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  priceHistory?: { date: string; price: number }[];
  featured: boolean;
  status: 'available' | 'sold' | 'rented';
  createdAt: any;
  deletedAt?: any;
  isDeleted?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  avatar?: string;
  createdAt: any;
}

export interface Lead {
  id: string;
  name: string;
  contact: string;
  email?: string;
  message: string;
  propertyId?: string;
  type: 'visit' | 'quote' | 'announcement';
  status: 'new' | 'contacted' | 'closed';
  createdAt: any;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}
