import api from './axios.js';

export const postLoginRequest = body => api.post('/login', body);

export const postUserRequest = body => api.post('/register', body);

export const getUsersRequest = () => api.get('/users');

export const verifyTokenRequest = () => api.get('/verify');
