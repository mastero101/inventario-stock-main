
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ArrowDownLeft, ArrowUpRight, Loader2, Calendar, ClipboardList } from 'lucide-react';
import { db } from '../services/db';
import { Movement } from '../types';

const MovementsHistory: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadMovements = async () => {
    setIsLoading(true);
    const data = await db.getMovements();
    setMovements(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const filteredMovements = movements.filter(m =>
    m.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (filteredMovements.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Cabeceras del CSV
    const headers = ["ID", "Fecha", "Producto", "Tipo", "Cantidad", "Responsable", "Motivo"];

    // Mapeo de datos a filas
    const rows = filteredMovements.map(m => [
      m.id,
      m.fecha,
      m.productoNombre,
      m.tipo,
      m.cantidad,
      m.usuario,
      `"${m.motivo.replace(/"/g, '""')}"` // Escapar comillas en el motivo
    ]);

    // Construcción del contenido CSV (con BOM para compatibilidad con acentos en Excel)
    const csvContent = "\uFEFF" + [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    // Creación del Blob y descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const fileName = `auditoria_movimientos_${new Date().toISOString().split('T')[0]}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b-2 border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div>
          <h2 className="text-xl font-black text-[#004a99] uppercase tracking-tight">Historial Transaccional</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Registro auditable de la Secretaría</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto bg-white border border-gray-200 text-gray-600 px-6 py-4 sm:py-2.5 rounded-2xl text-[10px] font-black hover:bg-gray-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 uppercase tracking-widest"
        >
          <Download className="w-4 h-4 text-[#004a99]" /> Exportar Auditoría (CSV)
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#004a99] transition-colors" />
          <input
            type="text"
            placeholder="Filtrar por producto, usuario o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-[#004a99] outline-none transition-all"
          />
        </div>
        <button
          onClick={loadMovements}
          className="w-full sm:w-auto p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-500 transition-colors flex items-center justify-center"
          title="Refrescar Datos"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Loader2 className="w-10 h-10 text-[#004a99] animate-spin" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Recuperando registros...</span>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm min-w-[900px]">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5">Fecha / Hora</th>
                  <th className="px-8 py-5">Producto Afectado</th>
                  <th className="px-8 py-5">Tipo de Operación</th>
                  <th className="px-8 py-5 text-right">Cantidad</th>
                  <th className="px-8 py-5">Responsable</th>
                  <th className="px-8 py-5">Motivo / Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-gray-500 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-[#004a99] opacity-40" />
                        {mov.fecha}
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-gray-800 uppercase tracking-tight">{mov.productoNombre}</td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${mov.tipo === 'Entrada'
                        ? 'bg-green-50 text-green-700 border-green-100'
                        : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                        {mov.tipo === 'Entrada' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        {mov.tipo}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-black text-gray-800 text-base">{mov.cantidad}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center text-[9px] font-black text-[#004a99] shadow-sm">
                          {mov.usuario.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-700 font-black uppercase text-[10px] tracking-tight">{mov.usuario}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-gray-400 font-medium text-xs max-w-xs truncate italic">{mov.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredMovements.length === 0 && (
            <div className="p-24 text-center">
              <div className="flex flex-col items-center gap-4 opacity-10">
                <ClipboardList className="w-20 h-20" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">Cero Coincidencias</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovementsHistory;
