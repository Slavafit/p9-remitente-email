import axios from "axios";

// Функция для добавления токена в заголовок запроса
const addTokenToHeaders = () => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

 
export { addTokenToHeaders };

