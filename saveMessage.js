import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const saveMessage = async (userId, message, sender, sessionId) => {
  if (
    typeof message === "undefined" ||
    message === null ||
    message.trim() === ""
  ) {
    console.warn("Cannot save an empty or invalid message.");
    return;
  }
  try {
    const messagesRef = collection(db, 'users', userId, 'messages');
    await addDoc(messagesRef, {
      text: message,
      sender: sender,
      sessionId: sessionId,
      timestamp: serverTimestamp(),
    });
    console.log('Message saved!');
  } catch (error) {
    console.error('Error saving message:', error);
  }
};