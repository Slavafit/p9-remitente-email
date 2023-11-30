import { createContext, useContext, useEffect, useState } from "react";
import Snack from '../components/Snack'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackTitle, setSnackTitle] = useState('');

  let severity = 'success';
  if (snackTitle === 'warning') {
    severity = 'warning';
  } else if (snackTitle === 'error') {
    severity = 'error';
  }

    // восстановить состояние аутентификации из sessionStorage
    useEffect(() => {
      const storedAuth = sessionStorage.getItem("auth");
      if (storedAuth) {
        setAuth(storedAuth === "true");
      }
    }, []);

  const login = () => {
    setAuth(true);
    showSnack('success', 'Has iniciado sesión correctamente')
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    setAuth(false);
    showSnack('success', 'Has terminado tu sesion')
  };

  const showSnack = (title, message) => {
    setSnackTitle(title);
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, showSnack }}>
      {children}
      <Snack snackOpen={snackOpen} handleClose={handleClose} title={snackTitle} message={snackMessage} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
