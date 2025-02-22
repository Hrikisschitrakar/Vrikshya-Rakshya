import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "../components/Button";
import logo from "../assets/images/logo.png";
import pesticides from "../assets/images/pesticides.png";

const MarketplaceScreen = () => <Text style={styles.screenText}>Marketplace</Text>;
const NotificationScreen = () => <Text style={styles.screenText}>Notifications</Text>;
const ProfileScreen = () => <Text style={styles.screenText}>Profile</Text>;

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View>
          <Text style={styles.headerTitle}>Nurturing Healthy Plants, One Leaf at a Time</Text>
          <Text style={styles.subText}>Explore the beauty of greenery with Vrikshya Rakshya</Text>
        </View>
      </View>
      <Button title="Get Started" style={styles.getStartedButton} onPress={() => alert("Get Started")} />
      <View style={styles.diagnoseContainer}>
        <Image source={logo} style={styles.sectionImage} resizeMode="contain" />
        <Text style={styles.sectionTitle}>Diagnose Plant Disease</Text>
        <Text style={styles.sectionSubText}>With a camera icon</Text>
        <Text style={styles.uploadText}>Upload a Leaf Image</Text>
        <Button title="Upload Image" style={styles.uploadButton} onPress={() => alert("Upload Image")} />
      </View>
      <View style={styles.marketplaceContainer}>
        <Image source={pesticides} style={styles.sectionImage} resizeMode="contain" />
        <Text style={styles.sectionTitle}>Vendor Marketplace</Text>
        <Text style={styles.sectionSubText}>Find pesticides and plant essentials</Text>
        <Button title="Shop Now" style={styles.shopButton} onPress={() => alert("Go to Marketplace")} />
      </View>
    </View>
  );
};

const CustomerLandingPage = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Marketplace") iconName = "cart";
          else if (route.name === "Notifications") iconName = "notifications";
          else if (route.name === "Profile") iconName = "person";

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#397454",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default CustomerLandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  subText: {
    fontSize: 14,
    color: "gray",
  },
  getStartedButton: {
    backgroundColor: "#397454",
    marginTop: 10,
  },
  diagnoseContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    alignItems: "center",
  },
  marketplaceContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionSubText: {
    fontSize: 14,
    color: "gray",
  },
  uploadText: {
    fontSize: 14,
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: "#397454",
    marginTop: 10,
  },
  shopButton: {
    backgroundColor: "#397454",
    marginTop: 10,
  },
  sectionImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  screenText: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
  },
});
