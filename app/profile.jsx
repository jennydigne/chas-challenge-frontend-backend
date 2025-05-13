import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import backgroundImage from '../assets/images/Violet.png';
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();
  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.header}>
        <Image
          source={require("../assets/images/purple-ellipse.png")}
          style={styles.avatar}
        />
        <Text style={styles.text}>Good morning!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Check in</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Mood track</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardText}>Saved</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardText}>Learn</Text>
          </View>
        </View>
      </View>

      <View style={styles.nav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/chat')}>
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    paddingBottom: 10,
    paddingTop: 40,
    paddingHorizontal: 10,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
    alignSelf: "center"
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "48%", 
    height: 120,
    boxShadow: "0px -2px 4px 0px #D6D0F6, 0px 4px 4px 0px #D6D0F6",
    justifyContent: "flex-end"
  },
  cardText: {
    fontSize: 18,
    fontWeight: 500,
    marginLeft: 10,
    marginBottom: 10
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    borderRadius: 20,
    paddingVertical: 30,
    backgroundColor: "#FAFAFA",
    boxShadow: "0px -2px 4px 0px rgba(0, 0, 0, 0.10)",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#191919",
  },
});