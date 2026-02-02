
import React, { useState, useEffect } from 'react';
import { RefreshCcw, BellRing, ClipboardCheck, TrendingUp, History, Zap, Loader2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { db } from '../services/db';
import { User } from '../types';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [greeting, setGreeting] = useState('');
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const data = await db.getStats();
    setStatsData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 20) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  const stats = statsData ? [
    { label: 'Productos en Stock', value: statsData.totalProducts, color: 'text-blue-600', icon: ClipboardCheck },
    { label: 'Alertas Reposición', value: statsData.lowStock, color: 'text-orange-600', icon: BellRing },
    { label: 'Movimientos Hoy', value: statsData.movementsToday, color: 'text-indigo-600', icon: TrendingUp },
    { label: 'Sin Existencias', value: statsData.outOfStock, color: 'text-red-600', icon: Zap },
  ] : [];

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#004a99] animate-spin" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sincronizando con PostgreSQL...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-[#004a99] uppercase tracking-tight">
            {greeting}, {user.nombre}
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Panel de Control • Neon PostgreSQL Conectado
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadData} className="p-2.5 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors shadow-sm">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-2xl font-black block leading-none ${stat.color}`}>{stat.value}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#004a99] p-8 sm:p-12 rounded-[32px] sm:rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-black mb-4 italic tracking-tighter uppercase">Gestión Institucional</h3>
          <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-medium">
            Plataforma centralizada para el control de suministros de la Secretaría de Trabajo. Sincronización en tiempo real con Neon Database.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
          <History className="w-48 h-48 sm:w-64 sm:h-64" />
        </div>
      </div>

      {statsData?.recentMovements?.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <History className="w-5 h-5 text-[#004a99]" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Actividad Reciente</h3>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {statsData.recentMovements.map((move: any) => (
                <div key={move.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${move.tipo === 'Entrada' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {move.tipo === 'Entrada' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{move.productoNombre}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">{move.fecha}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${move.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {move.tipo === 'Entrada' ? '+' : '-'}{move.cantidad}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{move.usuario}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
