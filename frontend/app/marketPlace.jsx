// import React from "react";
// import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Icon from "react-native-vector-icons/Ionicons";
// import Button from "../components/Button";
// import { useRouter } from 'expo-router';
// const Tab = createBottomTabNavigator();
// const HomeScreen = () => <Text style = {styles.screenText}>Home</Text>;
// const NotificationScreen = () => <Text style={styles.screenText}>Notifications</Text>;
// const ProfileScreen = () => <Text style={styles.screenText}>Profile</Text>;

// const MarketplaceScreen = () => {
//     return (
//       <ScrollView style={styles.container}>
//         {/* Search Bar */}
//         <Text style={styles.sectionTitle}>Search</Text>
//         <TextInput 
//           style={styles.searchBar} 
//           placeholder="Search vendors, products, or remedies..." 
//         />
        
//         {/* Sort By Options */}
//         <Text style={styles.sectionTitle}>Sort By</Text>
//         <View style={styles.sortOptions}>
//           <Pressable style={styles.sortButton}><Text>Price</Text></Pressable>
//           <Pressable style={styles.sortButton}><Text>Location</Text></Pressable>
//           <Pressable style={styles.sortButton}><Text>Relevance</Text></Pressable>
//         </View>
        
//         {/* Category Options */}
//         <View style={styles.categoriesContainer}>
//           <View style={styles.categoryBox}>
//             <Icon name="storefront" size={50} color="#397454" />
//             <Text>Vendors</Text>
//           </View>
//           <View style={styles.categoryBox}>
//             <Icon name="cube" size={50} color="#397454" />
//             <Text>Products</Text>
//           </View>
//           <View style={styles.categoryBox}>
//             <Icon name="medkit" size={50} color="#397454" />
//             <Text>Remedies</Text>
//           </View>
//         </View>
        
//         {/* Search Results */}
//         <Text style={styles.sectionTitle}>Search Results</Text>
//         <View style={styles.resultItem}>
//           <Icon name="storefront" size={30} color="#397454" />
//           <View>
//             <Text style={styles.resultTitle}>Vendor Name</Text>
//             <Text style={styles.resultSubText}>Location</Text>
//           </View>
//           <Text style={styles.resultInfo}>Rating</Text>
//         </View>
//         <View style={styles.resultItem}>
//           <Icon name="cube" size={30} color="#397454" />
//           <View>
//             <Text style={styles.resultTitle}>Product Name</Text>
//             <Text style={styles.resultSubText}>Price</Text>
//           </View>
//           <Text style={styles.resultInfo}>Availability</Text>
//         </View>
//         <View style={styles.resultItem}>
//           <Icon name="medkit" size={30} color="#397454" />
//           <View>
//             <Text style={styles.resultTitle}>Disease Name</Text>
//             <Text style={styles.resultSubText}>Recommended Actions</Text>
//           </View>
//         </View>
        
//         {/* No Results Found */}
//         <Text style={styles.sectionTitle}>No Results Found</Text>
//         <View style={styles.noResultsContainer}>
//           <Text>No Results Found</Text>
//           <Text>Try searching with different keywords</Text>
//         </View>
//       </ScrollView>
//     );
//   };
  


// const Marketplace = () => {
//   const router = useRouter();
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;
//           if (route.name === "Home") iconName = "home";
//           else if (route.name === "Marketplace") iconName = "cart";
//           else if (route.name === "Notifications") iconName = "notifications";
//           else if (route.name === "Profile") iconName = "person";

//           return <Icon name={iconName} size={size} color={color}
//           onPress={() => {
//             if (route.name === "Home") router.push("customerLandingPage");
//             else if (route.name === "Notifications") router.push("notificationCenter");
//           }}
//  />;
//         },
//         tabBarActiveTintColor: "#397454",
//         tabBarInactiveTintColor: "gray",
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component = {HomeScreen}/>
//       <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
//       <Tab.Screen name="Notifications" component={NotificationScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />

//     </Tab.Navigator>
//   );
// };

// export default Marketplace;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "white",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   searchBar: {
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   sortOptions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   sortButton: {
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//     borderRadius: 5,
//   },
//   resultItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   resultTitle: {
//     fontWeight: "bold",
//   },
//   resultSubText: {
//     color: "gray",
//   },
//   resultInfo: {
//     fontWeight: "bold",
//   },
// });


import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Marketplace = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <Text style={styles.sectionTitle}>Search</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search vendors, products, or remedies..."
      />

      {/* Sort By Options */}
      <Text style={styles.sectionTitle}>Sort By</Text>
      <View style={styles.sortOptions}>
        <Pressable style={styles.sortButton}>
          <Text>Price</Text>
        </Pressable>
        <Pressable style={styles.sortButton}>
          <Text>Location</Text>
        </Pressable>
        <Pressable style={styles.sortButton}>
          <Text>Relevance</Text>
        </Pressable>
      </View>

      {/* Category Options */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoryBox}>
          <Icon name="storefront" size={50} color="#397454" />
          <Text>Vendors</Text>
        </View>
        <View style={styles.categoryBox}>
          <Icon name="cube" size={50} color="#397454" />
          <Text>Products</Text>
        </View>
        <View style={styles.categoryBox}>
          <Icon name="medkit" size={50} color="#397454" />
          <Text>Remedies</Text>
        </View>
      </View>

      {/* Search Results */}
      <Text style={styles.sectionTitle}>Search Results</Text>
      <View style={styles.resultItem}>
        <Icon name="storefront" size={30} color="#397454" />
        <View>
          <Text style={styles.resultTitle}>Vendor Name</Text>
          <Text style={styles.resultSubText}>Location</Text>
        </View>
        <Text style={styles.resultInfo}>Rating</Text>
      </View>
      <View style={styles.resultItem}>
        <Icon name="cube" size={30} color="#397454" />
        <View>
          <Text style={styles.resultTitle}>Product Name</Text>
          <Text style={styles.resultSubText}>Price</Text>
        </View>
        <Text style={styles.resultInfo}>Availability</Text>
      </View>
      <View style={styles.resultItem}>
        <Icon name="medkit" size={30} color="#397454" />
        <View>
          <Text style={styles.resultTitle}>Disease Name</Text>
          <Text style={styles.resultSubText}>Recommended Actions</Text>
        </View>
      </View>

      {/* No Results Found */}
      <Text style={styles.sectionTitle}>No Results Found</Text>
      <View style={styles.noResultsContainer}>
        <Text>No Results Found</Text>
        <Text>Try searching with different keywords</Text>
      </View>
    </ScrollView>
  );
};

export default Marketplace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sortButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryBox: {
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "30%",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultTitle: {
    fontWeight: "bold",
  },
  resultSubText: {
    color: "gray",
  },
  resultInfo: {
    fontWeight: "bold",
  },
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
});
