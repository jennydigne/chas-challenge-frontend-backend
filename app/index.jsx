import { Text, View, Image } from "react-native";
import { Link } from "expo-router";
import MyButton from "../.expo/components/Button";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 60,
        backgroundColor: "#fed9b7"
      }}
    >
      <View>
        <Image source={require('../assets/images/LogoText.png')} style={{ width: 195, height: 50.9 }} />
      </View>
      <View
        style={{
          gap: 50
        }}>
        <MyButton title="Sign in"
          onPress={() => router.push('/login')} />
        <MyButton title="Sign up"
          onPress={() => router.push('/signup')} />
      </View>
    </View>
  );
}


