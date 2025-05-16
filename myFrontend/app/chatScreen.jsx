import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

// Sample data for demonstration
const INITIAL_MESSAGES = [
  {
    id: '1',
    text: 'Hello! How can I help with your tree conservation efforts today?',
    sender: 'system',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    text: 'I found a tree that needs attention in my neighborhood.',
    sender: 'user',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '3',
    text: 'Great! Could you share the location and a photo of the tree?',
    sender: 'system',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate receiving a reply (in a real app, this would come from your backend)
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message. Our conservation team will review it shortly.',
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessageItem = ({ item, index }) => {
    const showDateHeader = index === 0 || 
      formatDate(messages[index-1].timestamp) !== formatDate(item.timestamp);
    
    return (
      <>
        {showDateHeader && (
          <View style={styles.dateHeaderContainer}>
            <Text style={styles.dateHeaderText}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          item.sender === 'user' ? styles.userMessageContainer : styles.systemMessageContainer
        ]}>
          {item.sender === 'system' && (
            <Image 
              source={require('/Users/hrikisschitrakar/Desktop/Vrikshya-Rakshya/myFrontend/assets/images/logo.png')} // Add your app logo
              style={styles.avatarImage}
              defaultSource={require('/Users/hrikisschitrakar/Desktop/Vrikshya-Rakshya/myFrontend/assets/images/logo.png')}
            />
          )}
          <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.systemBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'user' ? styles.userMessageText : styles.systemMessageText
            ]}>
              {item.text}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f7" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#075e54" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vrikshya Support</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
        
        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={24} color="#075e54" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            multiline
          />
          
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={inputText.trim() === ''}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() === '' ? "#cccccc" : "#fff"} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#075e54',
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  dateHeaderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateHeaderText: {
    backgroundColor: '#e0e0e0',
    color: '#555',
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  systemMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 15,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    borderTopRightRadius: 5,
    marginLeft: 'auto',
  },
  systemBubble: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#000000',
  },
  systemMessageText: {
    color: '#000000',
  },
  timeText: {
    fontSize: 10,
    color: '#7f8c8d',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#075e54',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default ChatScreen;