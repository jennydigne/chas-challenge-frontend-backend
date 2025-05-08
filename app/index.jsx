import { View, Image, StyleSheet, ImageBackground } from "react-native";
import backgroundImage from '../assets/images/Violet_2.png';
import MyButton from "./components/Button";
import { useRouter } from "expo-router";
import Divider from "./components/Divider";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.content}>
        <Image
          source={require("../assets/images/LogoText.png")}
          style={{ width: 195, height: 50.9 }}
        />

        <View style={{ gap: 5 }}>
          <MyButton title="Sign in" onPress={() => router.push("/login")} />
          <Divider
            text="or"
            paddingHorizontal={60}
            marginBottom={10}
            marginTop={10}
          />
          <MyButton title="Sign up" onPress={() => router.push("/signup")} />
          <MyButton title="chat" onPress={() => router.push("/chat")} />
          <MyButton title="getstarted" onPress={() => router.push("/getstarted")} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
    paddingHorizontal: 20,
  },
});

