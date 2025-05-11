import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';


export const saveMessage = async (userId, message, sender) => {
  try {
    const messagesRef = collection(db, 'users', userId, 'messages');
    await addDoc(messagesRef, {
      text: message,
      sender: sender,
      timestamp: serverTimestamp(),
    });
    console.log('Meddelande sparat!');
  } catch (error) {
    console.error('Fel vid sparande av meddelande:', error);
  }
};