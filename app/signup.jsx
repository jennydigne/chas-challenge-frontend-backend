import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Pressable, ImageBackground } from "react-native";
import backgroundImage from '../assets/images/Violet_2.png';
import MyButton from "./components/Button"
import { useRouter } from "expo-router";
import Divider from "./components/Divider";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Feather from '@expo/vector-icons/Feather';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters and include a number, an uppercase letter, and a special character.");
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created!");
            console.log(userCredential.user);
            router.push("/verify");
        } catch (error) {
            console.error('Error signing up: ', error.message);
            alert(error.message);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === "ios" ? "padding" : "height"} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView>
                        <View style={styles.top}>
                            <Pressable onPress={() => router.push("/")}>
                                <Feather name="chevron-left" size={30} color="black" />
                            </Pressable>
                            <Image source={require("../assets/images/Progressbar.png")} />
                        </View>
                        <Text style={styles.title}>Sign up</Text>
                        <View style={styles.form}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter e-mail address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none" />
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry />
                            <Text style={styles.label}>Confirm password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry />
                            <MyButton title="Create account" onPress={handleSignUp} />
                        </View>
                        <Divider text="or sign up with" lineColor="#939393" paddingHorizontal={30} marginTop={20} />
                        <View style={styles.iconRow}>
                            <Image source={require("../assets/images/google-icon.png")} style={styles.socialIcon} />
                            <Image source={require("../assets/images/facebook-icon.png")} style={styles.socialIcon} />
                            <Image source={require("../assets/images/apple-icon.png")} style={styles.socialIcon} />
                        </View>
                        <View style={styles.bottomTextRow}>
                            <Text>Already have an account? </Text>
                            <Pressable onPress={() => router.push("/login")}>
                                <Text style={styles.linkText}>sign in</Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 40,
        paddingVertical: 38,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "400",
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: "#787878",
        borderRadius: 8,
        padding: 12,
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#333",
    },
    form: {
        width: '100%',
        maxWidth: 360,
        alignSelf: 'center',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginVertical: 25,
    },
    socialIcon: {
        width: 46,
        height: 46,
        marginHorizontal: 5,
    },
    top: {
        marginBottom: 40,
        flexDirection: "row",
        gap: 20,
        alignItems: "center"
    },
    keyboardAvoiding: {
        flex: 1,
    },
    bottomTextRow: {
        flexDirection: "row",
        justifyContent: "center",
    },
    linkText: {
        fontWeight: 'bold',
    },
});


