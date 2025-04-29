import { useState } from "react";
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
} from "react-native";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const uniqueId = () =>
    `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `user_${uniqueId()}`,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    
    //obs ändra till rätt ip-adress nedan, ipconfig, Wireless LAN adapter Wi-Fi:
    //IPv4 Address, sen skanna qr-kod igen
    try {
      const response = await fetch("http://192.168.0.19:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "tinyllama:chat",
          prompt: `${input}`,
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
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={
                item.sender === "user" ? styles.userBubble : styles.botBubble
              }
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          inverted
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Write a message"
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
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
    backgroundColor: "#DCF8C6",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F0F0",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
});
