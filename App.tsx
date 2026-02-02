import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  PackagePlus,
  ArrowLeftRight,
  Boxes,
  Settings,
  Menu,
  LogOut,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

import { AppView, User, Product } from "./types";
import Dashboard from "./components/Dashboard";
import InventoryList from "./components/InventoryList";
import InventoryMovement from "./components/InventoryMovement";
import MovementsHistory from "./components/MovementsHistory";
import Login from "./components/Login";
import UserManagement from "./components/UserManagement";
import SearchStudio from "./components/SearchStudio";
import ImageStudio from "./components/ImageStudio";

import { db } from "./services/db";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /** 📄 INVENTARIO */
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /** 🔄 CARGA INICIAL */
  const cargarInventario = async () => {
    try {
      setLoading(true);
      const data = await db.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando inventario:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  /** 💾 GUARDAR / ACTUALIZAR STOCK (Legacy wrapper) */
  const guardarEnSheet = async () => {
    cargarInventario();
  };

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, view: AppView.DASHBOARD, roles: ["ADMIN", "USER"] },
    { name: "Gestión Stock", icon: PackagePlus, view: AppView.PRODUCTOS, roles: ["ADMIN", "USER"] },
    { name: "Inventario Total", icon: Boxes, view: AppView.INVENTARIO, roles: ["ADMIN", "USER"] },
    { name: "Historial / Reportes", icon: ArrowLeftRight, view: AppView.MOVIMIENTOS, roles: ["ADMIN", "USER"] },
    { name: "Asistente IA", icon: Search, view: AppView.ASISTENTE, roles: ["ADMIN", "USER"] },
    { name: "Estudio Creativo", icon: Sparkles, view: AppView.ESTUDIO, roles: ["ADMIN", "USER"] },
    { name: "Control Usuarios", icon: Settings, view: AppView.CONFIGURACION, roles: ["ADMIN"] },
  ];

  const filteredNavigation = navigation.filter(
    (item) => currentUser && item.roles.includes(currentUser.role)
  );

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveView(AppView.DASHBOARD);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* OVERLAY PARA MÓVIL */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative z-50 w-72 h-full bg-[#004a99] text-white transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-white/10 flex items-center justify-between">
            <h1 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">
              Sistema de Gestión
            </h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              <LogOut className="w-4 h-4 rotate-180" />
            </button>
          </div>

          <nav className="flex-1 py-6 space-y-1">
            {filteredNavigation.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setActiveView(item.view as AppView);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-8 py-4 text-xs font-bold transition-all ${activeView === item.view ? "bg-white/15 border-r-4 border-[#F57C00] text-white shadow-inner" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
              >
                <item.icon className={`w-4 h-4 ${activeView === item.view ? "text-[#F57C00]" : ""}`} />
                <span className="uppercase tracking-widest">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-white/10 bg-black/10">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-8 h-8 rounded-full bg-[#F57C00] flex items-center justify-center font-black text-xs">
                {currentUser.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black truncate uppercase">{currentUser.nombre}</p>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentUser(null)}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 hover:text-red-400 transition-all border border-white/5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <header className="bg-white border-b h-20 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors shadow-sm"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Centro de Mando</h2>
              <p className="font-black text-[#004a99] uppercase tracking-tight text-sm">
                Secretaría de Trabajo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-[10px] font-black text-[#F57C00] bg-[#F57C00]/5 px-3 py-1.5 rounded-lg border border-[#F57C00]/10 tracking-widest uppercase">
              Gobierno del Chubut
            </span>
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#004a99] font-black">
              {currentUser.nombre.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto h-full space-y-8 pb-12">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm z-50 gap-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-[#004a99] animate-spin" />
                  <div className="absolute inset-0 m-auto w-4 h-4 bg-[#F57C00] rounded-full animate-pulse"></div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Sincronizando con Neon Database</p>
              </div>
            )}

            {!loading && activeView === AppView.DASHBOARD && (
              <Dashboard user={currentUser} />
            )}
            {!loading && activeView === AppView.PRODUCTOS && (
              <InventoryMovement user={currentUser} />
            )}
            {!loading && activeView === AppView.MOVIMIENTOS && <MovementsHistory />}
            {!loading && activeView === AppView.ASISTENTE && <SearchStudio />}
            {!loading && activeView === AppView.ESTUDIO && <ImageStudio />}
            {!loading && activeView === AppView.INVENTARIO && (
              <InventoryList data={products} user={currentUser} onRefresh={cargarInventario} />
            )}
            {!loading && activeView === AppView.CONFIGURACION && (
              <UserManagement />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
