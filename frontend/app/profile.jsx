import { StyleSheet, Text, View, Pressable, ScrollView, Image, Switch } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const Profile = () => {
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const togglePushSwitch = () => setIsPushEnabled(previousState => !previousState);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>User's Name</Text>
            <Text style={styles.userEmail}>user@email.com</Text>
          </View>
        </View>
        <Pressable>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>My Saved Remedies</Text>
      </Pressable>
      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Address Book</Text>
      </Pressable>
      <Pressable style={[styles.primaryButton, styles.blackButton]}>
        <Text style={styles.blackButtonText}>My Orders</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Account Options</Text>
      <View style={styles.listItem}>
        <Icon name="cart" size={24} color="gray" />
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>My Orders</Text>
          <Text style={styles.listItemSubtitle}>View previous purchases or orders</Text>
        </View>
      </View>
      <View style={styles.listItem}>
        <Icon name="star" size={24} color="gold" />
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>My Saved Remedies</Text>
          <Text style={styles.listItemSubtitle}>Access bookmarked remedies for plant diseases</Text>
        </View>
      </View>
      <View style={styles.listItem}>
        <Icon name="home" size={24} color="gray" />
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>Address Book</Text>
          <Text style={styles.listItemSubtitle}>Manage delivery addresses</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.preferenceContainer}>
        <Text>Enable Push Notifications</Text>
        <Switch value={isPushEnabled} onValueChange={togglePushSwitch} />
      </View>
      <Pressable style={styles.preferenceButton}>
        <Text>Language Preference</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Support</Text>
      <View style={styles.listItem}>
        <Icon name="call" size={24} color="gray" />
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>Contact Support</Text>
          <Text style={styles.listItemSubtitle}>Need assistance?</Text>
        </View>
      </View>
      <View style={styles.listItem}>
        <Icon name="help-circle" size={24} color="red" />
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>FAQs</Text>
        </View>
      </View>

      <Pressable style={[styles.primaryButton, styles.blackButton]}>
        <Text style={styles.blackButtonText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: 'gray',
  },
  editText: {
    color: '#397454',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontWeight: 'bold',
  },
  blackButton: {
    backgroundColor: '#000',
  },
  blackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listItemText: {
    marginLeft: 10,
  },
  listItemTitle: {
    fontWeight: 'bold',
  },
  listItemSubtitle: {
    color: 'gray',
    fontSize: 12,
  },
  preferenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  preferenceButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
