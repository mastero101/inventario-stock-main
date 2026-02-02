
import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, ShieldCheck, UserCog, Mail, Key, X, Save, AlertCircle } from 'lucide-react';
import { getUsers, addUser, deleteUser, updateUserRole } from '../services/auth';
import { User, UserRole } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('USER');

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = async () => {
    const data = await getUsers();
    setUsers([...data]);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPass) return;

    const newUser = {
      id: Date.now().toString(),
      nombre: newName,
      email: newEmail,
      password: newPass,
      role: newRole,
      avatar: newName.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2)
    };

    await addUser(newUser);
    setIsAdding(false);
    resetForm();
    await refreshUsers();
  };

  const resetForm = () => {
    setNewName('');
    setNewEmail('');
    setNewPass('');
    setNewRole('USER');
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿ESTÁ SEGURO? Esta acción ELIMINARÁ permanentemente el acceso de este usuario al sistema.')) {
      await deleteUser(id);
      await refreshUsers();
    }
  };

  const toggleRole = async (id: string, currentRole: UserRole) => {
    const targetRole: UserRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    await updateUserRole(id, targetRole);
    await refreshUsers();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="border-b-2 border-gray-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <UserCog className="w-5 h-5 text-[#004a99]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#004a99] uppercase tracking-tight">Gestión de Personal</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Control de Accesos Administrativos</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#004a99] hover:bg-[#003366] text-white px-6 py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> DAR DE ALTA AGENTE
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex justify-center items-start sm:items-center p-4 overflow-y-auto custom-scrollbar">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-up my-auto">
            <div className="bg-[#004a99] p-6 sm:p-8 text-white flex justify-between items-center relative">
              <div>
                <h3 className="font-black uppercase tracking-tighter text-xl">Alta de Agente</h3>
                <p className="text-[10px] opacity-60 font-bold uppercase tracking-[0.2em]">Secretaría de Trabajo</p>
              </div>
              <button
                onClick={() => setIsAdding(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 sm:p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Nombre y Apellido</label>
                <input
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all placeholder:font-normal placeholder:text-gray-300"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-[#004a99] transition-colors" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 pl-12 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all placeholder:font-normal placeholder:text-gray-300"
                    placeholder="agente@chubut.gov.ar"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Contraseña Temporal</label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Asignación de Rango</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-black text-black focus:bg-white focus:border-[#004a99] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="USER">AGENTE OPERADOR</option>
                  <option value="ADMIN">ADMINISTRADOR DEL SISTEMA</option>
                </select>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#004a99] hover:bg-[#003366] text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 uppercase text-xs tracking-[0.2em] active:scale-[0.98]"
                >
                  <UserPlus className="w-5 h-5" /> Autorizar Acceso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100">
              <tr>
                <th className="px-8 py-6">Nombre Completo</th>
                <th className="px-8 py-6">Correo Electrónico</th>
                <th className="px-8 py-6">Permisos</th>
                <th className="px-8 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004a99] to-blue-400 flex items-center justify-center text-xs font-black text-white shadow-sm uppercase">
                        {user.avatar || user.nombre.charAt(0)}
                      </div>
                      <span className="font-black text-gray-800 uppercase tracking-tight">{user.nombre}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-mono text-xs">{user.email}</td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all ${user.role === 'ADMIN'
                        ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                        }`}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-3 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                      title="Eliminar Agente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-800 uppercase tracking-tight">Atención Administrador</h4>
          <p className="text-[11px] text-amber-700 mt-1 leading-relaxed font-medium">
            La eliminación de usuarios es irreversible. Al borrar a un usuario, este perderá acceso instantáneo a la plataforma de gestión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
