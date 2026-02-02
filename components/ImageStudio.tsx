
import React, { useState } from 'react';
import { Send, Download, RefreshCcw, Layout, Maximize2, Trash2, Wand2, Zap, Sparkles, Loader2 } from 'lucide-react';
import { generateImage } from '../services/gemini';
import { ImageGeneration } from '../types';

const ImageStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isHighQuality, setIsHighQuality] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ImageGeneration[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageGeneration | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(prompt, aspectRatio, isHighQuality);
      const newImage: ImageGeneration = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        prompt,
        timestamp: Date.now()
      };
      setHistory(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
      setPrompt('');
    } catch (err) {
      console.error(err);
      alert("Error al generar la imagen. Verifica tu conexión.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-col h-full lg:h-[calc(100vh-14rem)] space-y-6 animate-fade-in">
      <div className="border-b-2 border-gray-100 pb-6 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#004a99] uppercase tracking-tight">Estudio Creativo</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Generación de activos visuales mediante IA</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <Zap className="w-3.5 h-3.5 text-[#004a99]" />
          <span className="text-[10px] font-black text-[#004a99] uppercase tracking-widest">Motor: Imagen 3.0 Fast</span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] p-6 sm:p-8 border border-gray-100 shadow-xl flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
              <Wand2 className="w-3.5 h-3.5 text-[#004a99]" /> Describe tu idea visual
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un banner institucional con montañas de Chubut al fondo y elementos de oficina modernos, estilo fotorealista..."
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[32px] p-6 text-sm sm:text-base font-bold text-gray-800 focus:bg-white focus:border-[#004a99] outline-none transition-all min-h-[140px] resize-none placeholder:font-normal placeholder:text-gray-300 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Formato / Ratio</label>
              <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${aspectRatio === ratio ? 'bg-[#004a99] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Sello de Calidad</label>
              <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                <button
                  onClick={() => setIsHighQuality(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${!isHighQuality ? 'bg-white text-[#004a99] border-2 border-[#004a99]/20 shadow-sm' : 'text-gray-400'}`}
                >
                  <Zap className="w-3.5 h-3.5" /> Estándar
                </button>
                <button
                  onClick={() => setIsHighQuality(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${isHighQuality ? 'bg-gradient-to-r from-[#004a99] to-blue-500 text-white shadow-lg' : 'text-gray-400'}`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Premium
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-[#004a99] hover:bg-[#003366] disabled:bg-gray-200 text-white font-black py-6 rounded-[28px] transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 group active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            {isGenerating ? 'Sincronizando con Imagen 3.0...' : 'Materializar Imagen'}
          </button>
        </div>

        <div className="w-full lg:w-[450px] space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Resultado / Galería</h3>
            {history.length > 0 && (
              <button onClick={() => { setHistory([]); setSelectedImage(null); }} className="text-red-500 text-[10px] font-black uppercase hover:underline">Limpiar Todo</button>
            )}
          </div>

          <div className="relative aspect-square sm:aspect-video lg:aspect-square bg-gray-900 rounded-[32px] overflow-hidden shadow-2xl group border-4 border-gray-100">
            {selectedImage ? (
              <>
                <img src={selectedImage.url} alt={selectedImage.prompt} className="w-full h-full object-contain animate-fade-in" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-[2px]">
                  <p className="text-[10px] font-bold text-gray-300 line-clamp-2 mb-4 leading-relaxed italic">{selectedImage.prompt}</p>
                  <button
                    onClick={() => downloadImage(selectedImage.url, `provincia-image-${selectedImage.id}.png`)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-black rounded-2xl text-[10px] font-black hover:bg-gray-100 transition-all uppercase tracking-widest shadow-xl"
                  >
                    <Download className="w-4 h-4" /> Bajar Archivo Original
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Layout className="w-8 h-8 text-white/20" />
                </div>
                <p className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Esperando Directiva Artística</p>
              </div>
            )}
            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10 px-8 text-center">
                <Loader2 className="w-12 h-12 text-[#004a99] animate-spin mb-4" />
                <p className="font-black text-xs uppercase tracking-[0.2em] animate-pulse">Renderizando composición...</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {history.slice(0, 4).map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage?.id === img.id ? 'border-[#004a99] scale-95 shadow-lg shadow-blue-900/20' : 'border-transparent hover:scale-105'}`}
              >
                <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
