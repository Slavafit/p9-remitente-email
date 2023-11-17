import axios from 'axios';
import Swal from 'sweetalert2'

// Функция для аутентификации пользователя
const authUser = async (email, password) => {
  try {
    // Проверить, есть ли токен в sessionStorage
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      // Если токен уже есть в localStorage, используйте его для аутентификации
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      return true;
      } else {
      // Отправить запрос на сервер с именем пользователя и паролем
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      // Получить JWT-токен и прочее из ответа сервера
      const token = response.data.token;
      const userId = response.data.userData.userId;
      const username = response.data.userData.username;
      const userRole = response.data.userData.role;
      // Сохранить токен и остальное в sessionStorage или в памяти приложения
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userRole', userRole);
      sessionStorage.setItem('userRole', userRole);
      // Вернуть успех
      return true;
    }
  } catch (error) {
    // Вернуть ошибку аутентификации
    const response = error.response.data.message
    // console.log("Error authUser", response);
    showAlert(response);
    return false;
  }

  function showAlert(response) {
    Swal.fire(
      `${response}`,
      'Por favor repita su entrada',
      'warning'
    )
  }  
};

// Функция для добавления токена в заголовок запроса
const addTokenToHeaders = () => {
  const token = sessionStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

 
export { authUser, addTokenToHeaders };

