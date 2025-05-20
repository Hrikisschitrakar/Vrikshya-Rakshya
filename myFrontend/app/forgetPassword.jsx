// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import config from '../config'; // Adjust the import path as necessary
// const ForgetPassword = () => {
//   const [token, setToken] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

//   const handlePasswordReset = async () => {
//     if (!token || !newPassword) {
//       Alert.alert('Error', 'Please fill in both fields.');
//       return;
//     }

//     try {
//       const response = await axios.post(`${config.API_IP}/reset-password`, {
//         token,
//         new_password: newPassword,
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'Password has been reset successfully.');
//       } else {
//         Alert.alert('Error', 'Failed to reset password.');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.detail || 'An error occurred.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Enter Token</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Token"
//         value={token}
//         onChangeText={setToken}
//       />

//       <Text style={styles.label}>Enter New Password</Text>
//       <View style={styles.passwordContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="New Password"
//           secureTextEntry={!isPasswordVisible}
//           value={newPassword}
//           onChangeText={setNewPassword}
//         />
//         <TouchableOpacity
//           onPress={() => setIsPasswordVisible(!isPasswordVisible)}
//           style={styles.eyeIcon}
//         >
//           <Ionicons
//             name={isPasswordVisible ? 'eye-off' : 'eye'}
//             size={24}
//             color="gray"
//           />
//         </TouchableOpacity>
//       </View>

//       <Button title="Reset Password" onPress={handlePasswordReset} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   input: {
//     flex: 1,
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 16,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 4,
//     marginBottom: 16,
//   },
//   eyeIcon: {
//     padding: 8,
//   },
// });

// export default ForgetPassword;
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../config';

const ForgetPassword = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handlePasswordReset = async () => {
    if (!token || !newPassword) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Your passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await axios.post(`${config.API_IP}/reset-password`, {
        token,
        new_password: newPassword,
      });
      
      if (response.status === 200) {
        Alert.alert(
          'Success',
          'Your password has been reset successfully!',
          [{ text: 'Login Now', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'login' }] }) }]
        );
      } else {
        Alert.alert('Reset Failed', 'Unable to reset your password. Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Error', 
        error.response?.data?.detail || 'An error occurred. Please check your token and try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your token and create a new password</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Reset Token</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#007E33" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your reset token"
                value={token}
                onChangeText={setToken}
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#007E33" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create new password"
                secureTextEntry={!isPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#007E33"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#007E33" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#007E33"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handlePasswordReset}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    marginTop: 30,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007E33',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  resetButton: {
    backgroundColor: '#007E33',
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#007E33',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgetPassword;