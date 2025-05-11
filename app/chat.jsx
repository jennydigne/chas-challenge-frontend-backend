import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { saveMessage } from "../saveMessage";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import LogoutButton from "./components/LogoutButton";
import { useRouter, useLocalSearchParams } from "expo-router";
import MyButton from "./components/Button";
import { ImageBackground } from "react-native";
import backgroundImage from "../assets/images/Violet.png";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();
  const { onboarding } = useLocalSearchParams();
  const [isOnboarding, setIsOnboarding] = useState(onboarding === "true");
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [hasStartedOnboarding, setHasStartedOnboarding] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const onboardingQuestions = [
    "Question 1: What do you feel are your main challenges?",
    "Question 2: What do you feel helps you the most?",
    "Question 3: When would you like to receive reminder notifications?",
  ];

  useEffect(() => {
    if (!user) return;

    if (!isOnboarding) {
      const messagesRef = collection(db, "users", user.uid, "messages");
      const q = query(messagesRef, orderBy("timestamp", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(loadedMessages);
      });

      return () => unsubscribe();
    }
  }, [user, isOnboarding]);

  useEffect(() => {
    if (isOnboarding && !hasStartedOnboarding) {
      setHasStartedOnboarding(true);

      const intro = {
        id: `bot_${uniqueId()}`,
        text:
          "Hi! Glad you found your way here! 😊 I'd like to understand a bit more about you, please answer the following questions!",
        sender: "bot",
      };
      const firstQuestion = {
        id: `bot_${uniqueId()}`,
        text: onboardingQuestions[0],
        sender: "bot",
      };
      setMessages([firstQuestion, intro]);
    }
  }, [isOnboarding]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 40, fontSize: 18, textAlign: "center" }}>
          You need to be signed in to use the chat.
        </Text>
        <Button title="Sign in" onPress={() => router.push("/login")} />
      </View>
    );
  }

  const uniqueId = () =>
    `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();

    const userMessage = {
      id: `user_${uniqueId()}`,
      text,
      sender: "user",
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");

    if (isOnboarding) {
      const onboardingRef = collection(db, "users", user.uid, "onboardingAnswers");
      await addDoc(onboardingRef, {
        question: onboardingQuestions[onboardingStep],
        answer: text,
        timestamp: serverTimestamp(),
      });

      if (onboardingStep < onboardingQuestions.length - 1) {
        const nextQuestion = onboardingQuestions[onboardingStep + 1];
        const botMessage = {
          id: `bot_${uniqueId()}`,
          text: nextQuestion,
          sender: "bot",
        };
        setTimeout(() => {
          setMessages((prev) => [botMessage, ...prev]);
          setOnboardingStep((step) => step + 1);
        }, 500);
      } else {
        setTimeout(() => {
          const completeMessage = {
            id: `bot_${uniqueId()}`,
            text: "Thats all questions! Thank you for taking the time!😌",
            sender: "bot",
          };
          setMessages((prev) => [completeMessage, ...prev]);
          setIsOnboarding(false);
        }, 500);
      }

      return;
    }

    await saveMessage(user.uid, text, "user");

    try {
      const response = await fetch("http://192.168.0.216:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "tinyllama:chat",
          prompt: `${text}`,
          stream: false,
        }),
      });

      const data = await response.json();

      const botMessage = {
        id: `bot_${uniqueId()}`,
        text: data.response,
        sender: "bot",
      };

      setMessages((prev) => [botMessage, ...prev]);
      await saveMessage(user.uid, data.response, "bot");
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <ImageBackground source={backgroundImage} style={{flex: 1}} resizeMode="cover">
      <View style={styles.container}>
        {/* Header with avatar and welcome message */}
        <View style={styles.header}>
          <View style={styles.logoutContainer}>
            <LogoutButton />
          </View>
          <View style={styles.centered}>
            <Image
              source={require("../assets/images/purple-ellipse.png")}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {"Hello I'm NEU, your personal AI,\nwhat can I do for you today?"}
            </Text>
          </View>
          <View style={styles.hr} />
        </View>
        {/* Chat content below header */}
        <KeyboardAvoidingView
          style={styles.chatWrapper}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.chatContainer}>
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={
                      item.sender === "user"
                        ? styles.userBubble
                        : styles.botBubble
                    }
                  >
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                )}
                inverted
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            </View>

            {!isOnboarding && (
              <Button title="Start a new chat" onPress={startNewChat} />
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Write a message"
              />
              <Button title="Send" onPress={sendMessage} />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  logoutContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  centered: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 65,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 20,
  },
  chatWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#ECE9FB",
    boxShadow: "0px -2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FAFAFA",
    boxShadow: "0px -2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
});
