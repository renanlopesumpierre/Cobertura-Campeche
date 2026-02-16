import React, { useState, useRef, useEffect } from 'react';
import FloorPlan from './components/FloorPlan';
import ZoneCard from './components/ZoneCard';
import { Zone, FurnitureItem, FurnitureType, ViewMode } from './types';
import { Ruler, Maximize2, Map, Layers, Info, Armchair, Sun, Lightbulb, Flower, Monitor, Trash2, RotateCw, ZoomIn, Coffee, Sofa, Moon, GitCommit, Eye, EyeOff } from 'lucide-react';

const ZONES: Zone[] = [
  {
    id: 'top',
    name: 'Área Gourmet',
    description: 'Setor superior plano com paisagismo lateral (h=2.30m). Ideal para mesa de jantar e circulação.',
    area: '~29m²',
    color: '#5aaa5a'
  },
  {
    id: 'jacuzzi',
    name: 'Área Social',
    description: 'SPA de 2.20m² centralizado com circulações técnicas de 0.80m.',
    area: '~22m²',
    color: '#4ecdc4'
  },
  {
    id: 'extension',
    name: 'Área da Rede',
    description: 'Espaço de relaxamento e leitura, ideal para redário. Piso revestido.',
    area: '~11m²',
    color: '#ff9f43'
  }
];

const INITIAL_ITEMS: FurnitureItem[] = [
  { id: '1', type: 'table4', x: 250, y: 150, rotation: 0, scale: 1, visible: true }
];

