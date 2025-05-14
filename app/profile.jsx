import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import backgroundImage from '../assets/images/Violet.png';
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { defaultShadow } from "../styles/shadows";

export default function Profile() {
  const router = useRouter();
  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.header}>
        <View style={styles.icons}>
          <Feather name="edit" size={20} color="#191919" />
          <Feather name="hexagon" size={24} color="black" />
        </View>
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
          <Feather name="users" size={20} color="#2D2D2D" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Feather name="book-open" size={20} color="#2D2D2D" />
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/chat-options')}>
          <Feather name="message-circle" size={20} color="#2D2D2D" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <Octicons name="person-fill" size={20} color="#2D2D2D" />
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
    width: "100%"
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
    ...defaultShadow,
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
    ...defaultShadow
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#191919",
  },
  icons: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  }
});