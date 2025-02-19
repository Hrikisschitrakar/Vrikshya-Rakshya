
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, {useRef, useState} from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common" // Ensure wp is correctly defined
import { Image } from "react-native"
import { theme } from "../constants/theme"
import Button from "../components/Button"
import {useRouter} from 'expo-router'
import ScreenWrapper  from '../components/ScreenWrapper'
import { TextInput } from "react-native-gesture-handler"
import Input from "../components/Input"
import BackButton from "../components/BackButton"
import Icon from "../assets/icons"

const isValidEmail = (emailRef) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(emailRef);

const Login = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current){
      Alert.alert('Login', "Please fill all the fields!");
    }

    if(!isValidEmail(emailRef.current)){
      Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    if(passwordRef.current.length <6){
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
    }

  }
  return (

    <ScreenWrapper bg= "white">
      <StatusBar style= "dark"/>
        <View style={styles.container}>
            {/* <BackButton router= {router}/> */}
            {/* <Icon name="delete"/> */}
            <View>
              <Text style={styles.welcomeText}>Hey,</Text>
              <Text style={styles.welcomeText}>Welcome back to Vrikshya Rakshya</Text>

            </View>

            <View style={styles.form}>
              <Text style={{fontSize: hp(1.5), color: "black"}}>
                Please login
              </Text>
              <Input
              icon= {<Icon name="mail" size={26} strokeWidth={1.6} />}
              placeholder="Enter your email address"
              onChangeText={value=> emailRef.current = value}
              />
              
              <Input
              icon= {<Icon name="lock" size={26} strokeWidth={1.6} />}
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={value=> passwordRef.current = value}
              />

              <Text style={[styles.forgotPassword, {fontWeight: "bold", color: "#397454"}]}>
                Forgot Password?
              </Text>

              <Button title="Login" loading={loading} onPress= {onSubmit}/>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                Don't have an account yet?
                </Text>
                <Pressable onPress={() => router.push('signUp')}>
                  <Text style={[styles. footerText,{color:'#397454', fontWeight:'bold'}]}>Sign Up Now</Text>
                </Pressable>
              </View>

            </View>

            </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 50,
    paddingHorizontal: wp(3),
  },
  welcomeText: {
    fontSize: hp(3),
    fontWeight: "bold",
    color: '#397454'
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(2),
    textAlign: "center",
    fontWeight: "bold"
  },
  form: {
    gap:33,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "semibold",
    color: theme.colors.text

  },
  footer: {
    gap: 5,
    textAlign: "right",
    flexDirection: "row",
    justifyContent: "center"
  },
   footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  }
});
