import React from 'react';
import { Zone } from '../types';
import { ChevronRight } from 'lucide-react';

interface ZoneCardProps {
  zone: Zone;
  isActive: boolean;
  onHover: (id: string | null) => void;
}

const ZoneCard: React.FC<ZoneCardProps> = ({ zone, isActive, onHover }) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl border p-4 transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'bg-blueprint-surface border-blueprint-accent shadow-[0_0_15px_rgba(78,205,196,0.1)]' 
          : 'bg-blueprint-surface/50 border-blueprint-line hover:border-blueprint-dim'}
      `}
      onMouseEnter={() => onHover(zone.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${isActive ? 'bg-blueprint-accent' : 'bg-transparent'}`} />
      
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-[10px] tracking-widest text-blueprint-accent uppercase">
          {zone.id}
        </span>
        {isActive && <ChevronRight className="w-4 h-4 text-blueprint-accent animate-pulse" />}
      </div>
      
      <h3 className="text-sm font-medium text-white mb-1">{zone.name}</h3>
      <p className="text-xs text-blueprint-dim leading-relaxed mb-3">{zone.description}</p>
      
      {zone.area && (
        <div className="mt-auto pt-2 border-t border-blueprint-line/50 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }}></div>
           <span className="font-mono text-[10px] text-gray-400">{zone.area}</span>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;