import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function AvatarScreen() {
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image
        source={require("../assets/images/Ai.png")}
        style={styles.avatar}
      />
      <Text style={styles.name}>I´m Neu, your personal AI</Text>
      <Text style={styles.subtitle}>
        {
          "I’d like to get to know you better to\n assist you more effectively. Do you have\n time for a few questions?"
        }
      </Text>

      {/* Buttons */}
      <View style={styles.buttonContainerLarge}>
        <TouchableOpacity style={styles.buttonBlack} onPress={() => {}}>
          <Text style={styles.whiteText}>Get started</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainerSmall}>
        <Link href="/chat">
          <TouchableOpacity style={styles.buttonTransparent} onPress={() => {}}>
            <Text style={styles.blackText}>Do it later</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 60,
    marginBottom: 10,
  },

  name: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    color: "black",
  },

  buttonContainerSmall: {
    width: "80%",
    marginVertical: 5,
    alignItems: "flex-start",
  },

  buttonContainerLarge: {
    width: "80%",
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
