import { useEffect, useState } from "react";
import { useAuth } from "@getmocha/users-service/react";
import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken, user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
      } catch (err) {
        setError("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
        console.error("OAuth callback error:", err);
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-4">Error de Autenticación</h1>
          <p className="text-[#A9A9A9] mb-6">{error}</p>
          <a
            href="/"
            className="px-6 py-3 bg-[#4B6CFF] text-white rounded-lg font-medium hover:bg-[#3B5CFF] transition-colors"
          >
            Volver al Login
          </a>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Loader2 className="w-10 h-10 text-white mx-auto" />
        </div>
        <h1 className="text-xl font-semibold text-white mb-2">Iniciando sesión...</h1>
        <p className="text-[#A9A9A9]">Procesando autenticación</p>
      </div>
    </div>
  );
}
