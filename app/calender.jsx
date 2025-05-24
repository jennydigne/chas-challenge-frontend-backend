import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import backgroundImage from "../assets/images/Violet.png";
import sadImage from "../assets/images/sad.png";
import bitSadImage from "../assets/images/bitsad.png";
import neutralImage from "../assets/images/neutral.png";
import smileImage from "../assets/images/smile.png";
import happyImage from "../assets/images/happy.png";

export default function MoodCalendar() {
  // Store moods per date: { '2025-05-20': 'happy', ... }
  const [moods, setMoods] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // Color for each mood
  const moodColors = {
    happy: "#a1e887",
    slightlyHappy: "#c4e1a9",
    neutral: "#cccccc",
    slightlySad: "#f3c6b8",
    sad: "#f28b82",
  };

  // Mark dates with color based on moods
  const markedDates = {};
  Object.entries(moods).forEach(([date, mood]) => {
    markedDates[date] = {
      selected: true,
      selectedColor: moodColors[mood],
    };
  });

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={styles.header}>Mood Tracker</Text>
        <View style={styles.moodImagesContainer}>
          <Image source={sadImage} style={styles.moodImage} />
          <Image source={bitSadImage} style={styles.moodImage} />
          <Image source={neutralImage} style={styles.moodImage} />
          <Image source={smileImage} style={styles.moodImage} />
          <Image source={happyImage} style={styles.moodImage} />
        </View>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...markedDates,
            ...(selectedDate && !markedDates[selectedDate]
              ? { [selectedDate]: { selected: true, selectedColor: "#87ceeb" } }
              : {}),
          }}
        />

        {selectedDate && (
          <View style={styles.moodSelector}>
            <Text style={styles.title}>
              Select your mood for {selectedDate}
            </Text>
            <View style={styles.buttonsContainer}>
              {Object.entries(moodColors).map(([mood, color]) => (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodButton, { backgroundColor: color }]}
                  onPress={() =>
                    setMoods((prev) => ({ ...prev, [selectedDate]: mood }))
                  }
                >
                  <Text style={styles.moodText}>{mood}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.moodButton,
                  { backgroundColor: "#fff", borderWidth: 1 },
                ]}
                onPress={() =>
                  setMoods((prev) => {
                    const copy = { ...prev };
                    delete copy[selectedDate];
                    return copy;
                  })
                }
              >
                <Text style={[styles.moodText, { color: "black" }]}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  moodSelector: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 14,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moodButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  moodText: {
    color: "white",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 20,
  },
  moodImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },

  moodImage: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
});
