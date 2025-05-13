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
  ImageBackground,
} from "react-native";
import { getAuth } from "firebase/auth";
import { saveMessage } from "../saveMessage";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import LogoutButton from "./components/LogoutButton";
import { useRouter } from "expo-router";
import backgroundImage from "../assets/images/Violet.png";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(`${Date.now()}`);
  const router = useRouter();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, "users", user.uid, "messages");
    const q = query(messagesRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((msg) => msg.sessionId === sessionId);

      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [user, sessionId]);

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
      sessionId,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");

    await saveMessage(user.uid, text, "user", sessionId);

    try {
      const response = await fetch("http://192.168.0.19:11434/api/generate", {
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
        sessionId,
      };

      setMessages((prev) => [botMessage, ...prev]);
      await saveMessage(user.uid, data.response, "bot", sessionId);
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setSessionId(`${Date.now()}`);
  };

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.buttonContainer}>
            <Button title="Start new chat" onPress={startNewChat} />
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
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Write a message"
              />
              <Button title="Send" onPress={sendMessage}/>
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
  buttonContainer: {
    marginBottom: 10,
    justifyContent: "space-between",
    flexDirection: "row"
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
    paddingHorizontal: 20,
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
    boxShadow:
      "0px -2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FAFAFA",
    boxShadow:
      "0px -2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  send: {
    backgroundColor: "#AFA1EE",
    padding: 8,
    borderRadius: 50,
    boxShadow: "0px -2px 4px 0px rgba(0, 0, 0, 0.10)"
  }
});
