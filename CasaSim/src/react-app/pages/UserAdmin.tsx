import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import Header from "@/react-app/components/Header";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Usuario' | 'Administrador';
}

export default function UserAdminPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'María González',
      email: 'maria.gonzalez@ejemplo.com',
      role: 'Usuario'
    },
    {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@ejemplo.com',
      role: 'Administrador'
    },
    {
      id: '3',
      name: 'Ana Fernández',
      email: 'ana.fernandez@ejemplo.com',
      role: 'Usuario'
    }
  ]);

  const handleAddUser = () => {
    alert('Funcionalidad de añadir nuevo usuario en desarrollo');
  };

  const handleRoleChange = (userId: string, newRole: 'Usuario' | 'Administrador') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  return (
    <div className="min-h-screen">
      <Header title="Administración de Usuarios" />
      
      <div className="px-6 py-6">
        {/* Add User Button */}
        <button
          onClick={handleAddUser}
          className="w-full py-4 bg-[#4B6CFF] text-white rounded-lg font-medium hover:bg-[#3B5CFF] transition-colors flex items-center justify-center space-x-2 mb-8"
        >
          <Plus className="w-5 h-5" />
          <span>Añadir Nuevo Usuario</span>
        </button>

        {/* Users Table */}
        <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-[#121212] border-b border-gray-700">
            <div className="text-white font-semibold text-sm">Nombre</div>
            <div className="text-white font-semibold text-sm">Email</div>
            <div className="text-white font-semibold text-sm">Rol</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-700">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-3 gap-4 p-4 items-center">
                <div className="text-white text-sm truncate">{user.name}</div>
                <div className="text-[#A9A9A9] text-sm truncate">{user.email}</div>
                <div className="relative">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'Usuario' | 'Administrador')}
                    className="w-full px-3 py-2 bg-[#121212] border border-gray-600 rounded-lg text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#4B6CFF]"
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-[#1E1E1E] rounded-lg border-l-4 border-[#4B6CFF]">
          <p className="text-[#A9A9A9] text-sm">
            <strong className="text-white">Nota:</strong> Los usuarios con rol "Administrador" tienen acceso completo a todas las funciones, 
            incluyendo la gestión de usuarios. Los usuarios normales solo pueden acceder a simulaciones y proyectos.
          </p>
        </div>
      </div>
    </div>
  );
}
