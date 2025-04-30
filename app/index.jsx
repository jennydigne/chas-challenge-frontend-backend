import { View, Image, StyleSheet } from "react-native";
import { Video } from "expo-av";
import MyButton from "../.expo/components/Button";
import { useRouter } from "expo-router";
import Divider from "../.expo/components/Divider";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/gradient-start.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />
      <View style={styles.content}>
        <Image
          source={require("../assets/images/LogoText.png")}
          style={{ width: 195, height: 50.9 }}
        />

        <View style={{ gap: 5 }}>
          <MyButton title="Sign in" onPress={() => router.push("/login")} />
          <Divider />
          <MyButton title="Sign up" onPress={() => router.push("/signup")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
    paddingHorizontal: 20,
  },
});
