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
// const isValidEmail = (emailRef) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailRef);

// const SignUp = () => {
//   const router = useRouter();
//   const emailRef = useRef("");
//   const passwordRef = useRef("");
//   const nameRef = useRef("");
//   const fullnameRef = useRef("");
//   const roleRef = useRef("");
//   const [loading, setLoading] = useState(false);
//   const [showMessage, setShowMessage] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowMessage(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   const onSubmit = async () => {
//     if (!emailRef.current || !passwordRef.current || !nameRef.current || !fullnameRef.current || !roleRef.current) {
//       Alert.alert('Login', "Please fill all the fields!");
//     }

//     if(emailRef.current && passwordRef.current && nameRef.current && roleRef.current){
//       if (!isValidEmail(emailRef.current)) {
//         Alert.alert("Invalid Email", "Please enter a valid email address.");
//       }
  
//       if (passwordRef.current.length < 6) {
//         Alert.alert("Weak Password", "Password must be at least 6 characters long.");
//       }

      

//     }

    
//   };

//   return (
//     <ScreenWrapper bg="white">
//       <View style={styles.container}>
//         <View>
//           <Image source={logo} style={styles.logo} resizeMode="contain" />
//           <Text style={styles.welcomeText}>Hey,</Text>
//           <Text style={styles.welcomeText}>Welcome to Vrikshya Rakshya</Text>
//         </View>

//         <View style={styles.form}>
//           {showMessage && (
//             <Text style={{ fontSize: hp(1.5), color: "black" }}>
//               Please fill in the fields below to create a new account
//             </Text>
//           )}
//           <Input
//             icon={<Icon name="user" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your Full Name"
//             onChangeText={(value) => (fullnameRef.current = value)}
//           />
//           <Input
//             icon={<Icon name="user" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your username"
//             onChangeText={(value) => (nameRef.current = value)}
//           />

//           <Input
//             icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your email"
//             onChangeText={(value) => (emailRef.current = value)}
//           />
//           <Input
//             icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your password"
//             secureTextEntry
//             onChangeText={(value) => (passwordRef.current = value)}
//           />
//           <Input
//             icon={<Icon name="user" size={26} strokeWidth={1.6} />}
//             placeholder="Enter your role: customer/vendor"
//             secureTextEntry
//             onChangeText={(value) => (roleRef.current = value)}
//           />

//           <Button title="SignUp" loading={loading} onPress={onSubmit} />

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already an account?</Text>
//             <Pressable onPress={() => router.push('login')}>
//               <Text style={[styles.footerText, { color: '#397454', fontWeight: 'bold' }]}>Login</Text>
//             </Pressable>
//           </View>
//         </View>
//       </View>
//     </ScreenWrapper>
//   );
// };

// export default SignUp;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     gap: 30,
//     paddingHorizontal: wp(3),
//     paddingTop: 0,
//     marginTop: 0,
//   },
//   logo: {
//     width: wp(10),
//     height: hp(8),
//     marginTop: -hp(8),
//     paddingTop: 0,
//   },
//   welcomeText: {
//     fontSize: hp(3),
//     fontWeight: "bold",
//     color: '#397454',
//   },
//   form: {
//     gap: 33,
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

import React, { useRef, useState, useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { Image } from "react-native";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { TextInput } from "react-native-gesture-handler";
import Input from "../components/Input";
import BackButton from "../components/BackButton";
import Icon from "../assets/icons";
import logo from "../assets/images/logo.png";

const isValidEmail = (emailRef) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(emailRef);

const isValidRole = (role) => {
  if (role !== "customer" && role !== "vendor" && role !== "Vendor" && role !== "Customer") {
    Alert.alert("Invalid Role", "Role must be either 'customer' or 'vendor'.");
    return false;
  }
  return true;
};

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const fullnameRef = useRef("");
  const roleRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // const onSubmit = async () => {
  //   if (
  //     !emailRef.current ||
  //     !passwordRef.current ||
  //     !nameRef.current ||
  //     !fullnameRef.current ||
  //     !roleRef.current
  //   ) {
  //     Alert.alert("Login", "Please fill all the fields!");
  //     return;
  //   }

  //   if (!isValidEmail(emailRef.current)) {
  //     Alert.alert("Invalid Email", "Please enter a valid email address.");
  //     return;
  //   }

  //   if (passwordRef.current.length < 6) {
  //     Alert.alert("Weak Password", "Password must be at least 6 characters long.");
  //     return;
  //   }

  //   if (!isValidRole(roleRef.current)) {
  //     return;
  //   }

  //   Alert.alert("Success", "Account created successfully!");
  // };
  const onSubmit = async () => {
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !nameRef.current ||
      !fullnameRef.current ||
      !roleRef.current
    ) {
      Alert.alert("Login", "Please fill all the fields!");
      return;
    }
  
    if (!isValidEmail(emailRef.current)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
  
    if (passwordRef.current.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
  
    if (!isValidRole(roleRef.current)) {
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailRef.current,
          username: nameRef.current,
          full_name: fullnameRef.current,
          role: roleRef.current.toLowerCase(),
          password: passwordRef.current,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert("Success", "Account created successfully!");
        router.push("login");
      } else {
        Alert.alert("Error", data.detail || "Signup failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome to Vrikshya Rakshya</Text>
        </View>

        <View style={styles.form}>
          {showMessage && (
            <Text style={{ fontSize: hp(2), color: "#397454" }}>
              Please fill in the fields below to create a new account
            </Text>
          )}
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your Full Name"
            onChangeText={(value) => (fullnameRef.current = value)}
          />
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your username"
            onChangeText={(value) => (nameRef.current = value)}
          />

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email"
            onChangeText={(value) => (emailRef.current = value)}
          />
          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
          />
          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your role: customer/vendor"
            onChangeText={(value) => (roleRef.current = value)}
          />

          <Button title="SignUp" loading={loading} onPress={onSubmit} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already an account?</Text>
            <Pressable onPress={() => router.push("login")}>
              <Text style={[styles.footerText, { color: "#397454", fontWeight: "bold" }]}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: wp(3),
    paddingTop: 0,
    marginTop: 0,
  },
  logo: {
    width: wp(10),
    height: hp(8),
    marginTop: -hp(8),
    paddingTop: 0,
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: "#397454",
  },
  form: {
    gap: 25,
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
