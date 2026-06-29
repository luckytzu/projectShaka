export default function SearchBar({ searchTerm, setSearchTerm, placeholder, isFBI }) {
  return (
    <input 
      type="text" 
      placeholder={placeholder}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className={`w-full p-3 rounded outline-none transition-all duration-300 ${
        isFBI 
          ? "bg-black/60 border border-cyan-900 text-cyan-300 placeholder-cyan-900 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] font-mono uppercase" 
          : "bg-[#2a1711]/50 border border-amber-900/50 text-amber-200 placeholder-amber-900/50 focus:border-amber-500 focus:bg-[#3a2218] font-serif"
      }`}
    />
  );
}