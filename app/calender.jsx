import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import backgroundImage from "../assets/images/Violet.png";
import sadImage from "../assets/images/sad.png";
import bitSadImage from "../assets/images/bitsad.png";
import neutralImage from "../assets/images/neutral.png";
import smileImage from "../assets/images/smile.png";
import happyImage from "../assets/images/happy.png";

export default function MoodCalendar() {
  const [moods, setMoods] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // NEW: Track which timeframe button is selected
  const [selectedTimeframe, setSelectedTimeframe] = useState("Week");

  const moodColors = {
    sad: "#F9C6C9",
    slightlySad: "#FDF3A0",
    neutral: "#D9D6F3",
    slightlyHappy: "#C9E6F5",
    happy: "#B8F2C9",
  };

  const markedDates = {};
  Object.entries(moods).forEach(([date, mood]) => {
    markedDates[date] = {
      selected: true,
      selectedColor: moodColors[mood],
      selectedTextColor: "#000",
    };
  });

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={styles.header}>Mood Track</Text>

        <View style={styles.timeframeButtonsContainer}>
          {["Today", "Week", "Month", "Yearly"].map((label) => {
            const isSelected = selectedTimeframe === label;
            return (
              <TouchableOpacity
                key={label}
                style={[
                  styles.timeframeButton,
                  isSelected && styles.timeframeButtonSelected,
                ]}
                onPress={() => setSelectedTimeframe(label)}
              >
                <Text
                  style={[
                    styles.timeframeText,
                    isSelected && styles.timeframeTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        <View style={styles.moodImagesContainer}>
          <Image source={sadImage} style={styles.moodImage} />
          <Image source={bitSadImage} style={styles.moodImage} />
          <Image source={neutralImage} style={styles.moodImage} />
          <Image source={smileImage} style={styles.moodImage} />
          <Image source={happyImage} style={styles.moodImage} />
        </View>

        <Calendar
          current={currentMonth.toISOString().split("T")[0]}
          onMonthChange={(month) => {
            setCurrentMonth(new Date(month.year, month.month - 1));
          }}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...markedDates,
            ...(selectedDate && !markedDates[selectedDate]
              ? { [selectedDate]: { selected: true, selectedColor: "#87ceeb" } }
              : {}),
          }}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#999",
            todayTextColor: "#6C63FF",
            dayTextColor: "#333",
            textDisabledColor: "#d9e1e8",
            monthTextColor: "#2D2D2D",
            arrowColor: "#6C63FF",
            textDayFontWeight: "500",
            textMonthFontWeight: "bold",
            textDayFontSize: 16,
            textMonthFontSize: 20,
          }}
          style={styles.calendar}
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
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 10,
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textTransform: "capitalize",
  },
  arrow: {
    fontSize: 22,
    paddingHorizontal: 10,
  },
  moodImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 40,
  },
  moodImage: {
    width: 50,
    height: 50,
  },
  calendar: {
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowColor: "#B9A7FF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  moodSelector: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 14,
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moodButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  moodText: {
    color: "black",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  timeframeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    gap: 4,
  },
  timeframeButton: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: "#B9A7FF",
    borderWidth: 1,
  },
  timeframeButtonSelected: {
    backgroundColor: "#584DD9",
    borderColor: "#6C63FF",
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  timeframeTextSelected: {
    color: "white",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 16,
    width: "100%",
  },
});
