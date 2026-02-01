import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Home, Sliders, Building, BarChart3, Users, Settings } from "lucide-react";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    { 
      icon: Home, 
      label: "Iniciar Sesión de Nuevo", 
      onClick: handleLogout
    },
    { icon: Sliders, label: "Simulación", onClick: () => navigate('/simulation') },
    { icon: Building, label: "Proyectos", onClick: () => navigate('/projects') },
    { icon: BarChart3, label: "Proyectos Guardados", onClick: () => navigate('/saved-projects') },
    { icon: Users, label: "Usuarios", onClick: () => navigate('/users'), adminOnly: true },
    { icon: Settings, label: "Configuración", onClick: () => navigate('/settings') },
  ];

  // Filter out admin-only items if user is not admin
  const visibleItems = menuItems.filter(item => !item.adminOnly || user?.email?.includes('admin'));

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CASA Sim</h1>
          <p className="text-blue-200 text-lg px-4">
            Simula, analiza y gestiona viviendas sociales para un Perú sostenible.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {visibleItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-2xl p-6 flex flex-col items-center space-y-3 shadow-lg border border-blue-500/30"
              >
                <IconComponent className="w-8 h-8 text-white" />
                <span className="text-white font-medium text-center text-sm leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 max-w-sm w-full">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">
              ¿Estás seguro que quieres iniciar sesión de nuevo?
            </h3>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuButton onClick={() => setIsSidebarOpen(true)} />
      <SidebarNavigation 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}
