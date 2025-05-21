// import React, { useRef, useState, useEffect } from "react";
// import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { hp, wp } from "../helpers/common";
// import { Image } from "react-native";
// import { theme } from "../constants/theme";
// import Button from "../components/Button";
// import { useRouter } from "expo-router";
// import ScreenWrapper from "../components/ScreenWrapper";
// import Input from "../components/Input";
// import BackButton from "../components/BackButton";
// import Icon from "react-native-vector-icons/FontAwesome";
// import logo from "../assets/images/logo.png";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { WebView } from "react-native-webview"; // Import WebView
// import config from "../config"; // Import your config file


// // Base URL of your backend
// const BASE_URL = "http://192.168.18.128:8000"; // Update this with your FastAPI backend URL

// const isValidUsername = (username) => username.length >= 3; // Basic validation for username length
// const isValidPassword = (password) => password.length >= 6;

// const Login = () => {
//   const router = useRouter();
//   const usernameRef = useRef("");
//   const passwordRef = useRef("");
//   const [loading, setLoading] = useState(false);
//   const [showMessage, setShowMessage] = useState(true);
//   const [passwordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
//   const [showWebView, setShowWebView] = useState(false); // State to toggle WebView

//   useEffect(() => {
//     const timer = setTimeout(() => setShowMessage(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   const onSubmit = async () => {
//     if (!usernameRef.current || !passwordRef.current) {
//       Alert.alert("Login", "Please fill all the fields!");
//       return;
//     }

//     if (!isValidUsername(usernameRef.current)) {
//       Alert.alert("Invalid Username", "Please enter a valid username.");
//       return;
//     }

//     if (!isValidPassword(passwordRef.current)) {
//       Alert.alert("Weak Password", "Password must be at least 6 characters long.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Log the login request data
//       console.log("Logging in with username:", usernameRef.current);
      
//       // Call the API to log in
//       const response = await axios.post(`${config.API_IP}/login`, {
//         username: usernameRef.current,  // Backend expects `username`
//         password: passwordRef.current,  // Backend expects `password`
//       });

//       // Log the response for debugging
//       console.log("Login Response:", response.data);

//       if (response?.data?.token) {
//         // Store the token securely
//         await AsyncStorage.setItem("token", response.data.token);
//         Alert.alert("Login Successful", "You are now logged in!");

//         // Redirect based on user role
//         if (response.data.role === "vendor") {
//           router.push({ pathname: "vendorHomePage", params: { username: usernameRef.current } }); // Pass username
//         } else if (response.data.role === "customer") {
//           router.push({ pathname: "customerLandingPage", params: { username: usernameRef.current } }); // Pass username
//         } else if (response.data.role === "admin") {
//           router.push({ pathname: "admin", params: { username: usernameRef.current } }); // Pass username
//         } else {
//           Alert.alert("Login Failed", "Invalid user role.");
//         }
//       } else {
//         Alert.alert("Login Failed", "Invalid credentials. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login Error:", error);
//       Alert.alert("Login Failed", "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScreenWrapper bg="white">
//       <StatusBar style="dark" />

//       {showWebView ? (
//         <View style={{ flex: 1 }}>
//           <WebView
//             source={{ uri: "https://test-pay.khalti.com/?pidx=AyML9HqH5tqcR3dTdKKBzi" }}
//             style={{ flex: 1 }}
//             onNavigationStateChange={(event) => {
//               if (event.url.includes("status:Completed")) {
//                 setShowWebView(false); // Close WebView if the status is Completed
//               }
//             }}
//           />
//           <Pressable onPress={() => setShowWebView(false)} style={styles.closeButton}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </Pressable>
//         </View>
//       ) : (
//         <View style={styles.container}>
//           <View style={styles.headerContainer}>
//             <Image source={logo} style={styles.logo} resizeMode="contain" />
//             <View>
//               <Text style={styles.welcomeText_one}>Hey, Welcome back to</Text>
//               <Text style={styles.welcomeText}>Vrikshya Rakshya</Text>
//             </View>
//           </View>

