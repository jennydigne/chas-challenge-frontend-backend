import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { router } from "expo-router";
import { getBackgroundColorAsync } from "expo-system-ui";
import { Image } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login successful!");
      router.replace("/chat");
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Log in" onPress={handleLogin} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Image
          source={require("../assets/images/google.jpg")}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <Image
          source={require("../assets/images/Apple.png")}
          style={{ width: 50, height: 50 }}
        />
        <Image
          source={require("../assets/images/Facebook.png")}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: "right" }}>
          Don`t have an account? Sign upp{" "}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
