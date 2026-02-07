import { Navigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useLocalAuth } from "@/react-app/hooks/useLocalAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isPending } = useLocalAuth();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212]">
        <div className="animate-spin">
          <Loader2 className="w-10 h-10 text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

