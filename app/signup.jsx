import { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Pressable, Alert, ImageBackground } from "react-native";
import backgroundImage from '../assets/images/Violet.png';
import MyButton from "./components/Button"
import { useRouter } from "expo-router";
import Divider from "./components/Divider";
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '877049946369-fbljhrce4c2e48hg632tboi1mgrani2i.apps.googleusercontent.com',
        redirectUri: makeRedirectUri({ useProxy: true })
    });

    useEffect(() => {
        const signInWithGoogle = async () => {
            if (response?.type === 'success') {
                const { id_token } = response.params;
                const credential = GoogleAuthProvider.credential(id_token);
                try {
                    const userCredential = await signInWithCredential(auth, credential);
                    Alert.alert("Google account created!");
                    router.push('/');
                } catch (error) {
                    console.error("Google Sign-In error: ", error);
                    Alert.alert("Google Sign-In failed");
                }
            }
        };
        signInWithGoogle();
    }, [response]);

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
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView>
                        <Pressable onPress={() => router.push("/")}>
                            <Image source={require("../assets/images/chevron-left.png")}
                                style={{
                                    marginBottom: 40,
                                    width: 24,
                                    height: 24,
                                }} />
                        </Pressable>
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
                            <Pressable onPress={() => promptAsync()}>
                                <Image source={require("../assets/images/google-icon.png")} style={styles.socialIcon} />
                            </Pressable>
                            <Image source={require("../assets/images/facebook-icon.png")} style={styles.socialIcon} />
                            <Image source={require("../assets/images/apple-icon.png")} style={styles.socialIcon} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text>Already have an account? </Text>
                            <Pressable onPress={() => router.push("/login")}>
                                <Text style={{ fontWeight: 'bold' }}>sign in</Text>
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
});


