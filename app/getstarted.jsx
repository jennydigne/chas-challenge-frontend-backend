import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from "react-native";
import backgroundImage from '../assets/images/Violet.png';
import MyButton from "../components/Button";
import { useRouter } from "expo-router";

export default function AvatarScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/purple-ellipse.png")}
          style={styles.avatar}
        />
        <Text style={styles.name}>I'm Neu, your personal AI</Text>
        <Text style={styles.subtitle}>I'd like to get to know you better to assist you more effectively. Do you have time for a few questions?</Text>
        <MyButton title="Get started" onPress={() => router.push("/onboarding-chat")} />
        <View style={styles.link}>
          <Pressable onPress={() => router.push("/profile")}>
            <Text style={styles.blackText}>Do it later</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  background: {
    flex: 1,
    resizeMode: "cover"
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
    marginBottom: 5
  },
  subtitle: {
    marginBottom: 20,
    color: "black",
    marginRight: 40,
    fontSize: 16
  },
  link: {
    marginTop: 5,
  },
  blackText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
});
