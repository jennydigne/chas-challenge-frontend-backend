import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebaseConfig";
import { router } from "expo-router";
import { getBackgroundColorAsync } from "expo-system-ui";
import { Image } from "react-native";

import { TouchableOpacity } from "react-native";



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
      <Text style={styles.title}>Sign in</Text>
      <Text style={{ padding: 5 }}> Email </Text>
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={{ padding: 5 }}> Password </Text>
      <TextInput
        style={[styles.input, { backgroundColor: "white" }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>
      <View style={styles.separatorContainer}>
        <View style={styles.line} />
        <Text style={styles.separatorText}>Or sign in with</Text>
        <View style={styles.line} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          marginHorizontal: 60,
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
        <Text style={{ textAlign: "center" }}>
          Don`t have an account ?{" "}
          <Text
            onPress={() => router.push("/signup")}
            style={{ fontWeight: "bold" }}
          >
            {" "}
            Singn up
          </Text>
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
    backgroundColor: "white",
  },
  loginButton: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#666",
  },
});
