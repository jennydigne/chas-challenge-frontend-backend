import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Button,
  Text,
} from "react-native";
import backgroundImage from "../assets/images/Violet_2.png";
import MyButton from "../components/Button";
import { useRouter } from "expo-router";
import Divider from "../components/Divider";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Image
          style={styles.image}
          source={require("../assets/images/LogoText.png")}
        />
        <View>
          <MyButton title="Sign in" onPress={() => router.push("/login")} />
          <Divider
            text="or"
            paddingHorizontal={60}
            marginBottom={15}
            marginTop={15}
          />
          <MyButton title="Sign up" onPress={() => router.push("/signup")} />
        </View>

        {/* Testlänkar */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Button title="chat" onPress={() => router.push("/chat")} />
          {/* 
          <Button title="profile" onPress={() => router.push("/profile")} />
          <Button
            title="chat-options"
            onPress={() => router.push("/chat-options")}
          />
          <Button title="verify" onPress={() => router.push("/verify")} />
          <Button title="personal" onPress={() => router.push("/personal")} />
          <Button title="calender" onPress={() => router.push("/calender")} /> */}
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
    paddingHorizontal: 20,
  },
  image: {
    width: 195,
    height: 50.9,
    marginBottom: 60,
  },
});
