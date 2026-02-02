
import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Save, ClipboardList, Loader2, CheckCircle2, Plus, X } from 'lucide-react';
import { db } from '../services/db';
import { Product, User } from '../types';

interface InventoryMovementProps {
  user: User;
}

const InventoryMovement: React.FC<InventoryMovementProps> = ({ user }) => {
  const [tipo, setTipo] = useState<'Entrada' | 'Salida'>('Entrada');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    db.getProducts().then(setProducts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoId || !cantidad) return;

    setIsSubmitting(true);
    try {
      const selectedProduct = products.find(p => p.id === productoId);
      await db.addMovement({
        productoId,
        productoNombre: selectedProduct?.nombre || 'Desconocido',
        tipo,
        cantidad: Number(cantidad),
        motivo: motivo || (tipo === 'Entrada' ? 'Ingreso de mercadería' : 'Retiro para oficina'),
        usuario: user.nombre
      });

      setSuccess(true);
      setProductoId('');
      setCantidad('');
      setMotivo('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProduct = products.find(p => p.id === productoId);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="border-b-2 border-gray-100 pb-6 px-2">
        <h2 className="text-xl font-black text-[#004a99] uppercase tracking-tight">Gestión de Flujo de Stock</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Intervención directa en los niveles de inventario</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 sm:p-10 relative overflow-hidden">
            {success && (
              <div className="absolute inset-0 bg-green-600/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-white animate-fade-in p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="font-black text-xl uppercase tracking-tighter">Movimiento Registrado</p>
                <p className="text-xs opacity-70 mt-2 uppercase font-black tracking-widest">El stock ha sido actualizado en PostgreSQL</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setTipo('Entrada')}
                  className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xs transition-all border-2 ${tipo === 'Entrada'
                    ? 'bg-green-600 text-white border-green-700 shadow-xl shadow-green-900/10 scale-[1.02]'
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                    }`}
                >
                  <ArrowDownLeft className={`w-5 h-5 ${tipo === 'Entrada' ? 'animate-bounce' : ''}`} /> ENTRADA (+)
                </button>
                <button
                  type="button"
                  onClick={() => setTipo('Salida')}
                  className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-xs transition-all border-2 ${tipo === 'Salida'
                    ? 'bg-red-600 text-white border-red-700 shadow-xl shadow-red-900/10 scale-[1.02]'
                    : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                    }`}
                >
                  <ArrowUpRight className={`w-5 h-5 ${tipo === 'Salida' ? 'animate-bounce' : ''}`} /> SALIDA (-)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Seleccionar Producto</label>
                  <select
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 sm:p-5 text-sm font-black text-gray-800 focus:border-[#004a99] focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                    required
                  >
                    <option value="">-- Elige un artículo --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} ({p.stockActual} disp.)</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Cantidad a Operar</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 sm:p-5 text-sm font-black text-black focus:border-[#004a99] focus:bg-white outline-none transition-all placeholder:font-normal"
                    placeholder="Ej: 10"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Motivo / Detalle del Movimiento</label>
                <textarea
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-sm font-bold text-black focus:border-[#004a99] focus:bg-white outline-none min-h-[120px] resize-none transition-all"
                  placeholder="Explique brevemente por qué se realiza esta operación..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#004a99] hover:bg-[#003366] disabled:bg-gray-200 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 group active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Ejecutar Operación
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 bg-gradient-to-br from-white to-gray-50">
            <div className="flex items-center gap-3 text-[#004a99] mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ClipboardList className="w-4 h-4" />
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Simulación de Stock</h3>
            </div>

            {selectedProduct ? (
              <div className="space-y-6">
                <div className="relative p-6 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ArrowDownLeft className="w-16 h-16" />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Estado Actual</span>
                  <p className="text-4xl font-black text-gray-800 tracking-tighter">{selectedProduct.stockActual}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">unidades disponibles</p>
                </div>

                <div className="flex justify-center -my-3 relative z-10">
                  <div className={`p-2 rounded-full border-4 border-white shadow-lg ${tipo === 'Entrada' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {tipo === 'Entrada' ? <Plus className="w-4 h-4 text-white font-black" /> : <X className="w-4 h-4 text-white font-black" />}
                  </div>
                </div>

                <div className={`relative p-6 rounded-2xl border-2 overflow-hidden ${tipo === 'Entrada' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest block mb-2 ${tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>Proyección Final</span>
                  <p className={`text-4xl font-black tracking-tighter ${tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {tipo === 'Entrada'
                      ? selectedProduct.stockActual + (Number(cantidad) || 0)
                      : selectedProduct.stockActual - (Number(cantidad) || 0)
                    }
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">luego de la operación</p>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center px-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Esperando selección<br />de material...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryMovement;
