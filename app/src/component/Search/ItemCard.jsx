export default function ItemCard({ item, userRole, onClick, onEdit, isFBI }) {
  // Styles dynamiques selon le thème
  const cardTheme = isFBI 
    ? "bg-black/80 border-cyan-900 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] font-sans" 
    : "bg-[#2a1711]/80 border-[#4a2e1b] hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] font-serif";

  const titleTheme = isFBI ? "text-cyan-400 font-mono tracking-widest uppercase" : "text-amber-500 text-xl font-bold";
  const textTheme = isFBI ? "text-cyan-100/70 font-mono text-xs" : "text-amber-100/70";

  return (
    <div 
      onClick={onClick} 
      className={`border rounded-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-300 backdrop-blur-sm ${cardTheme}`}
    >
      {item.imageUrl ? (
        <div className="relative">
          <img src={item.imageUrl} alt={item.nom} className={`h-48 w-full object-cover border-b ${isFBI ? 'border-cyan-900 mix-blend-luminosity opacity-80' : 'border-[#4a2e1b] sepia-[.3]'}`} />
          {/* Petit overlay de scanline style FBI */}
          {isFBI && <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(34,211,238,0.1)_2px,rgba(34,211,238,0.1)_4px)] pointer-events-none"></div>}
        </div>
      ) : (
        <div className={`h-48 flex items-center justify-center border-b ${isFBI ? 'bg-cyan-950/20 border-cyan-900 text-cyan-800 font-mono' : 'bg-[#1a0f0a] border-[#4a2e1b] text-[#4a2e1b]'}`}>
          {isFBI ? 'IMAGE_NOT_FOUND' : 'Pas d\'illustration'}
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className={titleTheme}>{item.nom}</h3>
        </div>
        <p className={`whitespace-pre-wrap flex-1 line-clamp-3 mb-4 ${textTheme}`}>
          {item.description}
        </p>
        
        {userRole === 'admin' && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onEdit(item); 
            }}
            className={`mt-auto w-full text-sm py-2 rounded transition-colors ${
              isFBI 
                ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-900 uppercase font-mono' 
                : 'bg-[#3a2218] hover:bg-[#4a2e1b] text-amber-500 border border-[#4a2e1b] font-serif'
            }`}
          >
            {isFBI ? 'EDIT_RECORD' : 'Modifier les écrits'}
          </button>
        )}
      </div>
    </div>
  );
}