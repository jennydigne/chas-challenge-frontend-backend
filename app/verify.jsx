import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, ImageBackground, Button } from 'react-native';
import { useRouter } from 'expo-router';
import Feather from "@expo/vector-icons/Feather";
import ProgressBar from './components/ProgressBar';
import backgroundImage from '../assets/images/Violet.png';

export default function VerifyScreen() {
  const [code, setCode] = useState(Array(6).fill(''));
  const inputs = useRef([]);
  const router = useRouter();

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
    // Add actual resend logic here
  };

  const handleSubmit = () => {
    const codeString = code.join('');
    if (codeString.length === 6) {
      console.log('Code submitted:', codeString);
      router.push('/personal');
    } else {
      alert('Please enter a 6-digit code');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Pressable onPress={() => router.push("/signup")}>
            <Feather name="chevron-left" size={30} color="black" />
          </Pressable>
          <View style={styles.progress}>
            <ProgressBar progress={2 / 4} />
          </View>
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
          <Text style={styles.grayText}>Didn't receive the code?</Text>
          <TouchableOpacity onPress={resendCode}>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover"
  },
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 38
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
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
    fontSize: 14,
  },
  submitButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
  progress: {
    marginLeft: 20,
    flex: 1
  },
  top: {
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
  },
});
