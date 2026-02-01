import { useState } from "react";
import { Home, BarChart3, Settings, HelpCircle, Menu, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@getmocha/users-service/react";

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarNavigation({ isOpen, onClose }: SidebarNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigate('/');
    setShowLogoutConfirm(false);
    onClose();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    { 
      icon: Home, 
      label: "Inicio", 
      path: "/dashboard"
    },
    { 
      icon: BarChart3, 
      label: "Proyectos Guardados", 
      path: "/saved-projects"
    },
    { 
      icon: Settings, 
      label: "Configuración", 
      path: "/settings"
    },
    { 
      icon: HelpCircle, 
      label: "Ayuda", 
      path: "/chat"
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black/90 backdrop-blur-md border-r border-blue-500/30 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Home className="w-6 h-6 text-[#8B5CF6]" />
              <h2 className="text-xl font-semibold text-white">CasaSim</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-8 p-4 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <div className="text-white font-medium">
              {user?.google_user_data?.name || user?.email || 'Usuario'}
            </div>
            <div className="text-blue-200 text-sm">
              {user?.email || 'No disponible'}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-blue-200 hover:bg-blue-600/20 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-8 pt-8 border-t border-blue-500/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-red-300 hover:bg-red-600/20 hover:text-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Iniciar sesión de nuevo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
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
    </>
  );
}

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 p-3 bg-black/80 backdrop-blur-md text-white rounded-xl border border-blue-500/40 hover:bg-blue-600/60 transition-all duration-200 shadow-xl hover:shadow-blue-500/20 hover:scale-105"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
