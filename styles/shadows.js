import { Platform } from "react-native";

export const defaultShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    android: {
        elevation: 3,
    },
});

export const navShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    android: {
        elevation: 10,
    },
});
