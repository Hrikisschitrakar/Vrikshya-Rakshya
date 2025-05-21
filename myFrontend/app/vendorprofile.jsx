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
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit2,
  ChevronRight,
  LogOut,
  Shield,
  Package,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import config from '../config';
const VendorProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Add navigation hook
  const { username } = route.params;

  const [vendor, setVendor] = useState({
    name: 'Green Thumb Nursery',
    ownerName: 'username',
    description: "whatever",
    profileImage: 'https://via.placeholder.com/150',
    coverImage: 'profileImage',
    address: '456 Garden Avenue, Portland, OR 97205',
    phone: '(503) 555-7890',
    email: 'contact@greenthumb.com',
    businessHours: 'Mon-Fri: 8AM-6PM, Sat-Sun: 9AM-5PM',
  });

  const [statistics, setStatistics] = useState({
    totalProducts: 10,
    totalOrders: 10,
    totalRevenue:10,
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    ownerName: vendor.full_name,
    business_name: vendor.name,
    address: vendor.address,
    description: vendor.description,
    phone_number: vendor.phone,
    email: vendor.email,
  });

  const [isProductsModalVisible, setIsProductsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.API_IP}/products/${username}`);
      setProducts(response.data); // Assuming the API returns a list of products
      setIsProductsModalVisible(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products.');
    }
  };

  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${config.API_IP}/orders/vendor-history/${username}`);
      setOrders(response.data); // Assuming the API returns a list of orders
      setIsOrdersModalVisible(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders.');
    }
  };

  const fetchProfileImage = async () => {
    // try {
    //   const response = await axios.get(`${config.API_IP}/profile/${username}`);
    //   const { image_url } = response.data;
    //   setVendor((prevVendor) => ({
    //     ...prevVendor,
    //     profileImage: `${config.API_IP}${image_url}`, // Update profile image
    //     coverImage: `${config.API_IP}${image_url}`,
    //   }));
    //   // Alert.alert('Success', 'Profile image updated successfully.');
    // } catch (error) {
    //   console.error('Error fetching profile image:', error);
    //   Alert.alert('Error', 'Failed to fetch profile image.');
    // }
    setVendor((prevVendor) => ({
      ...prevVendor,
      profileImage: "/Users/hrikisschitrakar/Desktop/Vrikshya-Rakshya/myFrontend/assets/images/10.png",
      coverImage: "/Users/hrikisschitrakar/Desktop/Vrikshya-Rakshya/myFrontend/assets/images/10.png",
    }));
  };

  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [imageForm, setImageForm] = useState({
    username: username,
    image_url: '',
  });

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('image', {
        uri: imageForm.image_url,
        type: 'image/jpeg', // Adjust the type based on the image format
        name: 'profile.jpg',
      });

      await axios.put(`${config.API_IP}/profile/${username}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVendor((prevVendor) => ({
        ...prevVendor,
        profileImage: imageForm.image_url,
      }));
      Alert.alert('Success', 'Profile image updated successfully.');
      setIsImageModalVisible(false);
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Error', 'Failed to update profile image.');
    }
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
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendorResponse = await axios.get(`${config.API_IP}/vendor/profile/${username}`);
        const vendorData = vendorResponse.data;
        setVendor((prevVendor) => ({
          ...prevVendor,
          name: vendorData.business_name || prevVendor.name,
          ownerName: vendorData.full_name || prevVendor.fullName,
          address: vendorData.address || prevVendor.address,
          phone: vendorData.phone_number || prevVendor.phone,
          email: vendorData.email || prevVendor.email,
          description: vendorData.description || prevVendor.description,
        }));
      } catch (error) {
        //console.error('Error fetching vendor data:', error);
      }
    };

    const fetchStatistics = async () => {
      try {
        const statsResponse = await axios.get(`${config.API_IP}/vendor/dashboard/${username}`);
        setStatistics({
          totalProducts: statsResponse.data.total_products,
          totalOrders: statsResponse.data.total_orders,
          totalRevenue: statsResponse.data.total_revenue,
        });
      } catch (error) {
       // console.error('Error fetching statistics:', error);
      }
    };

    fetchVendorData();
    fetchStatistics();
    fetchProfileImage();
  }, [username]);

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${config.API_IP}/vendor/profile/${username}`, editForm);
      //Alert.alert('Success', 'Profile updated successfully.');
      setVendor((prevVendor) => ({
        ...prevVendor,
        name: editForm.business_name,
        address: editForm.address,
        phone: editForm.phone_number,
        email: editForm.email,
      }));
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(`${config.API_IP}/users`, {
        data: {
          username: username,
          password: deletePassword,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile deleted successfully.');
        setIsDeleteModalVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'login' }],
        });
      } else {
        Alert.alert('Error', 'Failed to delete profile. Please try again.');
      }
    } catch (error) {
      //console.error('Error deleting profile:', error);
      Alert.alert('Error', 'Failed to delete profile. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }], // Redirect to the login page
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image source={{ uri: vendor.coverImage }} style={styles.coverImage} />
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: vendor.profileImage }} style={styles.profileImage} />
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.shopName}>{vendor.name}</Text>
            <Text style={styles.ownerName}>Owner: {vendor.ownerName}</Text>
            <Text style={styles.description}>{vendor.description}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setEditForm({
                  business_name: vendor.name,
                  address: vendor.address,
                  description: '',
                  phone_number: vendor.phone,
                  email: vendor.email,
                });
                setIsEditModalVisible(true);
              }}
            >
              <Edit2 color="#4CAF50" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <MapPin color="#4CAF50" size={20} />
            <Text style={styles.infoText}>{vendor.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone color="#4CAF50" size={20} />
            <Text style={styles.infoText}>{vendor.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <Mail color="#4CAF50" size={20} />
            <Text style={styles.infoText}>{vendor.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Clock color="#4CAF50" size={20} />
            <Text style={styles.infoText}>{vendor.businessHours}</Text>
          </View>
        </View>

        {/* Store Statistics */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Store Statistics</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Package color="#4CAF50" size={24} />
              <Text style={styles.statValue}>{statistics.totalProducts}</Text>
              <Text style={styles.statLabel}>Products</Text>
            </View>

            <View style={styles.statItem}>
              <TrendingUp color="#4CAF50" size={24} />
              <Text style={styles.statValue}>{statistics.totalOrders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>

            <View style={styles.statItem}>
              <Calendar color="#4CAF50" size={24} />
              <Text style={styles.statValue}>Rs. {statistics.totalRevenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
          </View>
        </View>

        {/* Manage Store and Logout */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Manage Store</Text>

          <TouchableOpacity style={styles.menuItem} onPress={fetchProducts}>
            <Package color="#4CAF50" size={20} />
            <Text style={styles.menuItemText}>My Products</Text>
            <ChevronRight color="#9E9E9E" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={fetchOrders}>
            <TrendingUp color="#4CAF50" size={20} />
            <Text style={styles.menuItemText}>Orders & Sales</Text>
            <ChevronRight color="#9E9E9E" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setIsDeleteModalVisible(true)}>
            <Shield color="#4CAF50" size={20} />
            <Text style={styles.menuItemText}>Delete Account</Text>
            <ChevronRight color="#9E9E9E" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut color="#D32F2F" size={20} />
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
              <Text style={styles.modalTitle}>Edit Contact Information</Text>
              <TextInput
                style={styles.input}
                placeholder="Business Name"
                value={editForm.business_name}
                onChangeText={(text) => setEditForm({ ...editForm, business_name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={editForm.address}
                onChangeText={(text) => setEditForm({ ...editForm, address: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={editForm.description}
                onChangeText={(text) => setEditForm({ ...editForm, description: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={editForm.phone_number}
                onChangeText={(text) => setEditForm({ ...editForm, phone_number: text })}
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

        {/* Products Modal */}
        <Modal
          visible={isProductsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsProductsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>My Products</Text>
              <ScrollView>
                {products.map((product, index) => (
                  <View key={index} style={styles.productItem}>
                    <Image
                      source={{ uri: `${config.API_IP}${product.image_url}` }}
                      style={styles.productImage}
                    />
                    <View style={styles.productDetails}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productDescription}>{product.description}</Text>
                      <Text style={styles.productPrice}>Price: ₹{product.price}</Text>
                      <Text style={styles.productStock}>Stock: {product.stock}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsProductsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
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
              <Text style={styles.modalTitle}>Orders & Sales</Text>
              <ScrollView>
                {orders.map((order, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Order ID:</Text> {order.order_id}
                    </Text>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Product:</Text> {order.product_name}
                    </Text>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Customer:</Text> {order.full_name}
                    </Text>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Quantity:</Text> {order.quantity}
                    </Text>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Total Price:</Text> ₹{order.total_price}
                    </Text>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Status:</Text> {order.order_status}
                    </Text>
                    <Text style={styles.orderDetail}>
                      <Text style={styles.orderLabel}>Date:</Text> {new Date(order.created_at).toLocaleString()}
                    </Text>
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
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={imageForm.username}
                editable={false}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handlePickImage}>
                <Text style={styles.saveButtonText}>Choose Image</Text>
              </TouchableOpacity>
              {imageForm.image_url ? (
                <Image
                  source={{ uri: imageForm.image_url }}
                  style={{ width: 100, height: 100, marginVertical: 10 }}
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

        {/* Delete Profile Modal */}
        <Modal
          visible={isDeleteModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsDeleteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delete Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                editable={false}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setDeletePassword(text)}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleDeleteProfile}
                >
                  <Text style={styles.saveButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F5F9F5',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 6,
    borderRadius: 15,
  },
  nameContainer: {
    flex: 1,
  },
  shopName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  ownerName: {
    fontSize: 16,
    color: '#424242',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: '#616161',
    marginLeft: 4,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 0,
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
    color: '#1B5E20',
    marginBottom: 16,
  },
  editButton: {
    padding: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#424242',
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
    color: '#1B5E20',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#616161',
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
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
    borderColor: '#FFCCBC',
    marginBottom: 32,
  },
  logoutText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FFCDD2',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#C8E6C9',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#388E3C',
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
  },
  productStock: {
    fontSize: 14,
    color: '#FF5722',
  },
  closeButton: {
    backgroundColor: '#FFCDD2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  orderItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  orderDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  orderLabel: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});

export default VendorProfileScreen;
