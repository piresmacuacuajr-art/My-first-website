import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer, Cluster } from '@googlemaps/markerclusterer';
import { Property } from '../types';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface MapSectionProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
}

const MarkerWithInfoWindow: React.FC<{
  property: Property;
  onClick: () => void;
  setMarkerRef: (marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => void;
}> = ({ property, onClick, setMarkerRef }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  if (!property.coordinates) return null;

  const combinedRef = useCallback(
    (el: google.maps.marker.AdvancedMarkerElement | null) => {
      markerRef(el);
      setMarkerRef(el, property.id);
    },
    [markerRef, setMarkerRef, property.id]
  );

  return (
    <>
      <AdvancedMarker
        ref={combinedRef}
        position={property.coordinates}
        onClick={() => setOpen(true)}
      >
        <Pin background="#0b1a30" glyphColor="#d4af37" borderColor="#d4af37" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-2 min-w-[200px] max-w-[240px]">
            <img 
              src={property.images[0]} 
              alt={property.title} 
              className="w-full h-32 object-cover rounded-xl mb-3"
            />
            <h3 className="font-black text-gray-900 leading-tight mb-1 text-sm">{property.title}</h3>
            <p className="text-blue-600 font-bold text-sm mb-2">
              {property.price.toLocaleString('pt-MZ')} MZN
            </p>
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
               <span className="flex items-center gap-1"><Bed size={12} /> {property.bedrooms}</span>
               <span className="flex items-center gap-1"><Bath size={12} /> {property.bathrooms}</span>
               <span className="flex items-center gap-1"><Maximize size={12} /> {property.area}m²</span>
            </div>
            <button 
              onClick={() => {
                setOpen(false);
                onClick();
              }}
              className="w-full mt-3 py-2 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-navy transition-all"
            >
              Ver Detalhes
            </button>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const MapInner: React.FC<{
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  defaultCenter: { lat: number; lng: number };
}> = ({ properties, onPropertyClick, defaultCenter }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});

  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({
      map,
      renderer: {
        render: (cluster: Cluster) => {
          const { count, position } = cluster;

          const container = document.createElement('div');
          container.className = 'relative flex items-center justify-center rounded-full font-black text-white shadow-xl transition-all hover:scale-105 cursor-pointer backdrop-blur-sm border-2 border-[#d4af37]/50';

          const size = count < 5 ? 44 : count < 15 ? 52 : 60;
          container.style.width = `${size}px`;
          container.style.height = `${size}px`;

          // Modernized styling
          container.style.background = 'linear-gradient(135deg, rgba(11, 26, 48, 0.9) 0%, rgba(30, 58, 138, 0.9) 100%)';
          container.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.2)';

          const textSpan = document.createElement('span');
          textSpan.className = 'text-sm tracking-tight';
          textSpan.innerText = String(count);
          container.appendChild(textSpan);

          const pulseDiv = document.createElement('div');
          pulseDiv.className = 'absolute inset-0 rounded-full bg-[#d4af37] animate-ping opacity-10 -z-10';
          container.appendChild(pulseDiv);

          return new google.maps.marker.AdvancedMarkerElement({
            position,
            content: container,
            zIndex: 2000 + count,
          });
        }
      }
    });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));

    return () => {
      clusterer.clearMarkers();
    };
  }, [clusterer, markers]);

  const setMarkerRef = useCallback((marker: google.maps.marker.AdvancedMarkerElement | null, key: string) => {
    setMarkers(prev => {
      if (marker) {
        if (prev[key] === marker) return prev;
        return { ...prev, [key]: marker };
      } else {
        if (!prev[key]) return prev;
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });
  }, []);

  const mapProperties = properties.filter(p => p.coordinates);

  return (
    <Map
      defaultCenter={defaultCenter}
      defaultZoom={12}
      mapId="e25d6e4666cd453e"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
      gestureHandling="greedy"
      disableDefaultUI={false}
    >
      {mapProperties.map(property => (
        <MarkerWithInfoWindow 
          key={property.id} 
          property={property} 
          onClick={() => onPropertyClick?.(property)}
          setMarkerRef={setMarkerRef}
        />
      ))}
    </Map>
  );
};

export const MapSection: React.FC<MapSectionProps> = ({ properties, onPropertyClick }) => {
  if (!hasValidKey) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-[3rem] flex items-center justify-center p-12 border-4 border-dashed border-gray-200">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-xl mx-auto mb-8">
            <MapPin size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Configuração do Mapa Necessária</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Para visualizar o mapa interativo, é necessário configurar uma chave da API do Google Maps Platform.
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-sm text-left space-y-4 border border-gray-100">
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px]">1</span>
              Obtenha uma chave no Google Cloud Console
            </p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px]">2</span>
              Adicione como segredo: <code className="bg-gray-100 px-2 py-1 rounded">GOOGLE_MAPS_PLATFORM_KEY</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default center: Maputo
  const defaultCenter = { lat: -25.9667, lng: 32.5833 };
  const mapProperties = properties.filter(p => p.coordinates);

  return (
    <div className="w-full h-[600px] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <MapInner 
          properties={properties} 
          onPropertyClick={onPropertyClick} 
          defaultCenter={defaultCenter} 
        />
      </APIProvider>
      
      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-xl flex items-center gap-3">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
          {mapProperties.length} Imóveis no Mapa
        </span>
      </div>
    </div>
  );
};