//           <View style={styles.form}>
//             {showMessage && (
//               <Text style={{ fontSize: hp(2), color: "#397454" }}>
//                 Please login
//               </Text>
//             )}

//             <Input
//               icon={<Icon name="user" size={26} color="#3e8e41" />} // Green color for the icon
//               placeholder="Enter your username"
//               onChangeText={(value) => (usernameRef.current = value)}
//             />

//             <View style={styles.passwordInputContainer}>
//               <Input
//                 icon={<Icon name="lock" size={26} color="#3e8e41" />} // Green color for the icon
//                 placeholder="Enter your password"
//                 secureTextEntry={!passwordVisible} // Conditional secureTextEntry
//                 onChangeText={(value) => (passwordRef.current = value)}
//               />
//               <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
//                 <Icon
//                   name={passwordVisible ? "eye-slash" : "eye"} // Eye icon toggles based on visibility state
//                   size={26}
//                   color="#3e8e41" // Green color for the eye icon
//                   style={styles.eyeIcon}
//                 />
//               </Pressable>
//             </View>

//             <Pressable onPress={() => router.push("forgot")}>
//               <Text style={[styles.forgotPassword, { fontWeight: "bold", color: "#397454" }]}>
//                 Forgot Password?
//               </Text>
//             </Pressable>

//             <Button title="Login" loading={loading} onPress={onSubmit} />

//             <View style={styles.footer}>
//               <Text style={styles.footerText}> Don&apos;t have an account yet?</Text>
//               <Pressable onPress={() => router.push("signUp")}>
//                 <Text style={[styles.footerText, { color: "#397454", fontWeight: "bold" }]}>
//                   Sign Up Now
//                 </Text>
//               </Pressable>
//               {/* <Pressable onPress={() => setShowWebView(true)} style={styles.iconContainer}>
//                  <Icon name="globe" size={20} color="#397454" style={styles.icon} /> 
//                  <Text style={[styles.footerText, { color: "#397454", fontWeight: "bold" }]}>
//                   Open Browser
//                 </Text> 
//               </Pressable> */}
//             </View>
//           </View>
//         </View>
//       )}
//     </ScreenWrapper>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     gap: 3,
//     paddingHorizontal: wp(3),
//   },
//   logo: {
//     width: wp(10),
//     height: hp(8),
//     marginTop: -hp(8),
//   },
//   welcomeText: {
//     fontSize: hp(3),
//     fontWeight: "bold",
//     color: "#397454",
//     paddingBottom: wp(5),
//   },
//   welcomeText_one: {
//     fontSize: hp(3),
//     fontWeight: "bold",
//     color: "#397454",
//     textAlign: "center",
//     marginTop: -hp(4),
//   },
//   form: {
//     gap: 33,
//   },
//   forgotPassword: {
//     textAlign: "right",
//     fontWeight: "semibold",
//     color: theme.colors.text,
//   },
//   footer: {
//     gap: 5,
//     textAlign: "right",
//     flexDirection: "row",
//     justifyContent: "center",
//   },
//   footerText: {
//     textAlign: "center",
//     color: theme.colors.text,
//     fontSize: hp(1.6),
//   },
//   passwordInputContainer: {
//     position: "relative",
//   },
//   eyeIcon: {
//     position: "absolute", // Ensure the icon is positioned absolutely within the container
//     right: wp(2), // Align the icon to the right-most corner
//     top: "50%", // Vertically center the icon
//     transform: [{ translateY: -44 }], // Adjust for proper centering
//     zIndex: 1,
//   },
//   iconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: 10,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   closeButton: {
//     position: "absolute",
//     top: -20, // Move the button upward
//     right: 20,
//     backgroundColor: "#397454",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     zIndex: 1000,
//   },
//   closeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });

import React, { useRef, useState, useEffect } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme"; // your original theme import
import Button from "../components/Button";
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import Icon from "react-native-vector-icons/FontAwesome";
import logo from "../assets/images/logo.png";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import config from "../config";

