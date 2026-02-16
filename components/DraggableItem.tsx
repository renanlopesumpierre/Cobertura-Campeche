import React from 'react';
import { FurnitureItem, ViewMode } from '../types';

interface DraggableItemProps {
  item: FurnitureItem;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
  isSelected: boolean;
  viewMode?: ViewMode; // Optional to not break prev code, but we will pass it
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, onMouseDown, isDragging, isSelected, viewMode = 'technical' }) => {
  const { type, x, y, rotation, scale, visible } = item;
  
  // -- COLORS BASED ON MODE --
  const isVisual = viewMode === 'visual';

  // --- Visual Mode Palette (Wood & Earthy Tones matching photos) ---
  const woodColor = '#8b5a2b';     // Reddish/Warm brown wood
  const woodStroke = '#5e3c1b';    // Darker wood outline
  const cushionColor = '#e3e3e3';  // Light grey/off-white cushion
  const cushionStroke = '#cccccc';
  const umbrellaColor = '#b58e65'; // Beige/Brown (Earth tone)
  const metalColor = '#222222';    // For light fixtures

  // --- Technical Mode Colors ---
  let strokeColor = isSelected ? '#4ecdc4' : (isDragging ? '#ffffff' : (visible ? '#e8e8ef' : '#444444'));
  let fillColor = isDragging || isSelected ? '#1a1a24' : (visible ? '#12121a' : 'transparent');

  // Override for Visual Mode base defaults
  if (isVisual) {
     strokeColor = isSelected ? '#4ecdc4' : '#333333'; 
     fillColor = visible ? '#ffffff' : 'transparent'; 
  }

  const shadow = isDragging ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.5))' : (isVisual && visible ? 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3))' : '');
  const opacity = isDragging ? 0.9 : (visible ? 1 : 0.15); 
  const dashArray = !visible ? "4 4" : "none";

  let content = null;

  switch (type) {
    case 'table4':
      content = (
        <g>
           {/* Wooden Table Top with Slats */}
           <rect x="-18" y="-18" width="36" height="36" rx={isVisual?1:0} fill={isVisual ? woodColor : 'none'} stroke={isVisual ? woodStroke : strokeColor} strokeWidth={isVisual?0.5:1.5} strokeDasharray={dashArray} />
           {isVisual && (
             <>
               {/* Wood slats vertical texture */}
               <line x1="-9" y1="-18" x2="-9" y2="18" stroke={woodStroke} strokeWidth="0.5" opacity="0.4" />
               <line x1="0" y1="-18" x2="0" y2="18" stroke={woodStroke} strokeWidth="0.5" opacity="0.4" />
               <line x1="9" y1="-18" x2="9" y2="18" stroke={woodStroke} strokeWidth="0.5" opacity="0.4" />
             </>
           )}

           {/* Wooden Chairs */}
           {[
             {x: -10, y: -26, w: 20, h: 8}, // Top
             {x: -10, y: 18, w: 20, h: 8},  // Bottom
             {x: -26, y: -10, w: 8, h: 20}, // Left
             {x: 18, y: -10, w: 8, h: 20}   // Right
           ].map((c, i) => (
             <g key={i}>
                <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={isVisual?1:0} fill={isVisual ? woodColor : fillColor} stroke={isVisual ? woodStroke : strokeColor} strokeWidth={isVisual?0.5:1.2} strokeDasharray={dashArray} />
                {/* Small cushion on chair */}
                {isVisual && <rect x={c.x + 1} y={c.y + 1} width={c.w - 2} height={c.h - 2} rx={1} fill={cushionColor} />}
             </g>
           ))}
        </g>
      );
      break;

    case 'coffeeTable':
       content = (
          <g>
             <rect x="-15" y="-10" width="30" height="20" rx={isVisual?1:0} fill={isVisual ? woodColor : fillColor} stroke={isVisual ? woodStroke : strokeColor} strokeWidth={isVisual?0.5:1.5} strokeDasharray={dashArray} />
             {/* Wood slats horizontal */}
             {isVisual && (
               <>
                  <line x1="-15" y1="0" x2="15" y2="0" stroke={woodStroke} strokeWidth="0.5" opacity="0.4" />
                  <line x1="-15" y1="-5" x2="15" y2="-5" stroke={woodStroke} strokeWidth="0.5" opacity="0.4" />
                  <line x1="-15" y1="5" x2="15" y2="5" stroke={woodStroke} strokeWidth="0.5" opacity="0.4" />
               </>
             )}
             {!isVisual && <rect x="-12" y="-7" width="24" height="14" fill="none" stroke={strokeColor} strokeWidth="0.5" strokeDasharray={dashArray} />}
          </g>
       );
       break;

    case 'chair':
       content = (
          <g>
             {/* Wooden Frame */}
             <rect x="-12" y="-12" width="24" height="24" rx={isVisual?1:4} fill={isVisual ? woodColor : fillColor} stroke={isVisual ? woodStroke : strokeColor} strokeWidth={isVisual?0.5:1.5} strokeDasharray={dashArray} />
             {/* Backrest curve simulation */}
             {isVisual && <path d="M -12 -8 L -12 -12 L 12 -12 L 12 -8" stroke={woodStroke} strokeWidth="1" fill="none" />}
             {/* Cushion */}
             <rect x="-10" y="-10" width="20" height="20" rx={2} fill={isVisual ? cushionColor : 'none'} stroke={isVisual ? cushionStroke : 'none'} strokeWidth="0.5" />
             {!isVisual && <path d="M -8 2 L 8 2" stroke={strokeColor} strokeWidth="1" strokeDasharray={dashArray} />}
          </g>
       );
       break;

    case 'umbrella':
      // Beige/Brown Octagon (Reference: JPEG 1)
      content = (
        <g>
          <path d="M -7 -16 L 7 -16 L 16 -7 L 16 7 L 7 16 L -7 16 L -16 7 L -16 -7 Z" fill={isVisual ? umbrellaColor : fillColor} stroke={isVisual ? '#8a6a4b' : strokeColor} strokeWidth={isVisual?0.5:1.5} strokeDasharray={dashArray} />
          {/* Ribs */}
          <line x1="0" y1="-16" x2="0" y2="16" stroke={isVisual ? 'rgba(0,0,0,0.15)' : strokeColor} strokeWidth="0.5" strokeDasharray={dashArray} />
          <line x1="-16" y1="0" x2="16" y2="0" stroke={isVisual ? 'rgba(0,0,0,0.15)' : strokeColor} strokeWidth="0.5" strokeDasharray={dashArray} />
          <line x1="-11" y1="-11" x2="11" y2="11" stroke={isVisual ? 'rgba(0,0,0,0.15)' : strokeColor} strokeWidth="0.5" strokeDasharray="none" />
          <line x1="11" y1="-11" x2="-11" y2="11" stroke={isVisual ? 'rgba(0,0,0,0.15)' : strokeColor} strokeWidth="0.5" strokeDasharray="none" />
          <circle r="1.5" fill={isVisual ? '#5c4033' : strokeColor} />
        </g>
      );
      break;

    case 'lounger':
      content = (
         <g>
            {/* Wooden Frame */}
            <rect x="-10" y="-25" width="20" height="50" rx={2} fill={isVisual ? woodColor : fillColor} stroke={isVisual ? woodStroke : strokeColor} strokeWidth={isVisual?0.5:1.2} strokeDasharray={dashArray} />
            
            {isVisual ? (
               <>
                 {/* Wood Slats Texture under cushion */}
                 <line x1="-10" y1="-15" x2="10" y2="-15" stroke={woodStroke} strokeWidth="0.5" opacity="0.6" />
                 <line x1="-10" y1="-5" x2="10" y2="-5" stroke={woodStroke} strokeWidth="0.5" opacity="0.6" />
                 <line x1="-10" y1="5" x2="10" y2="5" stroke={woodStroke} strokeWidth="0.5" opacity="0.6" />
                 <line x1="-10" y1="15" x2="10" y2="15" stroke={woodStroke} strokeWidth="0.5" opacity="0.6" />
                 
                 {/* Cushion (Full length light cushion showing wood edges) */}
                 <rect x="-8" y="-23" width="16" height="46" rx={2} fill={cushionColor} stroke={cushionStroke} strokeWidth="0.5" />
                 {/* Pillow line */}
                 <line x1="-8" y1="-12" x2="8" y2="-12" stroke={cushionStroke} strokeWidth="0.5" />
               </>
            ) : (
               <>
                 <rect x="-11" y="-25" width="22" height="50" rx="4" fill="none" stroke="none" />
                 <line x1="-10" y1="-5" x2="10" y2="-5" stroke={strokeColor} strokeWidth="1" strokeDasharray={dashArray} />
               </>
            )}
         </g>
      );
      break;

    case 'sofa':
      content = (
        <g>
           {/* Wood Frame */}
           <rect x="-25" y="-12" width="50" height="24" rx={2} fill={isVisual ? woodColor : fillColor} stroke={isVisual ? woodStroke : strokeColor} strokeWidth={isVisual?0.5:1.5} strokeDasharray={dashArray} />
           {/* Visual cushions */}
           {isVisual && (
              <>
               <rect x="-23" y="-10" width="22" height="20" rx={2} fill={cushionColor} stroke={cushionStroke} strokeWidth="0.5" />
               <rect x="1" y="-10" width="22" height="20" rx={2} fill={cushionColor} stroke={cushionStroke} strokeWidth="0.5" />
               {/* Wood Armrest Details */}
               <rect x="-25" y="-12" width="2" height="24" fill={woodColor} stroke="none" />
               <rect x="23" y="-12" width="2" height="24" fill={woodColor} stroke="none" />
               <rect x="-25" y="-12" width="50" height="2" fill={woodColor} stroke="none" />
              </>
           )}
           {!isVisual && <line x1="-25" y1="0" x2="25" y2="0" stroke="#6a6a7a" strokeWidth="0.5" />}
        </g>
      );
      break;

    case 'lights':
      content = (
        <g>
          <circle r="4" fill={isVisual ? metalColor : strokeColor} />
          <line x1="0" y1="0" x2="0" y2="-20" stroke={strokeColor} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="0" cy="-20" r="2" fill={isVisual ? '#ffd700' : "none"} stroke={strokeColor} strokeWidth="1" />
          <text y="10" textAnchor="middle" fontSize="6" fill="#6a6a7a" fontFamily="monospace">LUZ</text>
        </g>
      );
      break;
      
    case 'stringLights':
      content = (
         <g>
            <line x1="-50" y1="0" x2="50" y2="0" stroke={isVisual ? '#333' : strokeColor} strokeWidth={1.5} strokeDasharray={dashArray} />
            {[ -40, -20, 0, 20, 40 ].map((bx, i) => (
               <circle key={i} cx={bx} cy={0} r={isVisual ? 3 : 2} fill={isVisual ? '#ffcc00' : strokeColor} stroke={isVisual ? '#ff9900' : 'none'} strokeWidth="0.5" />
            ))}
         </g>
      );
      break;
      
    case 'plant':
      // Green shrub
      content = (
        <g>
           <circle r="8" fill={isVisual ? '#3d6e3d' : "none"} stroke={strokeColor} strokeWidth={1} strokeDasharray={dashArray} />
           {isVisual && <circle r="6" fill="#4a8a4a" opacity="0.7" />}
           <path d="M 0 0 L 6 -6 M 0 0 L -6 -6 M 0 0 L 6 6 M 0 0 L -6 6 M 0 0 L 0 -8 M 0 0 L 0 8 M 0 0 L 8 0 M 0 0 L -8 0" stroke={isVisual ? "#2d5a2d" : (visible ? "#5aaa5a" : strokeColor)} strokeWidth="1" strokeDasharray={dashArray} />
        </g>
      );
      break;

    case 'hammock':
      content = (
         <g>
            <circle cx="-35" cy="0" r="2" fill={visible ? "#6a6a7a" : strokeColor} />
            <circle cx="35" cy="0" r="2" fill={visible ? "#6a6a7a" : strokeColor} />
            <line x1="-35" y1="0" x2="-25" y2="0" stroke={strokeColor} strokeWidth="1" strokeDasharray={dashArray} />
            <line x1="35" y1="0" x2="25" y2="0" stroke={strokeColor} strokeWidth="1" strokeDasharray={dashArray} />
            
            {/* Canvas hammock */}
            <path d="M -25 -10 Q -15 0 -25 10 L 25 10 Q 15 0 25 -10 Z" fill={isVisual ? '#e8e6e1' : fillColor} stroke={isVisual ? '#999' : strokeColor} strokeWidth={1.5} strokeDasharray={dashArray} />
            {isVisual && <path d="M -20 -5 L 20 -5 M -20 0 L 20 0 M -20 5 L 20 5" stroke="#d1d1d1" strokeWidth="0.5" />}
         </g>
      );
      break;
  }

  return (
    <g 
      transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`} 
      onMouseDown={onMouseDown} 
      className="cursor-move transition-all duration-300"
      style={{ filter: shadow, opacity }}
    >
      {isSelected && (
         <circle r="40" fill="none" stroke="#4ecdc4" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" className="animate-pulse" />
      )}
      {content}
    </g>
  );
};

export default DraggableItem;