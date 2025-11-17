import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// Optional: customize locale (month/day names)
LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
LocaleConfig.defaultLocale = "en";

export default function FullCalendarScreen(data: any) {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selected, setSelected] = useState("");

  const severityRate: Record<string, number> = {
    "Worst Possible Pain": 5,
    "Very Severe Pain": 4,
    "Severe Pain": 3,
    "Moderate Pain": 2,
    "Mild Pain": 1,
  };

  const severity: Record<string, string> = {
    "Worst Possible Pain": "#A91919",
    "Very Severe Pain": "#EB3A2A",
    "Severe Pain": "#FF9700",
    "Moderate Pain": "#FDD154",
    "Mild Pain": "#4FC854",
  };

  useEffect(() => {
    if (data?.data?.data?.length) {
      const newMarked: { [key: string]: any } = {};
      data.data.data.forEach((entry: any) => {
        const dateString = new Date(entry.timestamp)
          .toISOString()
          .split("T")[0];

        Object.keys(newMarked).length > 0
          ? Object.keys(newMarked).map((data) => {
              data === dateString
                ? newMarked[data].severity < entry.severity &&
                  (newMarked[dateString] = {
                    selected: true,
                    severity: severityRate[entry.severity],
                    selectedColor: severity[entry.severity],
                    selectedTextColor: "#fff",
                  })
                : (newMarked[dateString] = {
                    selected: true,
                    severity: severityRate[entry.severity],
                    selectedColor: severity[entry.severity],
                    selectedTextColor: "#fff",
                  });
            })
          : (newMarked[dateString] = {
              selected: true,
              severity: severityRate[entry.severity],
              selectedColor: severity[entry.severity],
              selectedTextColor: "#fff",
            });
      });

      setMarkedDates(newMarked);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Calendar
        // onDayPress={(day) => setSelected(day.dateString)}
        markedDates={{
          ...markedDates,
          ...(selected
            ? {
                [selected]: {
                  selected: true,
                  selectedColor: "orange", // highlight selected date differently
                },
              }
            : {}),
        }}
        theme={{
          backgroundColor: "#f9f9f9",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#00748D",
          selectedDayBackgroundColor: "#00748D",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#00adf5",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          arrowColor: "#00748D",
          monthTextColor: "#00748D",
          indicatorColor: "#00748D",
          textDayFontWeight: "500",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        hideExtraDays={false}
        enableSwipeMonths={true}
      />

      {selected && (
        <Text style={styles.infoText}>Selected date: {selected}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 50,
  },
  infoText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#00748D",
    fontWeight: "600",
  },
});
