import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useLocalAuth } from "@/react-app/hooks/useLocalAuth";

export default function LoginPage() {
  const { user, isPending, login } = useLocalAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-white" />
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a CasaSim</h1>
          <p className="text-blue-200 text-lg">
            Simula, analiza y gestiona viviendas sociales para un Perú sostenible.
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-blue-500/30">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-blue-500/50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-colors backdrop-blur-sm"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-blue-500/50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-colors backdrop-blur-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Cargando...
                </div>
              ) : (
                "Ingresar / Registrarse"
              )}
            </button>

            <div className="text-center">
              <a href="#" className="text-blue-400 text-sm hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
