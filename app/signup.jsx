import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Pressable } from "react-native";
import MyButton from "../.expo/components/Button";
import { useRouter } from "expo-router";
import Divider from "../.expo/components/Divider";

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Sign up</Text>
                    <View style={styles.form}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none" />
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
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
                        <MyButton title="Create account" onPress={() => router.push("/")} />
                    </View>
                    <Divider text="or sign up with" lineColor="#939393" paddingHorizontal={30} />
                    <View style={styles.iconRow}>
                        <Image source={require("../assets/images/google-icon.png")} style={styles.socialIcon} />
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
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 40,
        paddingVertical: 38,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: 400,
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
        fontSize: 16,
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
