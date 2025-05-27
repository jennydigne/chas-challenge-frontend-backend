import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MyButton from "../components/Button";
import ProgressBar from "../components/ProgressBar";
import backgroundImage from "../assets/images/Violet.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import BirthdatePicker from "../components/BirthDatePicker";

export default function Personal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [birthDate, setbirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [customGender, setCustomGender] = useState("");

  const isFormValid =
    name.trim() !== "" &&
    username.trim() !== "" &&
    gender !== "" &&
    birthDate !== "";
  gender !== "Other" || customGender.trim() !== "";

  const saveProfileData = async () => {
    if (!isFormValid) {
      Alert.alert("Please fill in all fields before continuing.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("No user logged in");
      return;
    }

    try {
      const personalDocRef = doc(db, "profiles", user.uid, "personal", "data");
      await setDoc(
        personalDocRef,
        {
          name,
          username,
          birthDate,
          gender,
          gender: gender === "Other" ? customGender : gender,
        },
        { merge: true }
      );

      router.push("/getstarted");
    } catch (error) {
      Alert.alert("Failed to save profile data", error.message);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Pressable onPress={() => router.push("/verify")}>
            <Feather name="chevron-left" size={30} color="black" />
          </Pressable>
          <View style={styles.progress}>
            <ProgressBar progress={3 / 4} />
          </View>
        </View>

        <Text style={styles.title}>Personal data</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor={"#aaa"}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="your_username"
          placeholderTextColor={"#aaa"}
          value={username}
          onChangeText={setUsername}
        />
        <Text style={styles.label}>Date of birth</Text>
        <View>
          <BirthdatePicker value={birthDate} onChange={setbirthDate} />
        </View>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderContainer}>
          {["Male", "Female", "Other"].map((option) => (
            <Pressable
              key={option}
              onPress={() => setGender(option)}
              style={[
                styles.genderButton,
                gender === option && styles.genderButtonSelected,
              ]}
            >
              <View
                style={[
                  styles.radioOuter,
                  gender === option && styles.radioOuterSelected,
                ]}
              >
                {gender === option && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.genderText}>{option}</Text>
            </Pressable>
          ))}
        </View>
        {gender === "Other" && (
          <TextInput
            style={styles.input}
            placeholder="Please specify"
            placeholderTextColor="#aaa"
            value={customGender}
            onChangeText={setCustomGender}
          />
        )}
        <MyButton
          title="Continue"
          onPress={saveProfileData}
          disabled={!isFormValid}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    paddingVertical: 38,
    paddingHorizontal: 40,
  },
  top: {
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#787878",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  progress: {
    marginLeft: 20,
    flex: 1,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  genderButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#693ED6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: "#693ED6",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#693ED6",
  },
  genderText: {
    fontSize: 16,
  },
});
