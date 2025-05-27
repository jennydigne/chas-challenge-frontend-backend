import { useState, useEffect } from "react";
import { OPENAI_API_KEY } from "@env";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ImageBackground,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { getAuth } from "firebase/auth";
import { saveMessage } from "../utils/saveMessage";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import { useRouter, useLocalSearchParams } from "expo-router";
import backgroundImage from "../assets/images/Violet.png";
import { defaultShadow, navShadow } from "../styles/shadows";
import Feather from "@expo/vector-icons/Feather";
import { getUserProfile } from "../utils/getUserProfile";
import { buildPrompt } from "../utils/buildPrompt";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const { mode } = useLocalSearchParams();

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, "users", user.uid, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (mode === "new") {
        if (!sessionId) {
          const newId = `${Date.now()}`;
          setSessionId(newId);
          setMessages([]);
          return;
        }
        const sessionMessages = allMessages.filter(
          (msg) => msg.sessionId === sessionId
        );
        setMessages(sessionMessages);
      } else {
        if (allMessages.length > 0) {
          const latestSession = allMessages[0].sessionId;
          const sessionMessages = allMessages.filter(
            (msg) => msg.sessionId === latestSession
          );
          setSessionId(latestSession);
          setMessages(sessionMessages);
        }
      }
    });

    return () => unsubscribe();
  }, [user, mode, sessionId]);

  useEffect(() => {
    if (!user) return;
    console.log("Inloggad som:", user.email);

    const messagesRef = collection(db, "users", user.uid, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionMap = {};
      snapshot.docs.forEach((doc) => {
        const msg = doc.data();
        if (!sessionMap[msg.sessionId]) {
          sessionMap[msg.sessionId] = { ...msg };
        }
      });
      setSessions(Object.values(sessionMap));
    });

    return () => unsubscribe();
  }, [user]);

  const uniqueId = () =>
    `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const sendMessage = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    const userMessage = {
      id: `user_${uniqueId()}`,
      text,
      sender: "user",
      sessionId,
    };
    setMessages((prev) => [userMessage, ...prev]);
    setInput("");

    await saveMessage(user.uid, text, "user", sessionId);

    try {
      const profile = await getUserProfile(user.uid);

      const promptMessages = buildPrompt(profile || {}, text);
      console.log("Prompt sent to OpenAI:", promptMessages);

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            // model: "gpt-4o",
            messages: promptMessages,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      const botText =
        data.choices?.[0]?.message?.content || "No response from NEU.";
      const botMessage = {
        id: `bot_${uniqueId()}`,
        text: botText,
        sender: "bot",
        sessionId,
      };

      setMessages((prev) => [botMessage, ...prev]);
      await saveMessage(user.uid, botText, "bot", sessionId);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <SafeAreaView style={styles.container}>
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
                ListFooterComponent={
                  <View style={styles.header}>
                    <View style={styles.centered}>
                      <Image
                        source={require("../assets/images/purple-ellipse.png")}
                        style={styles.avatar}
                      />
                      <Text style={styles.name}>
                        {
                          "Hello I'm NEU, your personal AI,\nwhat can I do for you today?"
                        }
                      </Text>
                    </View>
                    <View style={styles.hr} />
                  </View>
                }
                contentContainerStyle={styles.contentContainer}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Write a message"
                multiline
              />
              <Pressable onPress={sendMessage}>
                <Feather name="arrow-up-circle" size={24} color="black" />
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>

      {showHistory && (
        <View style={styles.historyOverlay}>
          <View style={styles.historyPanel}>
            <View style={styles.header}>
              <Text style={styles.historyHeading}>Chat history</Text>
            </View>
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.sessionId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSessionId(item.sessionId);
                    setShowHistory(false);
                  }}
                  style={styles.sessionItem}
                >
                  <Text style={styles.sessionText} numberOfLines={1}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => setShowHistory((prev) => !prev)}
      >
        <Feather name="menu" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.xIcon}>
        <Pressable onPress={() => router.push("/profile")}>
          <Feather name="x" size={24} color="black" />
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  header: {
    paddingTop: 10,
    zIndex: 1,
    width: "100%",
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
    height: 1,
    backgroundColor: "#ccc",
    marginTop: 20,
    alignSelf: "stretch",
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    ...navShadow,
    backgroundColor: "#FAFAFA",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 6,
    textAlignVertical: "top",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#ECE9FB",
    ...defaultShadow,
    padding: 10,
    marginVertical: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FAFAFA",
    ...defaultShadow,
    padding: 10,
    marginVertical: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  loginText: {
    marginTop: 40,
    fontSize: 18,
    textAlign: "center",
  },
  flatListContent: {
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  xIcon: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 20,
  },
  menuIcon: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 20,
  },
  historyOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#00000033",
    flexDirection: "row",
    zIndex: 10,
  },
  historyPanel: {
    width: "66%",
    height: "100%",
    backgroundColor: "#FAFAFA",
    padding: 10,
  },
  historyHeading: {
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30,
  },
  sessionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  sessionText: {
    fontWeight: 500,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
});
