import { useState, useEffect } from "react";
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
import {
    collection,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import LogoutButton from "./components/LogoutButton";
import { useRouter } from "expo-router";
import backgroundImage from "../assets/images/Violet.png";
import MyButton from "./components/Button";
import { Send } from "lucide-react-native";

export default function OnboardingChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [showProfileButton, setShowProfileButton] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const auth = getAuth();
    const user = auth.currentUser;
    const router = useRouter();

    const onboardingQuestions = [
        {
            question: "Question 1: What do you feel are your main challenges? \nYou can also add your own response or provide more details if you'd like!👐",
            options: ["Anxiety", "Stress", "Structure", "Depression", "Panic attacks"],
        },
        {
            question: "Question 2: What do you feel helps you the most?",
            options: ["Help with planning", "Exercises", "Calming words", "Motivational words", "Help calming down"],
        },
        {
            question: "Question 3: When would you like to receive reminder notifications? Please choose your preferred times",
            options: ["8am-10am", "10am-12pm", "12pm-2pm", "2pm-4pm", "4pm-6pm", "6pm-8pm", "8pm-10pm"],
        },
        {
            question: "Additionally, would you like to sync with your calendar?🗓️",
            options: ["Sync", "No thanks"],
        },
    ];

    const uniqueId = () =>
        `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    useEffect(() => {
        if (user) {
            const intro = {
                id: `bot_intro`,
                text:
                    "Hi! Glad you found your way here! 😊 I'd like to understand a bit more about you, please answer the following questions!",
                sender: "bot",
            };

            setMessages((prev) => [intro, ...prev]);

            const firstQuestion = {
                id: `bot_q1`,
                text: onboardingQuestions[0].question,
                sender: "bot",
            };
            setMessages((prev) => [firstQuestion, ...prev]);
        }
    }, []);

    const toggleOption = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((o) => o !== option)
                : [...prev, option]
        );
    };

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed && selectedOptions.length === 0) return;

        const combinedAnswers = [...selectedOptions, trimmed].filter(Boolean);

        const userMessage = {
            id: `user_${uniqueId()}`,
            text: combinedAnswers.join(", "),
            sender: "user",
        };

        setMessages((prev) => [userMessage, ...prev]);
        setInput("");
        setSelectedOptions([]);

        const onboardingRef = collection(db, "users", user.uid, "onboardingAnswers");
        await addDoc(onboardingRef, {
            question: onboardingQuestions[onboardingStep].question,
            answer: combinedAnswers,
            timestamp: serverTimestamp(),
        });


        if (onboardingStep < onboardingQuestions.length - 1) {
            const nextStep = onboardingStep + 1;
            const nextQuestion = {
                id: `bot_${uniqueId()}`,
                text: onboardingQuestions[nextStep].question,
                sender: "bot",
            };
            setTimeout(() => {
                setMessages((prev) => [nextQuestion, ...prev]);
                setOnboardingStep(nextStep);
            }, 500);
        } else {
            const completeMessage = {
                id: `bot_complete`,
                text: "That's all questions! Thank you for taking the time! 😌",
                sender: "bot",
            };
            setTimeout(() => {
                setMessages((prev) => [completeMessage, ...prev]);
                setShowProfileButton(true);
            }, 500);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={{ marginTop: 40, fontSize: 18, textAlign: "center" }}>
                    You need to be signed in to use the onboarding.
                </Text>
                <MyButton title="Sign in" onPress={() => router.push("/login")} />
            </View>
        );
    }

    const currentOptions = onboardingQuestions[onboardingStep]?.options || [];

    return (
        <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.logoutContainer}>
                        <LogoutButton />
                    </View>
                    <View style={styles.centered}>
                        <Image
                            source={require("../assets/images/purple-ellipse.png")}
                            style={styles.avatar}
                        />
                        <Text style={styles.name}>{"Hello I'm NEU, your personal AI,\nwhat can I do for you today?"}</Text>
                    </View>
                    <View style={styles.hr} />
                </View>

                <KeyboardAvoidingView
                    style={styles.chatWrapper}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
                >
                    <SafeAreaView style={{ flex: 1 }}>
                        <FlatList
                            data={messages}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View
                                    style={item.sender === "user" ? styles.userBubble : styles.botBubble}
                                >
                                    <Text style={styles.messageText}>{item.text}</Text>
                                </View>
                            )}
                            inverted
                            contentContainerStyle={{ paddingBottom: 10 }}
                        />

                        {!showProfileButton && (
                            <>
                                <View style={styles.optionContainer}>
                                    {currentOptions.map((option) => {
                                        const selected = selectedOptions.includes(option);
                                        return (
                                            <TouchableOpacity
                                                key={option}
                                                style={[
                                                    styles.optionButton,
                                                    selected && styles.optionButtonSelected,
                                                ]}
                                                onPress={() => toggleOption(option)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.optionText,
                                                        selected && styles.optionTextSelected,
                                                    ]}
                                                >
                                                    {option}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        value={input}
                                        onChangeText={setInput}
                                        placeholder="Write your answer"
                                    />
                                    <Pressable style={styles.send} onPress={sendMessage}>
                                        <Send size={14} color="white" />
                                    </Pressable>
                                </View>
                            </>
                        )}

                        {showProfileButton && (
                            <View style={{ marginVertical: 20, marginHorizontal: 80 }}>
                                <MyButton title="Go to profile" onPress={() => router.push("/profile")} />
                            </View>
                        )}
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
        paddingHorizontal: 20,
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
        marginVertical: 10,
        borderRadius: 8,
        maxWidth: "80%",
    },
    botBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#FAFAFA",
        boxShadow: "0px -2px 4px 0px rgba(0, 0, 0, 0.10) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.10)",
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
    },
    optionContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
        gap: 6,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: "#693ED6",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 6,
    },
    optionButtonSelected: {
        backgroundColor: "#693ED6",
    },
    optionText: {
        color: "#333",
    },
    optionTextSelected: {
        color: "#fff",
    },
});

