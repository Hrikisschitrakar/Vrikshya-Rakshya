import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common"; // Ensure wp is correctly defined
import { Image } from "react-native";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import {useRouter} from 'expo-router'
import { ScreenContentWrapper } from 'react-native-screens'
import { TextInput } from "react-native-gesture-handler";
import Input from "../components/Input";
import Icon from "../assets/icons";
const Login = () => {
  return (
    <ScreenWrapper>
        <View>
            <Text style={styles.welcomeText}>Hey,</Text>
            <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>
        <View style={styles.form}>
            <Text style={{fontSize: hp(1.5), color: theme.colors.text}}>
                Please login to continue
            </Text>
            <Input 
            icon= {<Icon name= 'mail' size={26} strokeWidth={1.6}/>}
            placeholder="Enter your email address"
            onChangeText={value=>{}}
            />
            </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 50,
    paddingHorizontal: wp(5),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: '#397454'
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: "bold"
  },
  form: {
    gap:55,
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
