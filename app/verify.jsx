import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Ensure expo-router is correctly imported

export default function VerifyScreen() {
  const [code, setCode] = useState(Array(6).fill(''));
  const inputs = useRef([]);
  const router = useRouter();  // Hook to access navigation

  const handleChange = (text, index) => {
    if (text.length > 1) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const resendCode = () => {
    console.log('Code resent');
    // Here, you might want to implement actual logic to resend the code
  };

  const handleSubmit = () => {
    const codeString = code.join('');
    if (codeString.length === 6) {
      console.log('Code submitted:', codeString);
      router.push('/personal'); // Route to Personal screen
    } else {
      alert('Please enter a 6-digit code');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarActive} />
        <View style={styles.progressBarInactive} />
      </View>

      <Text style={styles.title}>Verify account</Text>
      <Text style={styles.subtitle}>
        Check your email inbox, we have sent you the code at <Text style={{ fontWeight: 'bold' }}>xxx@example.com</Text>
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            style={styles.codeInput}
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <TouchableOpacity onPress={resendCode}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
        <Text style={styles.grayText}>Didn’t not receive the code?</Text>
      </View>

      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.submitButton}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 4,
    marginBottom: 40,
    marginHorizontal: 16,
  },
  progressBarActive: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 2,
  },
  progressBarInactive: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeInput: {
    borderBottomWidth: 2,
    borderColor: '#333',
    width: 40,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    paddingVertical: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resendText: {
    fontWeight: 'bold',
    color: '#000',
  },
  grayText: {
    color: '#666',
    fontSize: 13,
  },
  submitButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
});
