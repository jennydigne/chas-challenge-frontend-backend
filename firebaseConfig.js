import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDe1qc1MmphawtK0PbPCSeQL1k4XraD7gE",
  authDomain: "neu-firebase-b190a.firebaseapp.com",
  projectId: "neu-firebase-b190a",
  storageBucket: "neu-firebase-b190a.appspot.com",
  messagingSenderId: "877049946369",
  appId: "1:877049946369:web:ff4c4930b7d7be3e4a7b00"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };