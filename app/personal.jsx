import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import app from '../firebaseConfig';

export default function PersonalScreen() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = doc(firestore, 'users', user.uid);
          const docSnap = await getDoc(userDoc);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setUsername(data.username || '');
          } else {
            Alert.alert('Data fetch failed', 'No user data found.');
          }
        } catch (error) {
          Alert.alert('Error fetching data', error.message);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleUpdate = async () => {
    if (user) {
      try {
        const userDoc = doc(firestore, 'users', user.uid);
        await updateDoc(userDoc, {
          name,
          username,
        });
        Alert.alert('Update successful', 'Your personal information has been updated.');
      } catch (error) {
        Alert.alert('Update failed', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Data</Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <Button title="Continue" onPress={handleUpdate} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});