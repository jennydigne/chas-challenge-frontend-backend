import { View, Text, StyleSheet } from "react-native";
import MyButton from "./Button"; 
import { useRouter } from "expo-router"; 

export default function RequireLoginMessage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please sign in to your account!</Text>
      <MyButton title="Sign in" onPress={() => router.push("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});