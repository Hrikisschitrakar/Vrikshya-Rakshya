import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  ChevronRight,
  LogOut,
  Shield,
  ShoppingBag,
  Heart,
  Clock,
  CreditCard,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const CustomerProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Import and use route to access params
  const { username } = route.params; // Retrieve username from route params

  const [customer, setCustomer] = useState({
    name: 'John Doe',
    username: username, // Use username from previous page
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main Street, Seattle, WA 98101',
    profileImage: 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/500x180',
    memberSince: 'January 2023',
  });

  const [statistics, setStatistics] = useState({
    totalOrders: 24,
    savedItems: 15,
    reviewsGiven: 18,
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: customer.name,
    address: customer.address,
    phone: customer.phone,
    email: customer.email,
  });

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imageForm, setImageForm] = useState({
    username: customer.username,
    image_url: '',
  });

  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
  const [isWishlistModalVisible, setIsWishlistModalVisible] = useState(false);

  const [orderHistory, setOrderHistory] = useState([]); // State to store order history
  const [wishlistData, setWishlistData] = useState([]); // State to store wishlist data

  const fetchOrderHistory = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/orders/history/${username}`);
      if (response.ok) {
        const data = await response.json();
        setOrderHistory(Array.isArray(data) ? data : [data]); // Ensure data is an array
      } else {
        console.error('Failed to fetch order history');
      }
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/wishlist/${username}`);
      if (response.ok) {
        const data = await response.json();
        setWishlistData(Array.isArray(data) ? data : [data]); // Ensure data is an array
      } else {
        console.error('Failed to fetch wishlist');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  useEffect(() => {
    if (isOrdersModalVisible) {
      fetchOrderHistory();
    }
  }, [isOrdersModalVisible]);

  useEffect(() => {
    if (isWishlistModalVisible) {
      fetchWishlist();
    }
  }, [isWishlistModalVisible]);

  // Mock data
  const orders = [
    {
      order_id: 'ORD-12345',
      date: '2025-04-01',
      items: 3,
      total: 159.99,
      status: 'Delivered',
    },
    {
      order_id: 'ORD-12346',
      date: '2025-03-22',
      items: 1,
      total: 49.99,
      status: 'Processing',
    },
    {
      order_id: 'ORD-12347',
      date: '2025-03-15',
      items: 2,
      total: 78.50,
      status: 'Delivered',
    },
  ];

  const wishlist = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 39.99,
      image: 'https://via.placeholder.com/100',
      vendor: 'Green Thumb Nursery',
    },
    {
      id: 2,
      name: 'Terracotta Pot - Medium',
      price: 24.99,
      image: 'https://via.placeholder.com/100',
      vendor: 'Pottery Paradise',
    },
    {
      id: 3,
      name: 'Organic Plant Food',
      price: 12.99,
      image: 'https://via.placeholder.com/100',
      vendor: 'Garden Essentials',
    },
  ];

  const handleEditSubmit = () => {
    setCustomer({
      ...customer,
      name: editForm.name,
      address: editForm.address,
      phone: editForm.phone,
      email: editForm.email,
    });
    setIsEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully.');
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageForm({ ...imageForm, image_url: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const handleImageUpload = () => {
    if (imageForm.image_url) {
      setCustomer({
        ...customer,
        profileImage: imageForm.image_url,
      });
      setIsImageModalVisible(false);
      Alert.alert('Success', 'Profile image updated successfully.');
    } else {
      Alert.alert('Error', 'Please select an image first.');
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }],
    });
    // Refresh the app by reloading the JavaScript bundle
    Alert.alert('Logged Out', 'You have been logged out successfully.', [
      { text: 'OK', onPress: () => navigation.navigate('login') },
    ]);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/customer/dashboard/${username}`);
        if (response.ok) {
          const data = await response.json();
          setStatistics({
            totalOrders: data.total_orders,
            savedItems: data.wishlist_count,
            reviewsGiven: data.total_spent, // Using total_spent as "Money Spent"
          });
          setCustomer((prev) => ({
            ...prev,
            name: data.customer_name,
          }));
        } else {
          console.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [username]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setCustomer((prev) => ({
            ...prev,
            profileImage: data.image_url, // Update profile image
            coverImage: data.image_url,  // Set cover image the same as profile image
          }));
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [username]);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/customer/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setCustomer((prev) => ({
            ...prev,
            name: data.full_name,
            email: data.email,
            phone: data.phone_number,
            address: data.home_address,
            memberSince: new Date(data.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            }),
          }));
        } else {
          console.error('Failed to fetch customer profile');
        }
      } catch (error) {
        console.error('Error fetching customer profile:', error);
      }
    };

    fetchCustomerProfile();
  }, [username]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: customer.coverImage }} style={styles.coverImage} />
          <TouchableOpacity style={styles.editCoverButton}>
            <Edit2 color="#1B5E20" size={16} />
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: customer.profileImage }} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setIsImageModalVisible(true)}
            >
              <Edit2 color="#1B5E20" size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{customer.name}</Text>
            <Text style={styles.username}>@{customer.username}</Text>
            <View style={styles.membershipContainer}>
              <Clock color="#1B5E20" size={14} />
              <Text style={styles.memberSince}>Member since {customer.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditForm({
                  name: customer.name,
                  address: customer.address,
                  phone: customer.phone,
                  email: customer.email,
                });
                setIsEditModalVisible(true);
              }}
            >
              <Edit2 color="#1B5E20" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <User color="#1B5E20" size={20} />
            <Text style={styles.infoText}>{customer.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin color="#1B5E20" size={20} />
            <Text style={styles.infoText}>{customer.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone color="#1B5E20" size={20} />
            <Text style={styles.infoText}>{customer.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Mail color="#1B5E20" size={20} />
            <Text style={styles.infoText}>{customer.email}</Text>
          </View>
        </View>

        {/* Activity Summary */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <ShoppingBag color="#1B5E20" size={24} />
              <Text style={styles.statValue}>{statistics.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>

            <View style={styles.statItem}>
              <Heart color="#1B5E20" size={24} />
              <Text style={styles.statValue}>{statistics.savedItems}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
            </View>

            <View style={styles.statItem}>
              <User color="#1B5E20" size={24} />
              <Text style={styles.statValue}>₹{statistics.reviewsGiven}</Text>
              <Text style={styles.statLabel}>Money Spent</Text>
            </View>
          </View>
        </View>

        {/* Account Management */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Management</Text>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => setIsOrdersModalVisible(true)}
          >
            <ShoppingBag color="#1B5E20" size={20} />
            <Text style={styles.menuItemText}>Order History</Text>
            <ChevronRight color="#1B5E20" size={20} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setIsWishlistModalVisible(true)}
          >
            <Heart color="#1B5E20" size={20} />
            <Text style={styles.menuItemText}>My Wishlist</Text>
            <ChevronRight color="#1B5E20" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <CreditCard color="#1B5E20" size={20} />
            <Text style={styles.menuItemText}>Payment Methods</Text>
            <ChevronRight color="#1B5E20" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Shield color="#1B5E20" size={20} />
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <ChevronRight color="#1B5E20" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#1B5E20" size={20} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Edit Modal */}
        <Modal
          visible={isEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Personal Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={editForm.name}
                onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={editForm.address}
                onChangeText={(text) => setEditForm({ ...editForm, address: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={editForm.phone}
                onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={editForm.email}
                onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleEditSubmit}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Image Modal */}
        <Modal
          visible={isImageModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsImageModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Update Profile Image</Text>
              <TouchableOpacity style={styles.saveButton} onPress={handlePickImage}>
                <Text style={styles.saveButtonText}>Choose Image</Text>
              </TouchableOpacity>
              {imageForm.image_url ? (
                <Image
                  source={{ uri: imageForm.image_url }}
                  style={{ width: 100, height: 100, marginVertical: 10, alignSelf: 'center' }}
                />
              ) : null}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsImageModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleImageUpload}>
                  <Text style={styles.saveButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Orders Modal */}
        <Modal
          visible={isOrdersModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsOrdersModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Order History</Text>
              <ScrollView>
                {orderHistory.map((order, index) => (
                  <View key={index} style={styles.orderItem}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>Order ID: {order.id}</Text>
                      <Text style={[
                        styles.orderStatus,
                        { color: order.order_status === 'delivered' ? '#10B981' : '#F59E0B' }
                      ]}>
                        {order.order_status}
                      </Text>
                    </View>
                    <View style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Product:</Text>
                      <Text style={styles.orderValue}>{order.product_name}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Quantity:</Text>
                      <Text style={styles.orderValue}>{order.quantity}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Total Price:</Text>
                      <Text style={styles.orderValue}>₹{order.total_price}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Address:</Text>
                      <Text style={styles.orderValue}>{order.address}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Date:</Text>
                      <Text style={styles.orderValue}>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsOrdersModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Wishlist Modal */}
        <Modal
          visible={isWishlistModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsWishlistModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>My Wishlist</Text>
              <ScrollView>
                {wishlistData.map((item, index) => (
                  <View key={index} style={styles.wishlistItem}>
                    <Image
                      source={{ uri: `http://127.0.0.1:8000${item.product_image_url}` }}
                      style={styles.wishlistItemImage} // Add image styling
                    />
                    <View style={styles.wishlistItemDetails}>
                      <Text style={styles.wishlistItemName}>{item.product_name}</Text>
                      <Text style={styles.wishlistItemDescription}>{item.product_description}</Text>
                      <Text style={styles.wishlistItemPrice}>₹{item.product_price}</Text>
                      <Text style={styles.wishlistItemStock}>
                        {item.product_stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsWishlistModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  coverContainer: {
    height: 180,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 8,
    borderRadius: 20,
    color: '#1B5E20',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editProfileButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 6,
    borderRadius: 15,
    color: '#1B5E20'
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20', // Dark green
  },
  username: {
    fontSize: 16,
    color: '#4B8B3B', // Lighter green
    marginTop: 2,
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#4B8B3B', // Lighter green
    marginLeft: 4,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20', // Dark green
    marginBottom: 16,
    
  },
  editButton: {
    padding: 4,
    color: '#1B5E20'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#4B8B3B', // Lighter green
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20', // Dark green
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#4B8B3B', // Lighter green
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#4B8B3B', // Lighter green
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 32,
  },
  logoutText: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1B5E20', // Dark green
  },
  saveButton: {
    backgroundColor: '#A5D6A7', // Light green
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#1B5E20', // Dark green
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#A5D6A7', // Light green
    borderRadius: 4,
  },
  viewDetailsText: {
    color: '#1B5E20', // Dark green
    fontWeight: '500',
    fontSize: 12,
  },
  wishlistItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B5E20', // Dark green
    marginTop: 4,
  },
  addToCartButton: {
    backgroundColor: '#1B5E20', // Dark green
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  wishlistItem: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  wishlistItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  wishlistItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  wishlistItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  wishlistItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 4,
  },
  wishlistItemStock: {
    fontSize: 12,
    color: '#4B8B3B',
    marginTop: 4,
  },
});

export default CustomerProfileScreen;