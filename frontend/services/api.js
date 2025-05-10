import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://192.168.0.234:8080/api', // pentru login, register, etc.
});

export const FILE_API = axios.create({
  baseURL: 'http://192.168.0.234:8080', // pentru /verify/submit (fără /api)
});