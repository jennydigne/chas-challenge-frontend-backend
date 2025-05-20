import { useState, useEffect, useRef } from "react";
import { View, TextInput, Text, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, Image, ImageBackground, TouchableOpacity, ScrollView, Button, Pressable } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useRouter } from "expo-router";
import backgroundImage from "../assets/images/Violet.png";
import MyButton from "./components/Button";
import { generateProfileFromAnswers } from "../generateUserProfile";
import { defaultShadow } from "../styles/shadows";
import Feather from "@expo/vector-icons/Feather";

export default function OnboardingChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [showProfileButton, setShowProfileButton] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const scrollViewRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

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

    useEffect(() => {
        if (isAtBottom) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages]);

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

        const onboardingRef = collection(db, "profiles", user.uid, "onboardingAnswers");
        await addDoc(onboardingRef, {
            question: onboardingQuestions[onboardingStep].question,
            answer: combinedAnswers,
            timestamp: serverTimestamp(),
        });

        if (onboardingStep === onboardingQuestions.length - 1) {
            await generateProfileFromAnswers(user.uid);

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
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.loginText}>
                    Please sign in to your account!
                </Text>
                <MyButton title="Sign in" onPress={() => router.push("/login")} />
            </View>
        );
    }

    const currentOptions = onboardingQuestions[onboardingStep]?.options || [];

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.contentContainer}
                        keyboardShouldPersistTaps="handled"
                        onScroll={(e) => {
                            const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
                            const paddingToBottom = 20;
                            const atBottom =
                                contentOffset.y + layoutMeasurement.height >= contentSize.height - paddingToBottom;
                            setIsAtBottom(atBottom);
                        }}
                        scrollEventThrottle={100}
                    >
                        <View style={styles.header}>
                                <Pressable onPress={() => router.push("/getstarted")}>
                                    <Feather name="chevron-left" size={30} color="black" />
                                </Pressable>
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
                        <View style={styles.chatWrapper}>
                            {[...messages].reverse().map((item) => (
                                <View
                                    key={item.id}
                                    style={item.sender === "user" ? styles.userBubble : styles.botBubble}
                                >
                                    <Text style={styles.messageText}>{item.text}</Text>
                                </View>
                            ))}

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
                                            multiline
                                        />
                                        <Button title="Send" onPress={sendMessage} />
                                    </View>
                                </>
                            )}
                            {showProfileButton && (
                                <View style={styles.buttonContainer}>
                                    <MyButton title="Go to profile" onPress={() => router.push("/profile")} />
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        resizeMode: "cover",
        flex: 1
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 10,
        zIndex: 1,
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
        marginTop: 30,
    },
    chatWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginRight: 6
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#ECE9FB",
        ...defaultShadow,
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        maxWidth: "80%",
    },
    botBubble: {
        alignSelf: "flex-start",
        backgroundColor: "#FAFAFA",
        ...defaultShadow,
        padding: 10,
        marginVertical: 20,
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
    },
    optionButton: {
        borderWidth: 1,
        borderColor: "#693ED6",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 6,
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
    loginText: {
        marginTop: 40,
        fontSize: 18,
        textAlign: "center"
    },
    buttonContainer: {
        marginVertical: 20,
        marginHorizontal: 80
    },
    contentContainer: {
        flexGrow: 1
    }
});

