import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10
      }}
    >
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold'
      }}>Welcome to Neu! 
      </Text>
      <Link href="/chat">Chat</Link>
      <Link href="/login">Log in</Link>
    </View>
  );
}
