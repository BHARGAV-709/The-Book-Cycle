import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, storage } from "./storage";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, password?: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.init();
    const sessionId = localStorage.getItem("bookcycle_session");
    if (sessionId) {
      const users = storage.users.get();
      const currentUser = users.find(u => u.id === sessionId);
      if (currentUser) {
        setUser(currentUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password?: string) => {
    const users = storage.users.get();
    const found = users.find(u => u.email === email && (!password || u.password === password));
    if (found) {
      setUser(found);
      localStorage.setItem("bookcycle_session", found.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bookcycle_session");
  };

  const signup = (name: string, email: string, password?: string) => {
    const users = storage.users.get();
    if (users.find(u => u.email === email)) {
      return false; // User exists
    }
    const newUser: User = {
      id: "user-" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      role: "student",
      createdAt: new Date().toISOString(),
    };
    storage.users.set([...users, newUser]);
    setUser(newUser);
    localStorage.setItem("bookcycle_session", newUser.id);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
