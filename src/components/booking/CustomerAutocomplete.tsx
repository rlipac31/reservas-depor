"use client";
import { useState, useRef, useEffect } from "react";
import { Search, User, Check, Loader2, ChevronDown } from "lucide-react";

export const CustomerAutocomplete = ({ customers, loading, onSelect }: any) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query === ""
    ? []
    : customers.filter((c: any) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dni.includes(query)
    ).slice(0, 6);

  // Control de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (customer: any) => {
    setQuery(customer.name);
    onSelect(customer);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative w-full" ref={containerRef} onKeyDown={handleKeyDown}>
      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1 block">
        Cliente Registrado (Buscador)
      </label>

      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setSelectedIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Escriba nombre o DNI..."
          className="w-full pl-10 pr-10 py-2.5 bg-brand-black border border-brand-black/20 rounded-xl text-sm 
                     focus:border-brand-black/10 focus:ring-2 focus:ring-brand-gold/10 outline-none 
                     transition-all shadow-sm text-brand-white/80 font-medium"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute  z-[100] w-full mt-2 bg-brand-black text-brand-white border border-brand-gray/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto p-1">
            {filtered.map((c: any, index: number) => (
              <button
                key={c.uid}
                type="button"
                onClick={() => handleSelect(c)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors  text-left
                  ${selectedIndex === index ? 'text-brand-white bg-brand-gold/20' : 'hover:bg-brand-gold/20'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${selectedIndex === index ? 'bg-brand-gold text-brand-black' : 'bg-brand-black/70 text-brand-gold'}`}>
                  <User size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-100 leading-none">{c.name}</p>
                  <p className="text-[11px] text-gray-200 mt-1">DNI: {c.dni}</p>
                </div>
                {selectedIndex === index && <Check size={14} className="text-brand-gold" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};