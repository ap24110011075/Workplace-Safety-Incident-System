import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProfile, loginUser, registerUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        const mergedUser = { ...user, ...profile };
        setUser(mergedUser);
        localStorage.setItem("user", JSON.stringify(mergedUser));
      } catch (error) {
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    toast.success("Login successful");
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    toast.success("Registration successful");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
