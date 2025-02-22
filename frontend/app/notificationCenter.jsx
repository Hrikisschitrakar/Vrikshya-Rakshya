import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
const MarketplaceScreen = () => <Text style={styles.screenText}>Marketplace</Text>;
const HomeScreen = () => <Text style = {styles.screenText}>Home</Text>;
const ProfileScreen = () => <Text style={styles.screenText}>Profile</Text>;
const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState("notifications");

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
        ) : (
          <>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <View style={styles.notification}>
              <Text style={styles.notificationText}>🎉 New Vendor in Town!</Text>
              <Text style={styles.timestamp}>5 minutes ago</Text>
            </View>
            <View style={styles.notification}>
              <Text style={styles.notificationText}>⭐ Give a rating to "Green Pesticides"</Text>
              <Text style={styles.timestamp}>30 minutes ago</Text>
            </View>
            <View style={styles.notification}>
              <Text style={styles.notificationText}>✅ Payment was successful!</Text>
              <Text style={styles.timestamp}>1 hour ago</Text>
            </View>
            <View style={styles.notification}>
              <Text style={styles.notificationText}>📦 Your parcel is on the way</Text>
              <Text style={styles.timestamp}>2 hours ago</Text>
            </View>
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
