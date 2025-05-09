import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from 'axios';

// Define types for API responses
interface AuthResponse {
  access?: string;
  refresh?: string;
  detail?: string;
}

// Define AuthContext type
interface AuthContextType {
  isAuthenticated: boolean;
  login: (mobile: string, otp: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, confirmPassword: string, name: string, username: string) => Promise<AuthResponse>;
  logout: () => void;
}

// Create context with default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) verifyToken(token);
  }, []);

  const verifyToken = async (token: string): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_URL}/users/verify/`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        await refreshToken();
      }
    } catch {
      await refreshToken();
    }
  };

  const refreshToken = async (): Promise<void> => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return logout();

    try {
      const response = await axios.post(
        `${API_URL}/users/token/refresh/`,
        { refresh },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const login = async (mobile: string, otp: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${API_URL}/users/auth/verify-otp/`,
        { mobile, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log('Login response:', data);

      if (data.access && data.refresh) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        setIsAuthenticated(true);
        console.log('Authentication successful');
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return { detail: "OTP login failed. Please try again." };
    }
  };

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    username: string
  ): Promise<AuthResponse> => {
    try {
      const response = await axios.post(
        `${API_URL}/users/register/`,
        { email, password, confirmPassword, name, username },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      if (data.access && data.refresh) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        setIsAuthenticated(true);
      }
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      return { detail: "Signup failed. Please try again." };
    }
  };

  const logout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};