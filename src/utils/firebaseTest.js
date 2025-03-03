import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    const testDoc = await addDoc(collection(db, 'test'), {
      test: true,
      timestamp: new Date().toISOString()
    });
    console.log('Test document written with ID: ', testDoc.id);
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    throw error;
  }
}; 