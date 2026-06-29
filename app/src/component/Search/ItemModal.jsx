export default function ItemModal({ item, onClose, isFBI }) {
  if (!item) return null;

  const modalTheme = isFBI 
    ? "bg-[#020617] border border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] font-sans" 
    : "bg-[#2a1711] border border-[#5c3a21] shadow-[0_0_30px_rgba(0,0,0,0.8)] font-serif";
    
  const titleTheme = isFBI ? "text-cyan-400 font-mono tracking-[0.2em] uppercase text-4xl" : "text-amber-500 font-bold text-4xl";
  const textTheme = isFBI ? "text-cyan-50 font-mono text-sm" : "text-amber-100/90 text-lg leading-relaxed";

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md transition-all"
      onClick={onClose} 
    >
      <div 
        className={`rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col ${modalTheme}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-end p-2 absolute right-4 top-4 md:static md:right-auto md:top-auto z-10">
          <button 
            onClick={onClose}
            className={`rounded-full p-2 h-10 w-10 flex items-center justify-center transition-colors ${
              isFBI ? 'bg-cyan-950 text-cyan-400 hover:bg-cyan-900 border border-cyan-800' : 'bg-[#1a0f0a] text-amber-500 hover:bg-[#3a2218] border border-[#4a2e1b]'
            }`}
          >
            ✕
          </button>
        </div>

        {item.imageUrl && (
          <div className={`w-full flex justify-center border-b p-4 relative ${isFBI ? 'bg-black border-cyan-900' : 'bg-[#1a0f0a] border-[#4a2e1b]'}`}>
            <img 
              src={item.imageUrl} 
              alt={item.nom} 
              className={`max-w-full max-h-[45vh] object-contain ${isFBI ? 'mix-blend-screen opacity-90' : 'sepia-[.4] contrast-125'}`} 
            />
            {/* Lignes de scan FBI */}
            {isFBI && <div className="absolute inset-0 bg-[repeating-linear-gradient(transparent,transparent_2px,rgba(34,211,238,0.05)_2px,rgba(34,211,238,0.05)_4px)] pointer-events-none"></div>}
          </div>
        )}

        <div className="p-6 md:p-10 relative">
          {/* Logo décoratif en filigrane */}
          {isFBI && <div className="absolute top-10 right-10 opacity-5 pointer-events-none text-9xl font-mono text-cyan-500">FBI</div>}
          
          <div className="flex items-center gap-4 mb-8">
            <h2 className={titleTheme}>{item.nom}</h2>
            <span className={`text-xs px-3 py-1 rounded tracking-widest uppercase ${
              isFBI ? 'bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono' : 'bg-[#4a2e1b] text-amber-200 font-sans'
            }`}>
              {item.niveauAcces === 'admin' ? 'TOP SECRET' : 'CLASSÉ'}
            </span>
          </div>
          
          <div className={`whitespace-pre-wrap ${textTheme}`}>
            {item.description}
          </div>
        </div>
      </div>
    </div>
  );
}