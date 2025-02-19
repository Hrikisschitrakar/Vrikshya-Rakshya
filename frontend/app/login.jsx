
import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
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
import Icon from "../assets/icons/index"
const Login = () => {
  const router = useRouter();
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
              <Input />
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
