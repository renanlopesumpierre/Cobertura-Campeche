import React, { useRef, useState } from 'react';
import { FurnitureItem, ViewMode } from '../types';
import DraggableItem from './DraggableItem';

interface FloorPlanProps {
  highlightedZone: string | null;
  onZoneHover: (zoneId: string | null) => void;
  showDimensions: boolean;
  items: FurnitureItem[];
  onUpdateItem: (id: string, x: number, y: number) => void;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  viewMode: ViewMode;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ 
  highlightedZone, 
  onZoneHover, 
  showDimensions,
  items,
  onUpdateItem,
  selectedItemId,
  onSelectItem,
  viewMode
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Scale: 35px = 1m
  const s = 35;
  const startX = 140; 
  const startY = 120;

  // --- COORDINATE CONVERSION ---
  const getSVGCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    
    let clientX, clientY;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  };

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectItem(id); // Select the item
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      const coords = getSVGCoordinates(e);
      // No snap for smoother decorative placement
      onUpdateItem(draggingId, coords.x, coords.y);
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleBackgroundClick = () => {
    onSelectItem(null);
  };

  // --- GEOMETRY CALCULATION ---
  const p3_end = { x: startX, y: startY }; 
  const p4_end = { x: p3_end.x + 2.8 * s, y: p3_end.y };
  const p5_end = { x: p4_end.x, y: p4_end.y - 1.4 * s };
  const p6_end = { x: p5_end.x + 6.0 * s, y: p5_end.y };
  const p7_end = { x: p6_end.x, y: p6_end.y + 3.7 * s }; 
  const p8_end = { x: p7_end.x - 1.9 * s, y: p7_end.y };
  const p9_end = { x: p8_end.x, y: p8_end.y + 3.0 * s };
  const p10_end = { x: p9_end.x + 1.9 * s, y: p9_end.y };
  const p11_end = { x: p10_end.x, y: p10_end.y + 4.6 * s };
  const p12_end = { x: p11_end.x - 1.7 * s, y: p11_end.y };
  const p13_end = { x: p12_end.x, y: p12_end.y + 1.0 * s };
  const p14_end = { x: p13_end.x + 0.5 * s, y: p13_end.y };
  const p15_end = { x: p14_end.x, y: p14_end.y + 3.4 * s };
  const p16_end = { x: p15_end.x - 1.6 * s, y: p15_end.y };
  const p17_end = { x: p16_end.x, y: p16_end.y - 6.1 * s };
  const p18_end = { x: p17_end.x - 4.8 * s, y: p17_end.y };
  const p1_end = { x: p18_end.x, y: p18_end.y - 1.3 * s };
  
  const corrected_p2_end = { x: p3_end.x, y: p1_end.y };
  const corrected_p1_end = { x: corrected_p2_end.x + 0.8 * s, y: p1_end.y };
  const corrected_p18_end = { x: corrected_p1_end.x, y: p17_end.y };

  const points = [
    corrected_p2_end, p3_end, p4_end, p5_end, p6_end, p7_end, p8_end, p9_end, p10_end, 
    p11_end, p12_end, p13_end, p14_end, p15_end, p16_end, p17_end, corrected_p18_end, 
    corrected_p1_end, corrected_p2_end
  ];

  const floorPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Zones
  const zoneTopPath = `M ${p3_end.x},${p7_end.y} L ${p3_end.x},${p3_end.y} L ${p4_end.x},${p4_end.y} L ${p5_end.x},${p5_end.y} L ${p6_end.x},${p6_end.y} L ${p7_end.x},${p7_end.y} L ${p8_end.x},${p8_end.y} Z`;
  const zoneMidPath = `M ${p3_end.x},${p7_end.y} L ${p8_end.x},${p8_end.y} L ${p9_end.x},${p9_end.y} L ${p10_end.x},${p10_end.y} L ${p11_end.x},${p11_end.y} L ${p12_end.x},${p12_end.y} L ${p12_end.x},${p17_end.y} L ${corrected_p18_end.x},${p17_end.y} L ${corrected_p18_end.x},${corrected_p1_end.y} L ${corrected_p2_end.x},${corrected_p2_end.y} L ${p3_end.x},${p7_end.y} Z`;
  const zoneExtPath = `M ${p17_end.x},${p17_end.y} L ${p12_end.x},${p17_end.y} L ${p12_end.x},${p12_end.y} L ${p13_end.x},${p13_end.y} L ${p14_end.x},${p14_end.y} L ${p15_end.x},${p15_end.y} L ${p16_end.x},${p16_end.y} Z`;

  const accentColor = "#4ecdc4";
  const wallColor = viewMode === 'visual' ? "#d1d5db" : "#e8e8ef";
  const dimColor = viewMode === 'visual' ? "#333333" : "#6a6a7a";

  const renderDim = (p1: any, p2: any, label: string, id: number, direction: 'top' | 'bottom' | 'left' | 'right') => {
    if (!showDimensions) return null;
    const offset = 25;
    let dx = 0, dy = 0;
    if (direction === 'top') dy = -offset;
    if (direction === 'bottom') dy = offset;
    if (direction === 'left') dx = -offset;
    if (direction === 'right') dx = offset;

    const x1 = p1.x + dx;
    const y1 = p1.y + dy;
    const x2 = p2.x + dx;
    const y2 = p2.y + dy;
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    
    return (
      <g className="transition-opacity duration-300 pointer-events-none">
        <line x1={p1.x} y1={p1.y} x2={x1} y2={y1} stroke={dimColor} strokeWidth="0.5" opacity="0.3" />
        <line x1={p2.x} y1={p2.y} x2={x2} y2={y2} stroke={dimColor} strokeWidth="0.5" opacity="0.3" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={dimColor} strokeWidth="0.8" />
        <line x1={x1 - (dy?2:0)} y1={y1 - (dx?2:0)} x2={x1 + (dy?2:0)} y2={y1 + (dx?2:0)} stroke={dimColor} strokeWidth="0.8" />
        <line x1={x2 - (dy?2:0)} y1={y2 - (dx?2:0)} x2={x2 + (dy?2:0)} y2={y2 + (dx?2:0)} stroke={dimColor} strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r="7" fill={viewMode === 'visual' ? "#fff" : "#1e1e24"} stroke={dimColor} strokeWidth="1" />
        <text x={cx} y={cy} dy="2.5" fontFamily="'Space Mono', monospace" fontSize="8" fill={viewMode === 'visual' ? '#000' : accentColor} textAnchor="middle">{id}</text>
        <rect x={cx - 14} y={cy + (direction === 'top' ? -18 : direction === 'bottom' ? 10 : 10)} width="28" height="10" rx="2" fill={viewMode === 'visual' ? '#fff' : "#0a0a0f"} opacity="0.8" />
        <text x={cx} y={cy + (direction === 'top' ? -11 : direction === 'bottom' ? 17 : 17)} fontFamily="'DM Sans', sans-serif" fontSize="8" fill={viewMode === 'visual' ? '#000' : '#fff'} textAnchor="middle" fontWeight="500">{label}</text>
      </g>
    );
  };

  const renderInternalDim = (x: number, y: number, label: string) => (
    <g transform={`translate(${x}, ${y})`} className="pointer-events-none">
       <rect x="-16" y="-6" width="32" height="12" rx="2" fill={viewMode === 'visual' ? '#fff' : "#0a0a0f"} opacity="0.7" />
       <text dy="2.5" textAnchor="middle" fontSize="8" fill={viewMode === 'visual' ? '#000' : accentColor} fontFamily="'Space Mono', monospace">{label}</text>
    </g>
 );

 // --- FILLS BASED ON MODE ---
 const getFill = (zone: 'top' | 'jacuzzi' | 'extension') => {
    if (viewMode === 'technical') {
       if (highlightedZone === zone) {
          return zone === 'top' ? '#5aaa5a40' : (zone === 'jacuzzi' ? '#4ecdc415' : '#ff9f4340');
       }
       return zone === 'top' ? '#5aaa5a15' : (zone === 'jacuzzi' ? 'transparent' : '#ff9f4315');
    } else {
       // Visual Mode (Photo Realistic)
       // Grass is in the Top (Gourmet) zone, matching the green zone color.
       if (zone === 'top') return 'url(#grassPattern)';
       return 'url(#porcelainTile)';
    }
 };

  return (
    <svg 
      ref={svgRef}
      viewBox="0 0 550 800" 
      className="w-full h-auto drop-shadow-2xl select-none cursor-crosshair transition-all duration-500"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseDown={handleBackgroundClick}
    >
      <defs>
        {/* Technical Patterns */}
        <pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#ffffff" fillOpacity="0.08" />
        </pattern>
        <pattern id="waterPat" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 0 5 Q 2.5 2.5 5 5 T 10 5" fill="none" stroke="#4ecdc4" strokeWidth="0.8" opacity="0.4" />
        </pattern>

        {/* Visual/Design Patterns - Updated for Photo Realism */}
        
        {/* Large Porcelain Tile (approx 80cm) */}
        <pattern id="porcelainTile" width="28" height="28" patternUnits="userSpaceOnUse">
           <rect width="28" height="28" fill="#f4f3ee" /> {/* Off-white warm beige */}
           <path d="M 0 28 L 28 28 L 28 0" fill="none" stroke="#e0ded8" strokeWidth="0.8" />
           {/* Subtle texture noise */}
           <rect x="5" y="5" width="2" height="2" fill="#e8e6e1" />
           <rect x="20" y="18" width="3" height="3" fill="#e8e6e1" />
        </pattern>

        {/* Vertical Wood Cladding for Jacuzzi */}
        <pattern id="woodSlatPattern" width="6" height="6" patternUnits="userSpaceOnUse">
           <rect width="6" height="6" fill="#8b5e3c" /> {/* Medium Brown */}
           <line x1="0" y1="0" x2="0" y2="6" stroke="#5d3a24" strokeWidth="0.5" />
           <line x1="5.5" y1="0" x2="5.5" y2="6" stroke="#704830" strokeWidth="0.2" opacity="0.5" />
        </pattern>

        {/* Artificial Grass */}
        <pattern id="grassPattern" width="8" height="8" patternUnits="userSpaceOnUse">
           <rect width="8" height="8" fill="#5a8c5a" />
           <path d="M 1 4 L 2 1 L 3 4" stroke="#4a7c4a" strokeWidth="0.5" fill="none"/>
           <path d="M 5 7 L 6 3 L 7 7" stroke="#4a7c4a" strokeWidth="0.5" fill="none"/>
           <rect width="8" height="8" fill="#000" opacity="0.05" />
        </pattern>

        {/* Realistic Water */}
        <pattern id="waterRealPattern" width="20" height="20" patternUnits="userSpaceOnUse">
           <rect width="20" height="20" fill="#a4ebf3" />
           <path d="M 0 10 Q 5 5 10 10 T 20 10" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" />
           <path d="M 0 5 Q 5 0 10 5 T 20 5" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" />
        </pattern>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="550" height="800" fill={viewMode === 'visual' ? '#fcfcfc' : "#0a0a0f"} transition-all duration-500 />
      {viewMode === 'technical' && <rect x="0" y="0" width="550" height="800" fill="url(#grid)" />}

      {/* --- ZONES --- */}
      <path d={zoneTopPath} fill={getFill('top')} className="transition-all duration-300" onMouseEnter={() => onZoneHover('top')} onMouseLeave={() => onZoneHover(null)} />
      <path d={zoneMidPath} fill={getFill('jacuzzi')} className="transition-all duration-300" onMouseEnter={() => onZoneHover('jacuzzi')} onMouseLeave={() => onZoneHover(null)} />
      <path d={zoneExtPath} fill={getFill('extension')} className="transition-all duration-300" onMouseEnter={() => onZoneHover('extension')} onMouseLeave={() => onZoneHover(null)} />

      {/* --- WALLS & RAILINGS --- */}
      {viewMode === 'technical' ? (
        <>
          <path d={floorPath} fill="none" stroke={wallColor} strokeWidth="1" strokeOpacity="0.1" filter="blur(4px)" className="pointer-events-none" />
          <path d={floorPath} fill="none" stroke={wallColor} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className="pointer-events-none" />
        </>
      ) : (
        // Visual Walls -> Glass Railing look
        <g className="pointer-events-none">
          {/* Base curb */}
          <path d={floorPath} fill="none" stroke="#d1d5db" strokeWidth="3" strokeLinecap="square" />
          {/* Glass panels (Blueish transparent) */}
          <path d={floorPath} fill="none" stroke="#aed9e0" strokeWidth="2.5" opacity="0.7" />
          {/* White posts simulation (dash array) */}
          <path d={floorPath} fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="2 40" strokeLinecap="butt" />
        </g>
      )}

      {/* --- STATIC DECORATION --- */}
      {/* Jacuzzi */}
      {(() => {
         const j_size = 2.2 * s;
         const gap_right = 0.8 * s;
         const gap_top = 0.8 * s;
         const j_x = p9_end.x - gap_right - j_size;
         const j_y = p7_end.y + gap_top;
         return (
            <g transform={`translate(${j_x}, ${j_y})`} className="pointer-events-none">
               {viewMode === 'technical' ? (
                 <>
                  <rect width={j_size} height={j_size} rx="2" fill="#1a1a20" stroke={wallColor} strokeWidth="1" />
                  <rect x="4" y="4" width={j_size-8} height={j_size-8} fill="url(#waterPat)" stroke="none" />
                  <rect x="4" y="4" width={j_size-8} height={j_size-8} fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
                 </>
               ) : (
                 <>
                   {/* Visual Mode Jacuzzi - Matching the Photo */}
                   {/* Shadow */}
                   <rect x="2" y="2" width={j_size} height={j_size} rx="2" fill="black" opacity="0.2" filter="blur(3px)" />
                   
                   {/* Wood Cladding (Vertical Slats) */}
                   <rect width={j_size} height={j_size} rx="4" fill="url(#woodSlatPattern)" stroke="#5d3a24" strokeWidth="0.5" />
                   
                   {/* White Acrylic Shell Rim */}
                   <rect x="6" y="6" width={j_size-12} height={j_size-12} rx="8" fill="#fdfdfd" stroke="#e5e5e5" strokeWidth="1" />
                   
                   {/* Water Area */}
                   <rect x="14" y="14" width={j_size-28} height={j_size-28} rx="6" fill="url(#waterRealPattern)" stroke="#88dbe6" strokeWidth="1" />
                   
                   {/* Headrests (White pillows) - Seen in photo */}
                   <rect x={j_size/2 - 8} y="8" width="16" height="6" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
                   <rect x={j_size/2 - 8} y={j_size - 14} width="16" height="6" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
                   <rect x={8} y={j_size/2 - 8} width="6" height="16" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
                   <rect x={j_size - 14} y={j_size/2 - 8} width="6" height="16" rx="3" fill="#fff" stroke="#ddd" strokeWidth="0.5" />

                   {/* Bubbles/Jets */}
                   <circle cx="20" cy="20" r="1.5" fill="#fff" opacity="0.6" />
                   <circle cx={j_size-20} cy="20" r="1.5" fill="#fff" opacity="0.6" />
                   <circle cx="20" cy={j_size-20} r="1.5" fill="#fff" opacity="0.6" />
                   <circle cx={j_size-20} cy={j_size-20} r="1.5" fill="#fff" opacity="0.6" />
                 </>
               )}
               
               <path d={`M ${j_size/2} -2 L ${j_size/2} -${gap_top-2}`} stroke={dimColor} strokeWidth="0.5" strokeDasharray="2 2" />
               {renderInternalDim(j_size/2, -gap_top/2, "0.80") }
               <path d={`M ${j_size+2} ${j_size/2} L ${j_size+gap_right-2} ${j_size/2}`} stroke={dimColor} strokeWidth="0.5" strokeDasharray="2 2" />
               {renderInternalDim(j_size + gap_right/2, j_size/2, "0.80") }
               {viewMode === 'technical' && <text x={j_size/2} y={j_size/2} dy="3" textAnchor="middle" fontSize="8" fill="#fff" opacity="0.7" fontFamily="'Space Mono', monospace">2.20</text>}
            </g>
         )
      })()}

      {/* --- DYNAMIC FURNITURE --- */}
      {items.map(item => (
        <DraggableItem 
          key={item.id} 
          item={item} 
          isDragging={draggingId === item.id}
          isSelected={selectedItemId === item.id}
          onMouseDown={(e) => handleMouseDown(item.id, e)}
          viewMode={viewMode}
        />
      ))}

      {/* --- EXTERNAL DIMENSIONS --- */}
      {renderDim(corrected_p2_end, p3_end, "6.50", 3, 'left')}
      {renderDim(p3_end, p4_end, "2.80", 4, 'top')}
      {renderDim(p4_end, p5_end, "1.40", 5, 'left')}
      {renderDim(p5_end, p6_end, "6.00", 6, 'top')}
      {renderDim(p6_end, p7_end, "3.70", 7, 'right')}
      {renderDim(p7_end, p8_end, "1.90", 8, 'bottom')}
      {renderDim(p8_end, p9_end, "3.00", 9, 'left')}
      {renderDim(p9_end, p10_end, "1.90", 10, 'top')}
      {renderDim(p10_end, p11_end, "4.60", 11, 'right')}
      {renderDim(p11_end, p12_end, "1.70", 12, 'top')}
      {renderDim(p12_end, p13_end, "1.00", 13, 'left')}
      {renderDim(p13_end, p14_end, "0.50", 14, 'top')}
      {renderDim(p14_end, p15_end, "3.40", 15, 'right')}
      {renderDim(p15_end, p16_end, "1.60", 16, 'bottom')}
      {renderDim(p16_end, p17_end, "6.10", 17, 'left')}
      {renderDim(p17_end, corrected_p18_end, "4.80", 18, 'bottom')}
      {renderDim(corrected_p18_end, corrected_p1_end, "1.30", 1, 'left')}
      {renderDim(corrected_p1_end, corrected_p2_end, "0.80", 2, 'top')}

      {/* Compass */}
      <g transform="translate(480, 80)" className="pointer-events-none">
         <circle r="18" fill="none" stroke={dimColor} strokeWidth="1"/>
         <path d="M 0 -12 L -4 0 L 4 0 Z" fill={viewMode === 'visual' ? '#222' : accentColor} />
         <path d="M 0 12 L -4 0 L 4 0 Z" fill="none" stroke={viewMode === 'visual' ? '#222' : accentColor} strokeWidth="1" />
         <text x="0" y="-20" fontFamily="'Space Mono', monospace" fontSize="10" fill={viewMode === 'visual' ? '#222' : accentColor} textAnchor="middle">N</text>
      </g>
    </svg>
  );
};

export default FloorPlan;