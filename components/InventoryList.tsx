import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Trash2, X, Save, Boxes } from 'lucide-react';
import { Product, User } from '../types';
import { db } from '../services/db';

interface InventoryListProps {
  data: Product[];
  user: User;
  onRefresh: () => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ data, user, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [stockMin, setStockMin] = useState('5');
  const [precio, setPrecio] = useState('0');

  const openAddModal = () => {
    setEditingProduct(null);
    setCodigo('');
    setNombre('');
    setStockMin('5');
    setPrecio('0');
    setIsAdding(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setCodigo(p.codigo);
    setNombre(p.nombre);
    setStockMin(String(p.stockMinimo));
    setPrecio(String(p.precio));
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !nombre) return;

    await db.saveProduct({
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      codigo,
      nombre,
      stockActual: editingProduct ? editingProduct.stockActual : 0,
      stockMinimo: Number(stockMin),
      precio: Number(precio)
    });

    setIsAdding(false);
    onRefresh();
  };

  const handleDeleteProduct = async (id: string, nombre: string) => {
    if (confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      await db.deleteProduct(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-xl font-black text-[#004a99] uppercase tracking-tight">Inventario Total</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Listado maestro de materiales y precios</p>
        </div>
        {user.role === 'ADMIN' && (
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto bg-[#004a99] text-white px-6 py-4 sm:py-2.5 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-[#003366] transition-all shadow-lg active:scale-95 uppercase tracking-widest"
          >
            <Plus className="w-4 h-4" /> Nuevo Artículo
          </button>
        )}
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5">Código / Ref</th>
                <th className="px-8 py-5">Descripción del Material</th>
                <th className="px-8 py-5 text-center">Stock</th>
                <th className="px-8 py-5 text-right">Valor Unit.</th>
                <th className="px-8 py-5 text-right pr-12">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                        {item.codigo}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-gray-800 uppercase tracking-tight">{item.nombre}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 ${item.stockActual <= item.stockMinimo
                          ? 'bg-red-50 text-red-600 border-red-100'
                          : 'bg-green-50 text-green-600 border-green-100'
                          }`}>
                          {item.stockActual}
                        </div>
                        {item.stockActual <= item.stockMinimo && (
                          <span className="text-[8px] font-black text-red-500 uppercase mt-1 animate-pulse">Crítico</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-right font-black text-gray-600">
                      <span className="opacity-40 text-[10px] mr-1">$</span>
                      {item.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        {user.role === 'ADMIN' && (
                          <>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-3.5 sm:p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                              title="Editar Parámetros"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(item.id, item.nombre)}
                              className="p-3.5 sm:p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-90"
                              title="Eliminar de Base de Datos"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Boxes className="w-16 h-16" />
                      <p className="text-sm font-black uppercase tracking-widest leading-none">Cámara de Stock Vacía</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex justify-center items-start sm:items-center p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-up my-auto">
            <div className="bg-[#004a99] p-6 sm:p-8 text-white flex justify-between items-center relative">
              <div className="space-y-1">
                <h3 className="font-black uppercase tracking-tighter text-xl">
                  {editingProduct ? 'Modificar Artículo' : 'Nuevo Ingreso'}
                </h3>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Base de Datos Central</p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Referencia / Código</label>
                  <input
                    required
                    value={codigo}
                    onChange={e => setCodigo(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all"
                    placeholder="Ref: 001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Precio Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Descripción del Material</label>
                <input
                  required
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all"
                  placeholder="Nombre técnico del producto"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Umbral Mínimo (Alerta)</label>
                <input
                  type="number"
                  required
                  value={stockMin}
                  onChange={e => setStockMin(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#004a99] hover:bg-[#003366] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] active:scale-[0.98]"
                >
                  <Save className="w-5 h-5" />
                  {editingProduct ? 'Actualizar Cambios' : 'Confirmar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
