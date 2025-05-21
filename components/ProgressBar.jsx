import { View, Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";

export default function ProgressBar({ progress }) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width: widthInterpolated }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E4DFF9",
    overflow: "hidden",
    width: "100%", 
    alignSelf: "center",
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#693ED6", 
  },
});
