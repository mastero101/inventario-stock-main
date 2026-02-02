
import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Globe, MessageSquare, ExternalLink, Hash, MapPin, Loader2 } from 'lucide-react';
import { searchWithGrounding } from '../services/gemini';
import { ChatMessage } from '../types';

const SearchStudio: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number, lng: number } | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Ubicación denegada", err)
      );
    }
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: ChatMessage = { role: 'user', content: currentInput };

    // Actualización inmediata para el mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await searchWithGrounding(currentInput, coords);
      const modelMessage: ChatMessage = {
        role: 'model',
        content: result.text,
        groundingUrls: result.urls?.filter(Boolean) as any
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Lo siento, hubo un error técnico al procesar tu búsqueda. Por favor, verifica tu conexión o intenta nuevamente."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] lg:h-[calc(100vh-14rem)] space-y-6 animate-fade-in relative">
      <div className="border-b-2 border-gray-100 pb-6 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-[#004a99] uppercase tracking-tight">Buscador Inteligente</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">IA integrada de Secretaría de Trabajo</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${coords ? 'bg-green-500' : 'bg-orange-500'}`}></div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{coords ? 'Ubicación Activa' : 'Buscando Señal GPS'}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar flex flex-col pb-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="my-auto flex flex-col items-center justify-center text-center p-8 sm:p-14 bg-white rounded-[40px] border border-gray-100 shadow-sm mx-2">
            <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-ping"></div>
              <Search className="w-12 h-12 text-[#004a99]" />
            </div>
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">¿En qué puedo asistirte hoy?</h3>
            <p className="text-sm text-gray-400 max-w-sm mt-3 font-semibold leading-relaxed">
              Consulta sobre precios de mercado, normativas laborales, proveedores locales o redacción técnica.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
              <button onClick={() => setInput('¿Cuál es el salario mínimo actual en Argentina?')} className="p-3 bg-gray-50 hover:bg-blue-50 text-[10px] font-black text-gray-500 hover:text-blue-600 rounded-xl border border-gray-100 transition-all uppercase tracking-tight">Salario Mínimo</button>
              <button onClick={() => setInput('Proveedores de elementos de seguridad en Chubut')} className="p-3 bg-gray-50 hover:bg-blue-50 text-[10px] font-black text-gray-500 hover:text-blue-600 rounded-xl border border-gray-100 transition-all uppercase tracking-tight">Proveedores locales</button>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[90%] sm:max-w-[80%] rounded-3xl p-5 sm:p-7 shadow-xl border ${msg.role === 'user'
              ? 'bg-[#004a99] border-blue-600 text-white font-bold'
              : 'bg-white border-gray-100 text-gray-700'
              }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black border-2 ${msg.role === 'user' ? 'bg-white text-[#004a99] border-white/20' : 'bg-orange-500 text-white border-orange-200'}`}>
                  {msg.role === 'user' ? 'TÚ' : 'IA'}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {msg.role === 'user' ? 'Agente de Gestión' : 'Inteligencia Gemini'}
                </span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Contexto Verificado por Fuente:</span>
                  <div className="flex flex-wrap gap-2">
                    {msg.groundingUrls.map((url, j) => (
                      <a key={j} href={url.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 border border-blue-100 group">
                        {url.type === 'maps' ? <MapPin className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                        <span className="truncate max-w-[120px] sm:max-w-none">{url.title}</span>
                        <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 flex items-center gap-4 shadow-sm">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sincronizando con red neuronal...</span>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-gray-50/80 backdrop-blur-md pb-4 pt-2">
        <form onSubmit={handleSend} className="bg-white p-2 border-2 border-gray-100 rounded-[28px] shadow-2xl flex items-center gap-2 focus-within:border-[#004a99] transition-all group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta aquí..."
            className="flex-1 bg-transparent px-6 py-4 text-sm sm:text-base font-bold focus:outline-none text-black placeholder:text-gray-300 placeholder:font-normal"
            disabled={isLoading}
          />
          <button
            disabled={isLoading || !input.trim()}
            className="bg-[#004a99] hover:bg-[#003366] disabled:bg-gray-200 text-white p-4 sm:p-5 rounded-[22px] transition-all shadow-xl active:scale-95 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchStudio;
