import { createContext, useContext, useEffect, useState } from "react";
import Snack from '../components/Snack';
import axiosInstance from '../service/interceptor';


const Context = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackTitle, setSnackTitle] = useState('');


    // восстановить состояние аутентификации из sessionStorage
    // useEffect(() => {
    //   const storedAuth = sessionStorage.getItem("auth");
    //   if (storedAuth) {
    //     setAuth(storedAuth === "true");
    //   }
    // }, []);

  const login = () => {
    setAuth(true);
    // showSnack('Has iniciado sesión correctamente')
  };

  const logout  = async () => {
    try {
      const response = await axiosInstance.post('/logout')
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('userRole');
      setAuth(false);
      // console.log(response.data);
      showSnack('Has terminado tu sesion')
    } catch (e) {
        console.error(e);
    }

  };

  const showSnack = (title, message) => {
    setSnackTitle(title);
    setSnackMessage(message);
    setSnackOpen(true);
  };

  const handleClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  return (
    <Context.Provider value={{ auth, login, logout, showSnack }}>
      {children}
      <Snack snackOpen={snackOpen} handleClose={handleClose} title={snackTitle} message={snackMessage} />
    </Context.Provider>
  );
};

export const useAuth = () => {
  return useContext(Context);
};
