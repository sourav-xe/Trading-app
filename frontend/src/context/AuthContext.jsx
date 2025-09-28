import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
  );
  const [loading, setLoading] = useState(false);

  // signup: pass a FormData instance
  const signup = async (formData) => {
    try {
      setLoading(true);
      // DO NOT set Content-Type here — axios/browser will set the boundary
      const { data } = await axios.post("http://localhost:5000/api/auth/signup", formData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      throw err.response?.data || { message: "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err.response?.data || { message: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
