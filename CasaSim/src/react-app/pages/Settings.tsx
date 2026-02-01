import { useState } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { useAccessibility } from "@/react-app/hooks/useAccessibility";
import Header from "@/react-app/components/Header";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fontSizes: ('Pequeño' | 'Mediano' | 'Grande')[] = ['Pequeño', 'Mediano', 'Grande'];

  const handleChangePassword = () => {
    alert('Funcionalidad de cambiar contraseña en desarrollo');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen">
      <Header title="Configuración y Ajustes" />
      
      <div className="px-6 py-6 space-y-6">
        {/* User Profile Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Perfil de Usuario</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-blue-200 text-sm mb-1">Nombre de Usuario:</label>
              <p className="text-white font-medium">
                {user?.google_user_data?.name || user?.email || 'Usuario'}
              </p>
            </div>

            <div>
              <label className="block text-blue-200 text-sm mb-1">Correo Electrónico:</label>
              <p className="text-white font-medium">
                {user?.email || 'No disponible'}
              </p>
            </div>

            <button
              onClick={handleChangePassword}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* Accessibility Settings Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Ajustes de Accesibilidad</h3>
          
          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Tamaño de Fuente:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-3 px-4 rounded-lg font-medium transition-colors text-sm ${
                      fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Mode */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-white text-sm font-medium">
                  Modo de Alto Contraste:
                </label>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                Activa el modo de alto contraste para mejorar la legibilidad
              </p>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Información de la App</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-200 text-sm">Versión:</span>
              <span className="text-white text-sm">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200 text-sm">Última actualización:</span>
              <span className="text-white text-sm">Noviembre 2025</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Soporte</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-black/40 border border-blue-500/50 text-white rounded-lg font-medium hover:bg-blue-600/20 transition-colors">
              Centro de Ayuda
            </button>
            <button className="w-full py-3 bg-black/40 border border-blue-500/50 text-white rounded-lg font-medium hover:bg-blue-600/20 transition-colors">
              Reportar un Problema
            </button>
            <button className="w-full py-3 bg-black/40 border border-blue-500/50 text-white rounded-lg font-medium hover:bg-blue-600/20 transition-colors">
              Términos y Condiciones
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Iniciar sesión de nuevo
          </button>
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
