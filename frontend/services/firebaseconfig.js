// firebase-config.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyAPyjvaKAJzTdw6v-DB9-u7OBM9MMiXRl0',
  authDomain: 'bookatable-7c3aa.firebaseapp.com',
  projectId: 'bookatable-7c3aa',
  storageBucket: 'bookatable-7c3aa.firebasestorage.app',
  messagingSenderId: '523601358242',
  appId: '1:523601358242:ios:6b658a538b2631f71856fb',
};

const app = initializeApp(firebaseConfig);
export default app;
