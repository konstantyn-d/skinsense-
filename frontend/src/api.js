import axios from 'axios';

const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api';
console.log('API base:', base); // временно для проверки

//const api = axios.create({ baseURL: base });
const api = axios.create({ baseURL: 'http://localhost:4000/api' });


api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    console.error('API error =>', {
      url: err?.config?.baseURL + err?.config?.url,
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message
    });
    return Promise.reject(err);
  }
);

export default api;