const isValidUsername = (username) => username.length >= 3;
const isValidPassword = (password) => password.length >= 6;

const Login = () => {
  const router = useRouter();
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async () => {
    if (!usernameRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }
    if (!isValidUsername(usernameRef.current)) {
      Alert.alert("Invalid Username", "Please enter a valid username.");
      return;
    }
    if (!isValidPassword(passwordRef.current)) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${config.API_IP}/login`, {
        username: usernameRef.current,
        password: passwordRef.current,
      });
      if (response?.data?.token) {
        await AsyncStorage.setItem("token", response.data.token);
        Alert.alert("Login Successful", "You are now logged in!");
        if (response.data.role === "vendor") {
          router.push({ pathname: "vendorHomePage", params: { username: usernameRef.current } });
        } else if (response.data.role === "customer") {
          router.push({ pathname: "customerLandingPage", params: { username: usernameRef.current } });
        } else if (response.data.role === "admin") {
          router.push({ pathname: "admin", params: { username: usernameRef.current } });
        } else {
          Alert.alert("Login Failed", "Invalid user role.");
        }
      } else {
        Alert.alert("Login Failed", "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Login Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      {showWebView ? (
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: "https://test-pay.khalti.com/?pidx=AyML9HqH5tqcR3dTdKKBzi" }}
            style={{ flex: 1 }}
            onNavigationStateChange={(event) => {
              if (event.url.includes("status:Completed")) {
                setShowWebView(false);
              }
            }}
          />
          <Pressable onPress={() => setShowWebView(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.welcomeText_one}>Hey, Welcome back to</Text>
              <Text style={styles.welcomeText}>Vrikshya Rakshya</Text>
            </View>
          </View>

          <View style={styles.form}>
            {showMessage && (
              <Text style={styles.loginPromptText}>Please login</Text>
            )}

            <View style={styles.inputWrapper}>
              <Icon name="user" size={24} color="#397454" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your username"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => (usernameRef.current = value)}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="lock" size={24} color="#397454" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                style={styles.input}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(value) => (passwordRef.current = value)}
                placeholderTextColor="#999"
              />
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIconWrapper}>
                <Icon
                  name={passwordVisible ? "eye-slash" : "eye"}
                  size={22}
                  color="#397454"
                />
              </Pressable>
            </View>

            <Pressable onPress={() => router.push("forgot")}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Pressable>

            <View style={styles.loginButtonWrapper}>
              <Button title="Login" loading={loading} onPress={onSubmit} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don&apos;t have an account yet? </Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text style={[styles.footerText, styles.signUpText]}>Sign Up Now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    justifyContent: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(6),
    gap: wp(3),
  },
  logo: {
    width: wp(12),
    height: hp(12),
    marginTop: -hp(6),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "700",
    color: "#397454",
  },
  welcomeText_one: {
    fontSize: hp(2.5),
    fontWeight: "600",
    color: "#397454",
    marginBottom: 4,
  },
  form: {
    gap: hp(3),
  },
  loginPromptText: {
    fontSize: hp(2.2),
    color: "#397454",
    marginBottom: hp(1),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F6F1",
    borderRadius: 10,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: hp(1.5),
  },
  inputIcon: {
    marginRight: wp(3),
  },
  input: {
    flex: 1,
    fontSize: hp(2),
    color: "#424242",
  },
  eyeIconWrapper: {
    padding: wp(2),
  },
  forgotPassword: {
    textAlign: "right",
    color: "#397454",
    fontWeight: "600",
    fontSize: hp(1.8),
    marginBottom: hp(3),
  },
  loginButtonWrapper: {
    marginTop: hp(1),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: hp(5),
  },
  footerText: {
    fontSize: hp(1.8),
    color: "#424242",
  },
  signUpText: {
    color: "#397454",
    fontWeight: "700",
    marginLeft: 5,
  },
  closeButton: {
    position: "absolute",
    top: -20,
    right: 20,
    backgroundColor: "#397454",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 1000,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
