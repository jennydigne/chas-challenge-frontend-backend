import { Alert, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function LogoutButton() {
    const auth = getAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login")
        } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Logout failed", error.message);
        }
    };

    return <Button title="Log out" onPress={handleLogout} />;
}