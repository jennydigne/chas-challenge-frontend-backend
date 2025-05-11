import React from "react";
import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from "react-native";
import backgroundImage from '../assets/images/Violet.png';
import MyButton from "./components/Button";
import { useRouter } from "expo-router";

export default function AvatarScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={backgroundImage} style={{flex: 1}} resizeMode="cover">
      <View style={styles.container}>
        {/* Avatar */}
        <Image
          source={require("../assets/images/purple-ellipse.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>I'm Neu, your personal AI</Text>
        <Text style={styles.subtitle}>
          {
            "I'd like to get to know you better to assist you more effectively. Do you have time for a few questions?"
          }
        </Text>
        {/* Buttons */}
        <View style={styles.buttonContainerLarge}>
          <MyButton title="Get started" onPress={() => router.push("/onboarding-chat")} />
        </View>
        <View style={styles.buttonContainerSmall}>
          <Pressable onPress={() => router.push("/profile")}>
            <Text style={{ fontWeight: 'bold' }}>Do it later</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 38,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    alignSelf: "center"
  },

  name: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },

  subtitle: {
    marginBottom: 20,
    color: "black",
    marginRight: 40,
    fontSize: 16
  },

  buttonContainerSmall: {
    marginVertical: 5,
    alignItems: "flex-start",
  },

  buttonContainerLarge: {
    marginVertical: 5,
  },

  buttonBlack: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "black",
    alignItems: "center",
  },

  buttonTransparent: {
    backgroundColor: "transparent",
    alignItems: "center",
  },

  whiteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  blackText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});
