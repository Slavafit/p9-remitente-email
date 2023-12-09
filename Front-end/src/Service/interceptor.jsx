import axios from 'axios';
const base_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: base_URL,
  withCredentials: true,
});

//интерцептор запроса
axiosInstance.interceptors.request.use((config) => {
  console.log("request");
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    'accessToken'
  )}`;
  return config;
});
// Интерцептор для обработки успешных ответов от сервера
axiosInstance.interceptors.response.use(
(response) => response, // просто возвращаем ответ, если все в порядке
async (error) => {
  const originalRequest = error.config;

  // Проверяем, был ли ответ с кодом 401 и мы не пытаемся уже обновить токен
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // помечаем запрос как "повторный"
    console.log("401");
    // Пытаемся получить обновленный токен
    const response = await axios.get(`${base_URL}/refresh`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      let accessToken = response.data.accessToken;
      // Если получение обновленного токена прошло успешно, сохраняем новый токен и повторяем оригинальный запрос
      localStorage.setItem('accessToken', accessToken);
      originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;

      return axiosInstance(originalRequest);
    }
  }

  // Если запрос не может быть повторен или обновление токена не удалось, просто отклоняем ошибку
  return Promise.reject(error);
}
);
export default axiosInstance;