const App: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [showDimensions, setShowDimensions] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('technical');
  const [items, setItems] = useState<FurnitureItem[]>(INITIAL_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (type: FurnitureType) => {
    const newItem: FurnitureItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: 275, 
      y: 400, 
      rotation: 0,
      scale: 1,
      visible: true
    };
    setItems([...items, newItem]);
    setSelectedItemId(newItem.id); // Select newly added item
  };

  const handleUpdateItem = (id: string, x: number, y: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
  };

  const handleUpdateProperty = (prop: 'rotation' | 'scale', value: number) => {
    if (!selectedItemId) return;
    setItems(prev => prev.map(item => 
       item.id === selectedItemId ? { ...item, [prop]: value } : item
    ));
  };

  const handleToggleVisibility = () => {
    if (!selectedItemId) return;
    setItems(prev => prev.map(item => 
       item.id === selectedItemId ? { ...item, visible: !item.visible } : item
    ));
  };

  const handleDeleteItem = () => {
    if (!selectedItemId) return;
    setItems(prev => prev.filter(item => item.id !== selectedItemId));
    setSelectedItemId(null);
  };

  // Keyboard shortcut for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItemId) {
        handleDeleteItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      appRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Helper to find selected item
  const selectedItem = items.find(i => i.id === selectedItemId);

  return (
    <div ref={appRef} className="min-h-screen bg-blueprint-bg flex flex-col items-center py-8 px-4 md:px-8 overflow-y-auto">
      
      {/* Header */}
      <header className="max-w-6xl w-full mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <Map className="w-5 h-5 text-blueprint-accent" />
             <h1 className="font-mono text-xs tracking-[0.2em] text-blueprint-accent uppercase">Projeto Executivo</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">Terraço Cobertura — Campeche</h2>
          <p className="font-mono text-[10px] text-blueprint-dim mt-2">STUDIO DE CRIAÇÃO • CLIQUE E DELETE PARA REMOVER</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2 bg-blueprint-surface p-1 rounded-lg border border-blueprint-line">
           <button 
             onClick={() => setViewMode(prev => prev === 'technical' ? 'visual' : 'technical')}
             className={`p-2 rounded md:px-4 flex items-center gap-2 text-xs font-mono transition-all ${viewMode === 'visual' ? 'bg-blueprint-accent text-blueprint-bg font-bold' : 'text-blueprint-dim hover:text-white'}`}
             title={viewMode === 'technical' ? "Mudar para Visual Humanizado" : "Mudar para Planta Técnica"}
           >
             <Layers className="w-4 h-4" />
             <span className="hidden md:inline">{viewMode === 'technical' ? 'Técnico' : 'Humanizado'}</span>
           </button>
           <div className="w-px bg-blueprint-line my-1 mx-1"></div>
           <button 
             onClick={() => setShowDimensions(!showDimensions)}
             className={`p-2 rounded md:px-4 flex items-center gap-2 text-xs font-mono transition-all ${showDimensions ? 'bg-blueprint-line text-white' : 'text-blueprint-dim hover:text-white'}`}
           >
             <Ruler className="w-4 h-4" />
             <span className="hidden md:inline">Dimensões</span>
           </button>
           <div className="w-px bg-blueprint-line my-1 mx-1"></div>
           <button 
             onClick={toggleFullScreen}
             className="p-2 rounded text-blueprint-dim hover:text-white hover:bg-blueprint-line/50 transition-colors" 
             title="Tela Inteira"
           >
             <Maximize2 className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Toolbox (Fixed z-index to show tooltips above canvas) */}
        <div className="lg:col-span-1 flex flex-col gap-2 order-2 lg:order-1 relative z-50">
           <div className="bg-blueprint-surface rounded-xl border border-blueprint-line p-2 flex flex-col gap-2 items-center sticky top-8 shadow-xl">
              <span className="text-[10px] font-mono text-blueprint-dim mb-2 rotate-180 lg:rotate-0" style={{writingMode: 'vertical-rl'}}>MOBILIÁRIO</span>
              
              <ToolButton icon={<Monitor className="w-5 h-5" />} label="Mesa Jantar" onClick={() => handleAddItem('table4')} />
              <ToolButton icon={<Coffee className="w-5 h-5" />} label="Mesa Centro" onClick={() => handleAddItem('coffeeTable')} />
              <ToolButton icon={<Sofa className="w-5 h-5" />} label="Sofá" onClick={() => handleAddItem('sofa')} />
              <ToolButton icon={<Armchair className="w-5 h-5" />} label="Poltrona" onClick={() => handleAddItem('chair')} />
              <ToolButton icon={<Moon className="w-5 h-5" />} label="Rede" onClick={() => handleAddItem('hammock')} />
              <ToolButton icon={<Layers className="w-5 h-5" />} label="Espreg." onClick={() => handleAddItem('lounger')} />
              <ToolButton icon={<Sun className="w-5 h-5" />} label="Ombrelone" onClick={() => handleAddItem('umbrella')} />
              <ToolButton icon={<Lightbulb className="w-5 h-5" />} label="Luz Poste" onClick={() => handleAddItem('lights')} />
              <ToolButton icon={<GitCommit className="w-5 h-5" />} label="Varal de Luz" onClick={() => handleAddItem('stringLights')} />
              <ToolButton icon={<Flower className="w-5 h-5" />} label="Planta" onClick={() => handleAddItem('plant')} />
           </div>
        </div>

        {/* Center: Floor Plan Visualization */}
        <div className="lg:col-span-8 order-1 lg:order-2 relative group z-0">
           
           {/* Floor Plan Container */}
           <div className="bg-blueprint-surface rounded-2xl border border-blueprint-line p-1 relative overflow-hidden shadow-2xl transition-colors duration-500">
             {/* Subtle glass reflection effect */}
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none z-10" />
             
             <div className="p-4 md:p-8 overflow-auto flex justify-center items-center min-h-[700px]">
               <FloorPlan 
                 viewMode={viewMode}
                 highlightedZone={activeZone} 
                 onZoneHover={setActiveZone} 
                 showDimensions={showDimensions}
                 items={items}
                 onUpdateItem={handleUpdateItem}
                 selectedItemId={selectedItemId}
                 onSelectItem={setSelectedItemId}
               />
             </div>

             <div className="absolute bottom-4 left-4 z-20 flex gap-4 pointer-events-none">
                <div className="bg-black/80 backdrop-blur text-white text-[10px] font-mono px-3 py-1 rounded-full border border-blueprint-line flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${viewMode === 'visual' ? 'bg-blueprint-accent' : 'bg-green-500'}`}></span>
                  MODO: {viewMode === 'visual' ? 'HUMANIZADO' : 'TÉCNICO'}
                </div>
             </div>
           </div>

           {/* Floating Property Panel (Only shows when item selected) */}
           {selectedItem && (
             <div className="absolute top-4 right-4 z-30 bg-black/90 backdrop-blur border border-blueprint-accent/50 p-4 rounded-xl shadow-2xl w-64 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
                   <span className="text-xs font-mono text-blueprint-accent uppercase tracking-wider">Propriedades</span>
                   <div className="flex gap-2">
                      <button 
                        onClick={handleToggleVisibility} 
                        className={`transition-colors ${selectedItem.visible ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500 hover:text-gray-300'}`} 
                        title={selectedItem.visible ? "Ocultar Item" : "Mostrar Item"}
                      >
                         {selectedItem.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={handleDeleteItem} className="text-red-400 hover:text-red-300 transition-colors" title="Deletar">
                          <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                <div className={`space-y-4 transition-opacity duration-200 ${selectedItem.visible ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                   <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                         <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> ROTAÇÃO</span>
                         <span>{Math.round(selectedItem.rotation)}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="360" 
                        value={selectedItem.rotation} 
                        onChange={(e) => handleUpdateProperty('rotation', parseInt(e.target.value))}
                        disabled={!selectedItem.visible}
                        className="w-full h-1 bg-blueprint-line rounded-lg appearance-none cursor-pointer accent-blueprint-accent"
                      />
                   </div>

                   <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                         <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> ESCALA</span>
                         <span>{selectedItem.scale.toFixed(1)}x</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" max="3.0" step="0.1"
                        value={selectedItem.scale} 
                        onChange={(e) => handleUpdateProperty('scale', parseFloat(e.target.value))}
                        disabled={!selectedItem.visible}
                        className="w-full h-1 bg-blueprint-line rounded-lg appearance-none cursor-pointer accent-blueprint-accent"
                      />
                      {!selectedItem.visible && <p className="text-[9px] text-yellow-500 text-center pt-1">Item oculto (Modo Fantasma)</p>}
                   </div>
                </div>
             </div>
           )}

        </div>

        {/* Right: Info Panel & Legend */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          
          {/* Legend Box */}
          <div className="bg-blueprint-surface rounded-xl border border-blueprint-line p-5">
            <h3 className="text-xs font-mono text-blueprint-dim uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info className="w-3 h-3" /> Legenda
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
               <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 border ${viewMode === 'visual' ? 'bg-gray-800' : 'bg-blueprint-bg'} border-gray-500`}></div>
                 <span>Alvenaria</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 border border-dashed border-gray-500"></div>
                 <span>Guarda-corpo</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 ${viewMode === 'visual' ? 'bg-[#4ecdc4]' : 'bg-[#4ecdc4] opacity-30'}`}></div>
                 <span>Água / Spa</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 ${viewMode === 'visual' ? 'bg-[#5aaa5a]' : 'bg-[#5aaa5a] opacity-30'}`}></div>
                 <span>Paisagismo</span>
               </div>
               {viewMode === 'visual' && (
                  <>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#d4a373]"></div>
                        <span>Deck Madeira</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#f0f0f5]"></div>
                        <span>Porcelanato</span>
                     </div>
                  </>
               )}
            </div>
          </div>

          {/* Zones List */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono text-blueprint-dim uppercase tracking-widest pl-1">Setores</h3>
            {ZONES.map(zone => (
              <ZoneCard 
                key={zone.id} 
                zone={zone} 
                isActive={activeZone === zone.id}
                onHover={setActiveZone}
              />
            ))}
          </div>

          {/* Instructions */}
          <div className="mt-auto p-4 border border-blueprint-line/30 rounded-lg bg-blueprint-bg/50">
             <p className="text-[10px] text-blueprint-dim font-mono leading-relaxed">
               MODO VISUAL: Agora você pode alternar entre a planta técnica e a versão humanizada com texturas reais de piso, deck e móveis coloridos usando o botão no topo.
             </p>
          </div>

        </div>
      </main>
    </div>
  );
};

const ToolButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-lg bg-blueprint-bg border border-blueprint-line hover:border-blueprint-accent hover:text-blueprint-accent text-blueprint-dim transition-all group relative"
    title={label}
  >
    {icon}
    <span className="text-[8px] font-mono hidden lg:block opacity-0 group-hover:opacity-100 absolute left-full ml-2 bg-black px-2 py-1 rounded border border-blueprint-line z-[60] whitespace-nowrap pointer-events-none transition-opacity">
      {label}
    </span>
  </button>
);

export default App;