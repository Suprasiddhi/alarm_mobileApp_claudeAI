import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";

export default function SettingsScreen() {
  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🔔",
        body: "This is how your alarm will look!",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
        repeats: false,
      },
    });
    Alert.alert("Test Scheduled", "Notification will appear in 2 seconds");
  };

  const cancelAllAlarms = async () => {
    Alert.alert(
      "Cancel All Alarms",
      "Are you sure you want to cancel all alarms?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
            Alert.alert("Success", "All alarms cancelled");
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testing</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={testNotification}
          >
            <Text style={styles.settingText}>Test Notification</Text>
            <Text style={styles.settingDescription}>
              Send a test alarm to see how it looks
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={cancelAllAlarms}
          >
            <Text style={[styles.settingText, styles.dangerText]}>
              Cancel All Alarms
            </Text>
            <Text style={styles.settingDescription}>
              This will remove all scheduled alarms
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>
            Simple Alarm App v1.0{"\n"}
            Built with React Native & Expo
          </Text>
        </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#333",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: "#999",
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: "#ffebee",
  },
  dangerText: {
    color: "#f44336",
  },
  infoSection: {
    marginTop: 40,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#999",
    lineHeight: 22,
  },
});
