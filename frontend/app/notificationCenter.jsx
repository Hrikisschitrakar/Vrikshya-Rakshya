import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const NotificationCenter = () => {
  const route = useRoute(); // Access route params
  const { username } = route.params; // Get username from params
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/notifications/${username}`);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [username]);

  return (
    <View style={styles.container}>
      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "messages" && styles.activeTab]}
          onPress={() => setActiveTab("messages")}
        >
          <Text style={[styles.tabText, activeTab === "messages" && styles.activeTabText]}>
            Messages
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "notifications" && styles.activeTab]}
          onPress={() => setActiveTab("notifications")}
        >
          <Text style={[styles.tabText, activeTab === "notifications" && styles.activeTabText]}>
            Notifications
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {activeTab === "messages" ? (
          <>
            <Text style={styles.sectionTitle}>Past Conversations</Text>
            <View style={styles.message}>
              <Text style={styles.messageText}>John Doe: "Hey! Is the pesticide available?"</Text>
              <Text style={styles.timestamp}>2 hours ago</Text>
            </View>
            <View style={styles.message}>
              <Text style={styles.messageText}>Vendor Support: "Your order is confirmed!"</Text>
              <Text style={styles.timestamp}>Yesterday</Text>
            </View>
          </>
        ) : loading ? (
          <ActivityIndicator size="large" color="#397454" />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Recent Notifications {username}</Text>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notification}>
                <Text style={styles.notificationText}>{notification.content}</Text>
                <Text style={styles.timestamp}>
                  {new Date(notification.created_at).toLocaleString()}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationCenter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    paddingVertical: 10,
    width: "50%",
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#397454",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    color: "#397454",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 14,
  },
  notification: {
    backgroundColor: "#e6f5ea",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
  },
});
