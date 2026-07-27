import { useState, useRef } from 'react';

export default function ImageZoomModal({ src, alt, onClose, isFBI }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Gestion du zoom à la molette
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.25 : 0.8;
    setScale((prevScale) => {
      const newScale = prevScale * zoomFactor;
      return Math.min(Math.max(newScale, 1), 5); // Zoom min 1x, max 5x
    });
  };

  // Gestion du glisser-déplacer (Drag/Pan)
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Re-centrer / Réinitialiser
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Double-clic pour zoomer rapidement à 2.5x ou réinitialiser
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  const themeControls = isFBI
    ? "bg-cyan-950/80 text-cyan-400 border-cyan-800 hover:bg-cyan-900 font-mono"
    : "bg-[#2a1711]/90 text-amber-500 border-[#5c3a21] hover:bg-[#3a2218] font-serif";

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Barre d'outils / Contrôles */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button 
          onClick={() => setScale((s) => Math.min(s + 0.5, 5))}
          className={`px-3 py-2 border rounded transition-all ${themeControls}`}
          title="Zoomer"
        >
          🔍 +
        </button>
        <button 
          onClick={() => setScale((s) => Math.max(s - 0.5, 1))}
          className={`px-3 py-2 border rounded transition-all ${themeControls}`}
          title="Dézoomer"
        >
          🔍 -
        </button>
        <button 
          onClick={resetZoom}
          className={`px-3 py-2 border rounded transition-all ${themeControls}`}
          title="Réinitialiser"
        >
          {isFBI ? 'RESET' : 'Reset'}
        </button>
        <button 
          onClick={onClose}
          className={`px-4 py-2 border rounded transition-all ${
            isFBI ? 'bg-red-950 text-red-400 border-red-900 hover:bg-red-900 font-mono' : 'bg-[#3a1515] text-red-400 border-[#5a1a1a] hover:bg-[#5a1a1a] font-serif'
          }`}
        >
          ✕ {isFBI ? 'CLOSE' : 'Fermer'}
        </button>
      </div>

      {/* Indication visuelle */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-xs px-4 py-2 rounded border backdrop-blur-sm ${themeControls}`}>
        {isFBI 
          ? `ZOOM: ${(scale * 100).toFixed(0)}% | USE WHEEL TO ZOOM / DRAG TO MOVE` 
          : `Zoom: ${(scale * 100).toFixed(0)}% | Molette pour zoomer - Glisser pour déplacer`}
      </div>

      {/* Zone de l'image */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <img 
          src={src} 
          alt={alt}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            maxHeight: '85vh',
            maxWidth: '90vw',
            objectFit: 'contain'
          }}
          className={`${isFBI ? 'mix-blend-screen opacity-95' : 'sepia-[.2]'}`}
        />
      </div>
    </div>
  );
}