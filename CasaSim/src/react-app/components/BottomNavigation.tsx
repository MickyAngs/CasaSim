import { Home, BarChart3, Settings, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-blue-500/30 px-4 py-3">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center space-y-1 p-2 ${
            location.pathname === '/dashboard' ? 'text-blue-400' : 'text-blue-200'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Inicio</span>
        </button>
        
        <button 
          onClick={() => navigate('/saved-projects')}
          className={`flex flex-col items-center space-y-1 p-2 ${
            location.pathname === '/saved-projects' ? 'text-blue-400' : 'text-blue-200'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs font-medium">Proyectos Guardados</span>
        </button>
        
        <button 
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center space-y-1 p-2 ${
            location.pathname === '/settings' ? 'text-blue-400' : 'text-blue-200'
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">Configuración</span>
        </button>
        
        <button 
          onClick={() => navigate('/chat')}
          className={`flex flex-col items-center space-y-1 p-2 ${
            location.pathname === '/chat' ? 'text-blue-400' : 'text-blue-200'
          }`}
        >
          <HelpCircle className="w-6 h-6" />
          <span className="text-xs font-medium">Ayuda</span>
        </button>
      </div>
    </div>
  );
}
