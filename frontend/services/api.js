import axios from 'axios';

export const HOST = 'http://192.168.0.150:8080';

export const API = axios.create({
  baseURL: `${HOST}/api`,
});

export const FILE_API = axios.create({
  baseURL: HOST,
});
