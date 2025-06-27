import axios from 'axios';

export const HOST = 'http://192.168.0.234:8080';

export const FILE_HOST = HOST;

export const API = axios.create({
  baseURL: `${HOST}/api`,
});

export const FILE_API = axios.create({
  baseURL: HOST,
});
