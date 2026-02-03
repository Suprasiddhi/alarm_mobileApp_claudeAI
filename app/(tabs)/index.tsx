import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

interface Alarm {
  id: string;
  time: string;
  active: boolean;
  date: Date;
}

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // When user picks a time
  const onTimeChange = (event: any, selected?: Date) => {
    setShowPicker(Platform.OS === "ios"); // Keep picker open on iOS
    if (selected) {
      setSelectedTime(selected);
    }
  };

  // Schedule the alarm
  const scheduleAlarm = async () => {
    const now = new Date();
    let alarmTime = new Date(selectedTime);

    // Set alarm for today
    alarmTime.setFullYear(now.getFullYear());
    alarmTime.setMonth(now.getMonth());
    alarmTime.setDate(now.getDate());

    // If time has passed today, set for tomorrow
    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    // Calculate seconds until alarm
    const secondsUntilAlarm = Math.floor(
      (alarmTime.getTime() - now.getTime()) / 1000,
    );

    if (secondsUntilAlarm < 0) {
      Alert.alert("Error", "Please select a future time");
      return;
    }

    try {
      // Schedule notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "⏰ Alarm!",
          body: "Time to wake up!",
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilAlarm,
          repeats: false,
        },
      });

      // Add to alarm list
      const newAlarm: Alarm = {
        id: notificationId,
        time: alarmTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        active: true,
        date: alarmTime,
      };

      setAlarms([...alarms, newAlarm]);
      Alert.alert("Alarm Set!", `Alarm will ring at ${newAlarm.time}`);
      setShowPicker(false);
    } catch (error) {
      Alert.alert("Error", "Failed to set alarm");
      console.error(error);
    }
  };

  // Delete an alarm
  const deleteAlarm = async (id: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      setAlarms(alarms.filter((alarm) => alarm.id !== id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete alarm");
    }
  };

  // Render each alarm in the list
  const renderAlarm = ({ item }: { item: Alarm }) => (
    <View style={styles.alarmItem}>
      <View style={styles.alarmInfo}>
        <Text style={styles.alarmTime}>{item.time}</Text>
        <Text style={styles.alarmStatus}>
          {item.active ? "✓ Active" : "✗ Inactive"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteAlarm(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⏰ Set Your Alarm</Text>

        {/* Current selected time */}
        <View style={styles.timeDisplay}>
          <Text style={styles.timeText}>
            Selected Time:{" "}
            {selectedTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Button to show time picker */}
        <View style={styles.buttonSpacing}>
          <Button
            title="Pick Time"
            onPress={() => setShowPicker(true)}
            color="#2196F3"
          />
        </View>

        {/* Time Picker */}
        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onTimeChange}
            />
            {Platform.OS === "ios" && (
              <View style={styles.buttonSpacing}>
                <Button title="Done" onPress={() => setShowPicker(false)} />
              </View>
            )}
          </View>
        )}

        {/* Set Alarm Button */}
        <View style={styles.buttonSpacing}>
          <Button title="Set Alarm" onPress={scheduleAlarm} color="#4CAF50" />
        </View>

        {/* List of Alarms */}
        <Text style={styles.subtitle}>Your Alarms:</Text>
        {alarms.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.noAlarms}>No alarms set yet</Text>
            <Text style={styles.noAlarmsSubtext}>
              Tap "Pick Time" to create your first alarm
            </Text>
          </View>
        ) : (
          <FlatList
            data={alarms}
            renderItem={renderAlarm}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.alarmList}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  timeDisplay: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeText: {
    fontSize: 22,
    textAlign: "center",
    color: "#2196F3",
    fontWeight: "600",
  },
  buttonSpacing: {
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noAlarms: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  noAlarmsSubtext: {
    textAlign: "center",
    color: "#bbb",
    fontSize: 14,
    marginTop: 8,
  },
  alarmList: {
    marginBottom: 20,
  },
  alarmItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  alarmStatus: {
    fontSize: 14,
    color: "#4CAF50",
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
