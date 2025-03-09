// import React, { useRef, useState, useEffect } from 'react';
// import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import { hp, wp } from "../helpers/common";
// import { Image } from "react-native";
// import { theme } from "../constants/theme";
// import Button from "../components/Button";
// import { useRouter } from 'expo-router';
// import ScreenWrapper from '../components/ScreenWrapper';
// import { TextInput } from "react-native-gesture-handler";
// import Input from "../components/Input";
// import BackButton from "../components/BackButton";
// import Icon from "../assets/icons";
// import logo from "../assets/images/logo.png";
// import { login } from "./api"; 
// const isValidEmail = (emailRef) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailRef);

// const isValidPassword = (passwordRef) => passwordRef.current.length>6;
// const Login = () => {
//   const router = useRouter();
//   const emailRef = useRef("");
//   const passwordRef = useRef("");
//   const [loading, setLoading] = useState(false);
//   const [showMessage, setShowMessage] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowMessage(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   const onSubmit = async () => {
//     if (!emailRef.current || !passwordRef.current) {
//       Alert.alert('Login', "Please fill all the fields!");
//     }

//     if (!isValidEmail(emailRef.current)) {
//       Alert.alert("Invalid Email", "Please enter a valid email address.");
//     }

//     if (passwordRef.current.length < 6) {
//       Alert.alert("Weak Password", "Password must be at least 6 characters long.");
//     }
//     if (isValidEmail(emailRef.current) || isValidPassword(passwordRef.current)) {
//       router.push('customerLandingPage');}
     
//   };

//   return (
//     <ScreenWrapper bg="white">
//       <StatusBar style="dark" />


//       <View style={styles.container}>
        
        
//         <View style={styles.headerContainer}>
//         <Image source={logo} style={styles.logo} resizeMode="contain" />
//         <View>
//           <Text style={styles.welcomeText_one}>Hey, Welcome back to</Text>
//           <Text style={styles.welcomeText}>Vrikshya Rakshya</Text>
//         </View>
//         </View>

//         <View style={styles.form}>
//           {showMessage && (
//             <Text style={{ fontSize: hp(2), color: "#397454" }}>
//               Please login
//             </Text>
//           )}
//           <Input
//             icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your email address"
//             onChangeText={(value) => (emailRef.current = value)}
//           />

//           <Input
//             icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your password"
//             secureTextEntry
//             onChangeText={(value) => (passwordRef.current = value)}
//           />
//           <Pressable onPress={()=> router.push('forgot')}>
//           <Text style={[styles.forgotPassword, { fontWeight: "bold", color: "#397454" }]}>
//             Forgot Password?
//           </Text>
//           </Pressable>

//           <Button title="Login" loading={loading} onPress={onSubmit} />

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account yet?</Text>
//             <Pressable onPress={() => router.push('signUp')}>
//               <Text style={[styles.footerText, { color: '#397454', fontWeight: 'bold' }]}>Sign Up Now</Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
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
//     color: '#397454',
//     paddingBottom: wp(5),
//   },
//   welcomeText_one:{
//     fontSize: hp(3),
//     fontWeight: "bold",
//     color: '#397454',
//     textAlign: 'center',
//     marginTop: -hp(4),
//   },
//   welcomeText_two:{
//     fontSize: hp(3),
//     fontWeight: "bold",
//     color: '#397454',
//     marginTop: -hp(2)
//   },
//   title: {
//     color: theme.colors.text,
//     fontSize: hp(2),
//     textAlign: "center",
//     fontWeight: "bold",
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
//     textAlign: 'center',
//     color: theme.colors.text,
//     fontSize: hp(1.6),
//   },
// });

import React, { useRef, useState, useEffect } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { Image } from "react-native";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper";
import Input from "../components/Input";
import BackButton from "../components/BackButton";
import Icon from "../assets/icons";
import logo from "../assets/images/logo.png";
import { login } from "../services/api";  // Import login API function
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
const isValidPassword = (password) => password.length >= 6;

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }

    if (!isValidEmail(emailRef.current)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!isValidPassword(passwordRef.current)) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      // Call the API to log in
      const response = await login(emailRef.current, passwordRef.current);

      if (response?.token) {
        // Store the token securely
        await AsyncStorage.setItem("token", response.token);
        Alert.alert("Login Successful", "You are now logged in!");

        // Redirect to the landing page
        router.push("customerLandingPage");
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
            <Text style={{ fontSize: hp(2), color: "#397454" }}>
              Please login
            </Text>
          )}

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email address"
            onChangeText={(value) => (emailRef.current = value)}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            // secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />

          <Pressable onPress={() => router.push("forgot")}>
            <Text style={[styles.forgotPassword, { fontWeight: "bold", color: "#397454" }]}>
              Forgot Password?
            </Text>
          </Pressable>

          <Button title="Login" loading={loading} onPress={onSubmit} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account yet?</Text>
            <Pressable onPress={() => router.push("signUp")}>
              <Text style={[styles.footerText, { color: "#397454", fontWeight: "bold" }]}>
                Sign Up Now
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 3,
    paddingHorizontal: wp(3),
  },
  logo: {
    width: wp(10),
    height: hp(8),
    marginTop: -hp(8),
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#397454",
    paddingBottom: wp(5),
  },
  welcomeText_one: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#397454",
    textAlign: "center",
    marginTop: -hp(4),
  },
  form: {
    gap: 33,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "semibold",
    color: theme.colors.text,
  },
  footer: {
    gap: 5,
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
