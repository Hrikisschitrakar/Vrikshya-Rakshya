import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import config from '../config'; // Adjust the import path as necessary
const ForgetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handlePasswordReset = async () => {
    if (!token || !newPassword) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    try {
      const response = await axios.post(`${config.API_IP}/reset-password`, {
        token,
        new_password: newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password has been reset successfully.');
      } else {
        Alert.alert('Error', 'Failed to reset password.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.detail || 'An error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Token</Text>
      <TextInput
        style={styles.input}
        placeholder="Token"
        value={token}
        onChangeText={setToken}
      />

      <Text style={styles.label}>Enter New Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!isPasswordVisible}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <Button title="Reset Password" onPress={handlePasswordReset} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
  },
  eyeIcon: {
    padding: 8,
  },
});

export default ForgetPassword;