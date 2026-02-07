import { Navigate } from "react-router";

export default function AuthCallbackPage() {
  // Con autenticación local, no necesitamos procesar callbacks de OAuth.
  // Simplemente redirigimos al inicio.

  return <Navigate to="/" replace />;
}
