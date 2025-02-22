import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import HomeScreen from "../app/customerLandingPage"; 
import MarketplaceScreen from "../app/marketPlace"; 
import NotificationCenter from "../app/notificationCenter";



const Tab = createBottomTabNavigator();

const Navbar = () => {
  const router = useRouter();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Marketplace") iconName = "cart";
          else if (route.name === "Notifications") iconName = "notifications";
          else if (route.name === "Profile") iconName = "person";

          return <Icon name={iconName} size={size} color={color} onPress={() => {
            if (route.name === "Marketplace") router.push("marketplace");
            if (route.name === "Notifications") router.push("notificationCenter");
          }} />;
        },
        tabBarActiveTintColor: "#397454",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Notifications" component={NotificationCenter} />

    </Tab.Navigator>
  );
};

export default Navbar;
