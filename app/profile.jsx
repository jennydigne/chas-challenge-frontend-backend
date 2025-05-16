import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from "react-native";
import backgroundImage from '../assets/images/Violet.png';
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { defaultShadow } from "../styles/shadows";
import LogoutButton from "./components/LogoutButton";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      try {
        const docRef = doc(db, "profiles", user.uid, "personal", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data?.name) {
            setName(data.name.split(" ")[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    fetchName();
  }, []);

  const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <View style={styles.header}>
        <View style={styles.icons}>
          <LogoutButton />
          <Feather name="edit" size={20} color="#191919" style={styles.icon} />
          <Feather name="hexagon" size={20} color="black" />
        </View>
        <Image
          source={require("../assets/images/purple-ellipse.png")}
          style={styles.avatar}
        />
        <Text style={styles.text}>{getGreeting()}, {name}!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.card}>
            <Image source={require("../assets/images/checkin.png")} style={styles.cardImage} />
            <Text style={styles.cardText}>Check in</Text>
          </View>
          <View style={styles.card}>
            <Image source={require("../assets/images/moodtrack.png")} style={styles.cardImage} />
            <Text style={styles.cardText}>Mood track</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.card}>
            <Image source={require("../assets/images/saved.png")} style={styles.cardImage} />
            <Text style={styles.cardText}>Saved</Text>
          </View>
          <View style={styles.card}>
            <Image source={require("../assets/images/learn.png")} style={styles.cardImage} />
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
    width: "100%",
    position: "relative"
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
    alignSelf: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    zIndex: 1,
    position: "relative"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    width: "46%",
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
    ...defaultShadow,
    zIndex: 1,
    position: "relative",
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
    alignItems: "center"
  },
  icon: {
    marginRight: 8
  },
  cardImage: {
    alignSelf: "center",
    height: 56,
    width: 56,
    marginBottom: 5
  }
});