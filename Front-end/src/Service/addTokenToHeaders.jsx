import axios from "axios";

// Функция для добавления токена в заголовок запроса
const addTokenToHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

 
export { addTokenToHeaders };

