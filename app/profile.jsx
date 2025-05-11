import { View, Text, StyleSheet } from "react-native";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello! Welcome to your profile page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});