import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common"; // Ensure wp is correctly defined
import { Image } from "react-native";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import {useRouter} from 'expo-router'
const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg="#A2FAA8">
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/*welcome imge */}
        <Image style = {styles.welcomeImage} resizeMode= 'contain' source={require("/Users/hrikisschitrakar/Desktop/Vrikshya-Rakshya/frontend/assets/images/logo.png")} />
        <View style={{gap:20}}>
            <Text style={styles.title}>Vriskhya Rakshya</Text>
            <Text style={styles.punchline}>
                Where your plants find safety
            </Text>
        </View>
        <View style={styles.footer}>
            <Button 
            title="Getting Started? " 
            buttonStyle={{marginHorizontal: wp(3)}} 
            onPress={()=> router.push('/signUp')}    
            />
            <View style={styles.bottomTextContainer}>
                <Text style={styles.loginText}>
                    Already have an account?
                </Text>
                <Pressable onPress={()=> router.push('/login')}>
                    <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>
                        Login
                    </Text>
                </Pressable>
                </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#A2FAA8",
    marginHorizontal: wp(0), // Make sure wp() is correctly imported
  },
  welcomeImage: {
    height: hp(30),
    weight : wp(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: "bold"
  },
  punchline: {
    color: theme.colors.text,
    fontSize: hp(2),
    paddingHorizontal: wp(6), // Make sure wp() is correctly imported
    textAlign: "center"
  },
  footer: {
    gap: 30,
    width: '100%'
  },
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  }
});
