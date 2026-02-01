import { Home, LogOut } from "lucide-react";
import { useAuth } from "@getmocha/users-service/react";
import { useNavigate } from "react-router";

interface HeaderProps {
  title?: string;
  showLogout?: boolean;
  showClose?: boolean;
}

export default function Header({ title = "CasaSim", showLogout = false, showClose = false }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex items-center justify-between p-4 pl-20 bg-[#121212] border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <Home className="w-6 h-6 text-[#8B5CF6]" />
        <h1 className="text-xl font-semibold text-white">{title}</h1>
      </div>
      <div>
        {showLogout && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
        {showClose && (
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}
