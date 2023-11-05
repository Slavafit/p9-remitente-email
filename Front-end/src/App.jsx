import { useState } from 'react'
import Home from './Home'
import LogIn from './components/LogIn';
import PageNotFound from './PageNotFound';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import { AuthProvider, useAuth } from "./service/AuthContext";



const ProtectedRoute = ({ element }) => {
  const { auth } = useAuth(); // Получите состояние авторизации из вашего AuthContext
  const navigate = useNavigate();

  if (!auth) {
    navigate('/signin'); // Перенаправить на страницу входа, если пользователь не авторизован
    return null;
  }

  return element;
};

function App() {
  
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
            {/* <Route path="/home" element={<ProtectedRoute element={<Home />} />} /> */}
            <Route path="/" element={<LogIn />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
