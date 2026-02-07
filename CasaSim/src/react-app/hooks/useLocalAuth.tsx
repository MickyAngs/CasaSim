import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
}

interface LocalAuthContextType {
  user: User | null;
  isPending: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const LocalAuthContext = createContext<LocalAuthContextType | null>(null);

const AUTH_STORAGE_KEY = "casasim_auth_user";

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsPending(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Validación básica
    if (!email || !password) {
      return false;
    }

    // Simular delay de autenticación
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Crear usuario
    const newUser: User = {
      email,
      name: email.split("@")[0],
    };

    // Guardar en localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <LocalAuthContext.Provider value={{ user, isPending, login, logout }}>
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth() {
  const context = useContext(LocalAuthContext);
  if (!context) {
    throw new Error("useLocalAuth must be used within a LocalAuthProvider");
  }
  return context;
}
