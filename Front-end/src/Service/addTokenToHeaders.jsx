import axios from "axios";
const base_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: base_URL,
  withCredentials: true,
});


//интерцептор запроса
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    'accessToken'
  )}`;
  return config;
});
//интерцептор ответа
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && !originalRequest.sent) {
      originalRequest.sent = true; // помечаем запрос как "повторный"
      try {
        console.log("refresh");
        // Пытаемся получить обновленный токен
        const response = await axios.get(`${base_URL}/refresh`);
        let accessToken = response.data.accessToken;
        // Если получение обновленного токена прошло успешно, сохраняем новый токен и повторяем оригинальный запрос
        localStorage.setItem("accessToken", accessToken);
        return api.request(originalRequest);
      } catch (e) {
        console.log("не авторизован", e);
      }
    }
    throw error;
});

export { api };
