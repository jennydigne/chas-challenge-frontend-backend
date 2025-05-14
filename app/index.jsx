import { View, Image, StyleSheet, ImageBackground, Button, Text } from "react-native";
import backgroundImage from '../assets/images/Violet_2.png';
import MyButton from "./components/Button";
import { useRouter } from "expo-router";
import Divider from "./components/Divider";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.content}>
        <Image style={styles.image}
          source={require("../assets/images/LogoText.png")}
        />
        <View style={styles.buttons}>
          <MyButton title="Sign in" onPress={() => router.push("/login")} />
          <Divider
            text="or"
            paddingHorizontal={60}
            marginBottom={10}
            marginTop={10}
          />
          <MyButton title="Sign up" onPress={() => router.push("/signup")} />
        </View>
        {/* Testlänkar */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Button title="chat" onPress={() => router.push("/chat")} />
          <Button title="get started" onPress={() => router.push("/getstarted")} />
          <Button title="profile" onPress={() => router.push("/profile")} />
          <Button title="chat-options" onPress={() => router.push("/chat-options")} />
          <Button title="verify" onPress={() => router.push("/verify")} />
          <Button title="personal" onPress={() => router.push("/personal")} />
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
  image: {
    width: 195,
    height: 50.9
  },
  buttons: {
    gap: 5
  }
});

