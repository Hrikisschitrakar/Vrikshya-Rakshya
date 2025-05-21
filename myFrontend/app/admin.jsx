import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import config from '../config';
// Demo Avatar Images (You would replace these with actual user images)
const getInitialsAvatar = (name) => {
  return name.split(' ').map(part => part[0]).join('').toUpperCase();
};

// Main App Component
export default function AdminDashboard() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // Sample data
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', joinDate: '2025-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2025-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', status: 'Inactive', joinDate: '2025-03-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'User', status: 'Active', joinDate: '2025-04-05' },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, userId: 1, userName: 'John Doe', title: 'Getting Started with React Native', content: 'React Native makes it painless to create truly native mobile apps...', date: '2025-04-10', likes: 24, comments: 8 },
    { id: 2, userId: 2, userName: 'Jane Smith', title: 'Mobile UI Design Tips', content: 'Creating intuitive mobile interfaces requires...', date: '2025-04-12', likes: 42, comments: 15 },
    { id: 3, userId: 3, userName: 'Mike Johnson', title: 'Modern JavaScript Features', content: 'ES6 introduced many powerful features...', date: '2025-04-15', likes: 18, comments: 6 },
    { id: 4, userId: 1, userName: 'John Doe', title: 'Responsive Design for Mobile', content: 'Building responsive mobile apps requires...', date: '2025-04-18', likes: 33, comments: 11 },
  ]);

  const [warnings, setWarnings] = useState([
    { id: 1, userId: 3, userName: 'Mike Johnson', message: 'Inappropriate content in posts', date: '2025-04-08', status: 'Pending' },
    { id: 2, userId: 2, userName: 'Jane Smith', message: 'Multiple reports from other users', date: '2025-04-14', status: 'Sent' },
  ]);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const response = await axios.get(`${config.API_IP}/users/role`);
        const fetchedUsers = response.data.map(user => ({
          id: user.id,
          username: user.username,
          name: user.full_name,
          email: user.email,
          role: user.role,
          status: user.is_verified ? 'Active' : 'Inactive',
          joinDate: new Date().toISOString().split('T')[0], // Placeholder join date
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Event handlers
  const handleDeleteUser = async (userId) => {
    try {
      const userToDelete = users.find(user => user.id === userId);
      if (!userToDelete || !userToDelete.username) {
        console.error('Username is undefined or user not found');
        return;
      }
      await axios.delete(`${config.API_IP}/users/${userToDelete.username}`);
      setUsers(users.filter(user => user.id !== userId));
      setPosts(posts.filter(post => post.userId !== userId));
      setWarnings(warnings.filter(warning => warning.userId !== userId));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
    setShowModal(false);
  };

  const handleSendWarning = () => {
    if (selectedItem && warningMessage) {
      const newWarning = {
        id: warnings.length + 1,
        userId: selectedItem.id,
        userName: selectedItem.name,
        message: warningMessage,
        date: new Date().toISOString().split('T')[0],
        status: 'Sent'
      };
      setWarnings([...warnings, newWarning]);
      setWarningMessage('');
      setShowModal(false);
    }
  };

  const openModal = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }], // Redirect to the login page
    });
  };

  // Tab Bar Component
  const TabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'users' && styles.activeTab]} 
        onPress={() => setActiveTab('users')}
      >
        <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
        onPress={() => setActiveTab('posts')}
      >
        <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Products</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'warnings' && styles.activeTab]} 
        onPress={() => setActiveTab('warnings')}
      >
        <Text style={[styles.tabText, activeTab === 'warnings' && styles.activeTabText]}>Warnings</Text>
      </TouchableOpacity>
    </View>
  );

  // User List Item Component
  const UserItem = ({ user }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitialsAvatar(user.name)}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userUsername}>@{user.username}</Text> {/* Display username */}
          <View style={styles.userMeta}>
            <Text style={[
              styles.statusBadge,
              user.status === 'Active' ? styles.activeStatus : styles.inactiveStatus
            ]}>
              {user.status}
            </Text>
            <Text style={styles.userRole}>{user.role}</Text>
          </View>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.warningButton]} 
          onPress={() => openModal('warning', user)}
        >
          <Text style={styles.actionButtonText}>⚠️</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={() => openModal('deleteUser', user)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Post Item Component
  const PostItem = ({ post }) => (
    <View style={styles.postItem}>
      <View style={styles.postHeader}>
        <View>
          <Text style={styles.postTitle}>{post.title}</Text>
          <Text style={styles.postMeta}>By {post.userName} • {post.date}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deletePostButton} 
          onPress={() => openModal('deletePost', post)}
        >
          <Text style={styles.deletePostText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postStats}>
        <Text style={styles.postStatItem}>💬 {post.comments}</Text>
        <Text style={styles.postStatItem}>👍 {post.likes}</Text>
      </View>
    </View>
  );

  // Warning Item Component
  const WarningItem = ({ warning }) => (
    <View style={styles.warningItem}>
      <View style={styles.warningHeader}>
        <Text style={styles.warningUser}>{warning.userName}</Text>
        <Text style={[
          styles.warningStatus,
          warning.status === 'Sent' ? styles.sentStatus : styles.pendingStatus
        ]}>
          {warning.status}
        </Text>
      </View>
      <Text style={styles.warningMessage}>{warning.message}</Text>
      <Text style={styles.warningDate}>{warning.date}</Text>
    </View>
  );

  // Modal Component
  const ModalComponent = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {modalType === 'deleteUser' && 'Delete User'}
            {modalType === 'deletePost' && 'Delete Post'}
            {modalType === 'warning' && 'Send Warning'}
          </Text>
          
          {modalType === 'deleteUser' && (
            <>
              <Text style={styles.modalText}>
                Are you sure you want to delete user &quot;{selectedItem?.name}&quot;?
                This action cannot be undone.
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]} 
                  onPress={() => handleDeleteUser(selectedItem?.id)}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {modalType === 'deletePost' && (
            <>
              <Text style={styles.modalText}>
                Are you sure you want to delete post &quot;{selectedItem?.title}&quot;?
                This action cannot be undone.
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton]} 
                  onPress={() => handleDeletePost(selectedItem?.id)}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {modalType === 'warning' && (
            <>
              <Text style={styles.modalText}>
                Send a warning message to user &quot;{selectedItem?.name}&quot;.
              </Text>
              <TextInput
                style={styles.warningInput}
                placeholder="Enter warning message..."
                multiline={true}
                numberOfLines={4}
                value={warningMessage}
                onChangeText={setWarningMessage}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => {
                    setWarningMessage('');
                    setShowModal(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.warningActionButton]} 
                  onPress={handleSendWarning}
                >
                  <Text style={styles.confirmButtonText}>Send Warning</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075e54" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tab Bar */}
      <TabBar />

      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === 'users' && (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <UserItem user={item} />}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {activeTab === 'products' && (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <PostItem post={item} />}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {activeTab === 'warnings' && (
          <FlatList
            data={warnings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <WarningItem warning={item} />}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
      
      {/* Modal */}
      <ModalComponent />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2e7d32', // Dark green
    padding: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  searchContainer: {
    backgroundColor: '#4caf50', // Lighter green
    borderRadius: 8,
    padding: 4,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2e7d32', // Dark green
  },
  tabText: {
    fontWeight: '500',
    color: '#757575',
  },
  activeTabText: {
    color: '#2e7d32', // Dark green
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
  },
  userItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a5d6a7', // Light green
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2e7d32', // Dark green
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212121',
  },
  userEmail: {
    color: '#757575',
    fontSize: 14,
    marginBottom: 4,
  },
  userUsername: {
    color: '#42a5f5',
    fontSize: 14,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
    overflow: 'hidden',
    marginRight: 8,
  },
  activeStatus: {
    backgroundColor: '#c8e6c9', // Very light green
    color: '#2e7d32', // Dark green
  },
  inactiveStatus: {
    backgroundColor: '#ffcdd2',
    color: '#d32f2f',
  },
  userRole: {
    color: '#757575',
    fontSize: 12,
  },
  userActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  warningButton: {
    backgroundColor: '#ffe082',
  },
  deleteButton: {
    backgroundColor: '#ffcdd2',
  },
  actionButtonText: {
    fontSize: 16,
  },
  postItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  postMeta: {
    color: '#757575',
    fontSize: 12,
  },
  deletePostButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffcdd2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePostText: {
    fontSize: 16,
  },
  postContent: {
    color: '#424242',
    fontSize: 14,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
  },
  postStatItem: {
    marginRight: 16,
    color: '#757575',
  },
  warningItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
  },
  warningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  warningUser: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#212121',
  },
  warningStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
  },
  sentStatus: {
    backgroundColor: '#c8e6c9', // Very light green
    color: '#2e7d32', // Dark green
  },
  pendingStatus: {
    backgroundColor: '#fff9c4',
    color: '#f57f17',
  },
  warningMessage: {
    color: '#424242',
    fontSize: 14,
    marginBottom: 8,
  },
  warningDate: {
    color: '#757575',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 16,
  },
  warningInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    height: 100,
    backgroundColor: '#f5f5f5',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#424242',
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#f44336',
  },
  warningActionButton: {
    backgroundColor: '#ff9800',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#f44336', // Red
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});