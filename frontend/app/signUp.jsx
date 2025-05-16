import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert, // Import Alert
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

// Import your logo
const logo = require("../assets/images/logo.png");

const SignupScreen = () => {
  const navigation = useNavigation(); // Use the hook to get navigation
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSignup = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword || !role) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
          role,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Signup successful! Please check your email.');
        navigation.navigate('login'); // Navigate to login page
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Signup failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {/* Header with Logo and Text Side by Side */}
          <View style={styles.headerContainer}>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Hey,</Text>
              <Text style={styles.welcomeText}>Welcome to Vrikshya Rakshya</Text>
            </View>
          </View>

          {/* Signup Form */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#3e8e41" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#3e8e41" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#3e8e41" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#3e8e41" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon name={passwordVisible ? "eye" : "eye-slash"} size={20} color="#3e8e41" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#3e8e41" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Icon name={confirmPasswordVisible ? "eye" : "eye-slash"} size={20} color="#3e8e41" />
              </TouchableOpacity>
            </View>

            {/* Role Input */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#3e8e41" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your role: customer/vendor"
                placeholderTextColor="#999"
                value={role}
                onChangeText={setRole}
              />
            </View>

            {/* Signup Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32', // dark green
    marginLeft: -20, // Shift text slightly to the left
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32', // dark green
    marginLeft: -20, // Shift text slightly to the left
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 25, // Increased marginBottom for more spacing
    paddingHorizontal: 10,
    height: 55,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50', // green
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#777',
    fontSize: 16,
  },
  loginLink: {
    color: '#2E7D32', // dark green
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupScreen;