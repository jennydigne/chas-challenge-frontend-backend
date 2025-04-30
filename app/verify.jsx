import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import app from '../firebaseConfig';
import { router, useRouter } from 'expo-router';

export default function VerifyScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const auth = getAuth(app);

  const sendVerificationEmail = async () => {
    setIsLoading(true);
    try {
      // Replace with your function to send email
      // await backendService.sendVerificationCode(email);

      setCodeSent(true);
      Alert.alert('Verification Email Sent', `Check your email inbox, we have sent you the code at ${email}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setIsLoading(false);
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      // Replace with actual code verification logic
      if (code === '123456') {  // Example placeholder
        Alert.alert('Verification successful!');
        router.replace('/chat'); // Navigate to the chat screen or dashboard
      } else {
        Alert.alert('Verification failed', 'Invalid code.');
      }
    } catch (error) {
      Alert.alert('Verification failed', error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Account</Text>

      {!codeSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            title={isLoading ? "Sending..." : "Send Verification Code"}
            onPress={sendVerificationEmail}
            disabled={isLoading || !email.trim()}
          />
        </>
      ) : (
        <>
          <Text>Check your email inbox, we have sent you the code at {email}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Verification Code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
          />
          <Button
            title={isLoading ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            disabled={isLoading || !code.trim()}
          />
          <Button
            title="Didn't receive the code? Resend"
            onPress={sendVerificationEmail}
            disabled={isLoading}
          />
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