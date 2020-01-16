import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.7:3333', // emulador: http://localhost:3333 // emulador android: 10.0.2.2
});

export default api;
