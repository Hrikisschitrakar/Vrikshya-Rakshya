
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

const Forgot = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async () => {
    if (!emailRef.current || !nameRef.current) {
      Alert.alert('Login', "Please fill all the fields!");
    }
    if (!isValidEmail(emailRef.current)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    if (nameRef.current.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.headerContainer}>
        <View>
          <Text style={styles.welcomeText}>Hey, forgot password?</Text>
          <Text style={styles.welcomeText}>Don't worry</Text>
        </View>
        </View>

        <View style={styles.form}>
          {showMessage && (
            <Text style={{ fontSize: hp(2), color: "#397454" }}>
              Please fill the following fields:
            </Text>
          )}
          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder="Enter your email address"
            onChangeText={(value) => (emailRef.current = value)}
          />

          <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6} />}
            placeholder="Enter your username"
            onChangeText={(value) => (nameRef.current = value)}
          />


          <Button title="Submit" loading={loading} onPress={onSubmit} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account yet?</Text>
            <Pressable onPress={() => router.push('signUp')}>
              <Text style={[styles.footerText, { color: '#397454', fontWeight: 'bold' }]}>Sign Up Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Forgot;

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
    color: '#397454',
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(2),
    textAlign: "center",
    fontWeight: "bold",
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
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
