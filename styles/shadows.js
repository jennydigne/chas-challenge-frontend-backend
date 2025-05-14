import { Platform } from "react-native";

export const defaultShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    android: {
        elevation: 3,
    },
});
