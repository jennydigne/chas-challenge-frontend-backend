import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
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
                        <MyButton title="Create account" />
                    </View>
                    <Divider text="or sign up with" lineColor="#939393"/>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
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
});
