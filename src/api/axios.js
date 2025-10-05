// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:4000/api',
//   withCredentials: true,
// });

// export default api;
import axios from 'axios';

// Use relative URL - the browser will use the same origin
const api = axios.create({
  baseURL: '/api', // Relative path
  withCredentials: true,
});

export default api;
