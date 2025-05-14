import backgroundImage from '../assets/images/Violet.png';
import { useRouter } from "expo-router";
import MyButton from "./components/Button";
import { StyleSheet, Image, ImageBackground, View } from 'react-native';

export default function ChatOptions() {
    const router = useRouter();
    return (
        <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
            <View style={styles.header}>
                <Image
                    source={require("../assets/images/purple-ellipse.png")}
                    style={styles.avatar}
                />
            </View>
            <View style={styles.buttons}>
                <MyButton title="Continue last chat" onPress={() => router.push("/chat-options")} />
                <MyButton title="Start new chat" onPress={() => router.push("/chat-options")} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingBottom: 10,
        paddingTop: 40,
        paddingHorizontal: 10,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 60,
        marginBottom: 50,
        alignSelf: "center"
    },
    container: {
        padding: 40,
        flex: 1
    },
    buttons: {
        gap: 30
    }
})