import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);

    // восстановить состояние аутентификации из sessionStorage
    useEffect(() => {
      const storedAuth = sessionStorage.getItem("auth");
      if (storedAuth) {
        setAuth(storedAuth === "true");
      }
    }, []);

  const login = () => {
    setAuth(true);
    sessionStorage.setItem("sessionStorage", "true");
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    sessionStorage.removeItem('sessionStorage');
    setAuth(false);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
