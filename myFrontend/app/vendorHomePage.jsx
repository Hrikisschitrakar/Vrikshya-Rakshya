import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Dimensions,
  ActivityIndicator,
  Modal, 
  TextInput, 
  Button, 
  Alert 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute for route params
import axios from 'axios'; // Import axios
import { ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import config from '../config';
// Mock data - replace with your actual API calls
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4800 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

const VendorHomePage = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Access route params
  const { username } = route.params; // Get username from login.jsx
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, total_products: 0 });
  const screenWidth = Dimensions.get('window').width - 32;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    file: null,
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState('');
  const [isRestockModalVisible, setIsRestockModalVisible] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]); // State to store recent orders
  const [isOrdersModalVisible, setIsOrdersModalVisible] = useState(false); // State for orders modal
  const [priceToUpdate, setPriceToUpdate] = useState(''); // State for price to update
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [productIdToUpdate, setProductIdToUpdate] = useState('');
  const [newPrice, setNewPrice] = useState('');
  useEffect(() => {
    fetchVendorProducts();
    fetchVendorStats(); // Fetch stats from the new endpoint
    fetchRecentOrders(); // Fetch recent orders
  }, []);

  const fetchVendorProducts = async () => {
    try {
      const response = await axios.get(`${config.API_IP}/products/${username}`);
      setProducts(response.data); // Assuming the API returns a list of products
    } catch (error) {
      console.error('Error fetching vendor products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from the FastAPI backend
  const fetchVendorStats = async () => {
    try {
      const response = await axios.get(`${config.API_IP}/vendor/dashboard/${username}`);
      setStats(response.data); // Update stats state with API response
    } catch (error) {
      //console.error('Error fetching vendor stats:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(`${config.API_IP}/orders/vendor-history/${username}`);
      setRecentOrders(response.data); // Update recent orders state with API response
    } catch (error) {
      console.error('Error fetching recent orders:', error.response?.data || error.message);
    }
  };

  // Function to handle product addition
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.file) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', newProduct.name); // Matches 'name' in the backend
    formData.append('description', newProduct.description || ''); // Matches 'description' in the backend
    formData.append('price', newProduct.price); // Matches 'price' in the backend
    formData.append('stock', newProduct.stock); // Matches 'stock' in the backend
    formData.append('file', {
      uri: newProduct.file.uri,
      type: newProduct.file.type || 'image/jpeg', // Ensure the type is correct
      name: newProduct.file.fileName || 'uploaded_image.jpg', // Ensure the name is provided
    });
  
    try {
      await axios.post(`${config.API_IP}/products/${username}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Success', 'Product added successfully.');
      setIsModalVisible(false);
      fetchVendorProducts(); // Refresh product list
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to add product.');
    }
  };

  // Function to handle product deletion
  const handleDeleteProduct = async () => {
    if (!productIdToDelete) {
      Alert.alert('Error', 'Please enter a valid product ID.');
      return;
    }
  
    try {
      await axios.delete(`${config.API_IP}/products/${username}/${productIdToDelete}`);
      Alert.alert('Success', 'Product deleted successfully.');
      setIsDeleteModalVisible(false);
      fetchVendorProducts(); // Refresh product list
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete product.');
    }
  };

 

  const handleRestock = async () => {
    if (!restockQuantity || isNaN(restockQuantity) || restockQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity.');
      return;
    }
  
    if (!selectedProduct || !selectedProduct.id) {
      Alert.alert('Error', 'Missing product information.');
      return;
    }
  
    const payload = {
      product_id: selectedProduct.id,
      quantity: parseInt(restockQuantity),
    };
  
    try {
      // Use query parameters in the axios request
      const response = await axios.post(
        `${config.API_IP}/restock?product_id=${payload.product_id}&quantity=${payload.quantity}`
      );
  
      Alert.alert('Success', 'Product restocked successfully.');
      setIsRestockModalVisible(false);
      fetchVendorProducts(); // Refresh product list
    } catch (error) {
      console.error('Error restocking product:', payload);
      console.error('Error restocking product:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to restock product: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Function to handle price update
  // const handleUpdatePrice = async () => {
  //   if (!productIdToUpdate || isNaN(productIdToUpdate)) {
  //     Alert.alert('Error', 'Please enter a valid product ID.');
  //     return;
  //   }
  
  //   if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
  //     Alert.alert('Error', 'Please enter a valid price.');
  //     return;
  //   }
  
  //   const payload = {
  //     product_id: parseInt(productIdToUpdate),
  //     price: parseInt(newPrice),
  //   };
  
  //   try {
  //     const response = await axios.post(
  //       `http://127.0.0.1:8000/price?product_id=${payload.product_id}&quantity=${payload.price}`
  //     );
  //     Alert.alert('Success', 'Price updated successfully.');
  //     setIsPriceModalVisible(false);
  //     fetchVendorProducts(); // Refresh product list
  //   } catch (error) {
  //     console.error('Error updating price:', payload);
  //     console.error('Error updating price:', error.response?.data || error.message);
  //     Alert.alert('Error', `Failed to update price: ${error.response?.data?.detail || error.message}`);
  //   }
  // };

  const handleUpdatePrice = async () => {
    if (!productIdToUpdate || isNaN(productIdToUpdate)) {
      Alert.alert('Error', 'Please enter a valid product ID.');
      return;
    }
  
    if (!newPrice || isNaN(newPrice) || newPrice <= 0) {
      Alert.alert('Error', 'Please enter a valid price.');
      return;
    }
  
    const payload = {
      product_id: parseInt(productIdToUpdate),
      price: parseInt(newPrice),
    };
  
    try {
      const response = await axios.post(
        `${config.API_IP}/price?product_id=${payload.product_id}&price=${payload.price}`
      );
      
      Alert.alert('Success', 'Price updated successfully.');
      setIsPriceModalVisible(false);
      fetchVendorProducts(); // Refresh product list
    } catch (error) {
      console.error('Error updating price:', error.response?.data || error.message);
      Alert.alert('Error', `Failed to update price: ${error.response?.data?.detail || error.message}`);
    }
  };
  
  
  
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
  };
  
  // Format data for the chart
  const chartData = {
    labels: salesData.map(item => item.month),
    datasets: [
      {
        data: salesData.map(item => item.sales),
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Monthly Sales']
  };
  
  const renderDashboard = () => (
    <ScrollView style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <View>
          <Text style={styles.welcomeText}>Welcome back, {username}!</Text>
          <Text style={styles.subText}>Here&apos;s what&apos;s happening with your store today</Text>
        </View>
        {/* <View style={styles.badgeContainer}>
          <Text style={styles.badge}>12 New Orders</Text>
        </View> */}
      </View>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>Rs.{stats.total_revenue}</Text>
          <Text style={styles.statLabel}>Today&apos;s Sales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total_orders}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total_products}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
      </View>
      
      {/* Sales Chart */}
      {/* <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Monthly Sales</Text>
        <LineChart
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View> */}
      
      {/* Recent Orders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => setIsOrdersModalVisible(true)}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentOrders.slice(0, 5).map((order, index) => ( // Show only top 5 orders
          <View key={index} style={[styles.orderCard, index === recentOrders.length - 1 ? null : styles.orderCardBorder]}>
            <View style={styles.orderMain}>
              <View>
                <Text style={styles.orderId}>Product: {order.product_name}</Text>
                <Text style={styles.orderCustomer}>Customer: {order.full_name}</Text>
                <Text style={styles.orderAddress}>Address: {order.vendor_address}</Text>
                <Text style={styles.orderQuantity}>Quantity: {order.quantity}</Text>
                <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
              </View>
              <View>
                
                <Text style={styles.orderStatus}>Status: {order.order_status}</Text>
                
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Orders Modal */}
      <Modal
        visible={isOrdersModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOrdersModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOrdersModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Orders</Text>
            <ScrollView>
              {recentOrders.map((order, index) => (
                <View key={index} style={[styles.orderCard, index === recentOrders.length - 1 ? null : styles.orderCardBorder]}>
                  <View style={styles.orderMain}>
                    <View>
                      <Text style={styles.orderId}>Product: {order.product_name}</Text>
                      <Text style={styles.orderProduct}>Order ID: {order.order_id}</Text>
                      <Text style={styles.orderCustomer}>Customer: {order.full_name}</Text>
                      <Text style={styles.orderAddress}>Address: {order.vendor_address}</Text>
                      <Text style={styles.orderQuantity}>Quantity: {order.quantity}</Text>
                      <Text style={styles.orderQuantity}>Amount: Rs.{order.total_price}</Text>

                    </View>
                    <View>
                      
                      <Text style={styles.orderStatus}>Status: {order.order_status}</Text>
                      <Text style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
                    </View>
                  </View>

                  {/* Deliver Order Button */}
                  <TouchableOpacity
                    style={styles.deliverButton}
                    onPress={async () => {
                      try {
                        await axios.put(`${config.API_IP}/orders/update-status/${order.order_id}?status=Delivered`);
                        Alert.alert('Success', 'Order status updated to Delivered.');
                        fetchRecentOrders(); // Refresh orders list
                      } catch (error) {
                        console.error('Error updating order status:', error.response?.data || error.message);
                        Alert.alert('Error', 'Failed to update order status.');
                      }
                    }}
                  >
                    <Text style={styles.deliverButtonText}>Deliver Order</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setIsOrdersModalVisible(false)} />
          </View>
        </View>
      </Modal>
      
      {/* Low Stock Alerts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Low Stock Alerts</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Manage Inventory</Text>
          </TouchableOpacity>
        </View>
        
        {products
          .filter(product => product.stock < 10) // Filter products with stock less than 5
          .map((product, index) => (
            <View key={index} style={[styles.stockCard, index === products.length - 1 ? null : styles.stockCardBorder]}>
              <View>
                <Text style={styles.stockName}>{product.name}</Text>
                <Text style={styles.stockCategory}>{product.description}</Text>
              </View>
              <View style={styles.stockCountContainer}>
                <Text style={styles.stockCount}>{product.stock}</Text>
                <TouchableOpacity
                  style={styles.restockButton}
                  onPress={() => {
                    setSelectedProduct(product);
                    setIsRestockModalVisible(true);
                  }}
                >
                  <Text style={styles.restockText}>Restock</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
      
      {/* Vendor Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Products</Text>
          {/* <TouchableOpacity>
            <Text style={styles.viewAllText}>Manage Products</Text>
          </TouchableOpacity> */}
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : (
          products.map((product, index) => (
            <View key={index} style={[styles.productCard, index === products.length - 1 ? null : styles.productCardBorder]}>
              <Image 
                source={{ uri: `${config.API_IP}${product.image_url}` || 'https://via.placeholder.com/50' }}
                // Corrected 'url' to 'uri'
                style={styles.productImage} 
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>id: {product.id}</Text>
                <Text style={styles.productPrice}>Rs. {product.price}</Text>
                <Text style={styles.productPrice}>{product.description}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Add Product Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Product</Text>
            <TextInput
              style={styles.input}
              placeholder="Name *"
              value={newProduct.name}
              onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newProduct.description}
              onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price *"
              keyboardType="numeric"
              value={newProduct.price}
              onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Stock *"
              keyboardType="numeric"
              value={newProduct.stock}
              onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
            />
            <TouchableOpacity
              style={styles.fileButton}
              onPress={async () => {
                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permissionResult.granted) {
                  Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
                  return;
                }
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 1,
                });
                if (!result.canceled) {
                  setNewProduct({ ...newProduct, file: result.assets[0] });
                }
              }}
            >
              <Text style={styles.fileButtonText}>
                {newProduct.file ? newProduct.file.fileName || 'Image Selected' : 'Upload Image *'}
              </Text>
            </TouchableOpacity>
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
              <Button title="Add Product" onPress={handleAddProduct} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Product Modal */}
      <Modal
        visible={isDeleteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Product</Text>
            <Text style={styles.disclaimerText}>
              Insert the product ID of the product you want to delete. 
              Disclaimer: Once you delete the product, you cannot undo it.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Product ID"
              keyboardType="numeric"
              value={productIdToDelete}
              onChangeText={(text) => setProductIdToDelete(text)}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsDeleteModalVisible(false)} />
              <Button title="Delete" onPress={handleDeleteProduct} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Restock Modal */}
      <Modal
        visible={isRestockModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRestockModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Restock Product</Text>
            <Text style={styles.modalTitle}>Product id: {selectedProduct?.id}</Text>
            <Text style={styles.modalDescription}>
              Enter the quantity to restock for &quot;{selectedProduct?.name}&quot;.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={restockQuantity}
              onChangeText={setRestockQuantity}
            />
            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsRestockModalVisible(false)} />
              <Button title="Restock" onPress={handleRestock} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Price Update Modal */}
      <Modal
        visible={isPriceModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPriceModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Product Price</Text>

            <TextInput
              style={styles.input}
              placeholder="Product ID"
              keyboardType="numeric"
              value={productIdToUpdate}
              onChangeText={setProductIdToUpdate}
            />

            <TextInput
              style={styles.input}
              placeholder="New Price"
              keyboardType="numeric"
              value={newPrice}
              onChangeText={setNewPrice}
            />

            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsPriceModalVisible(false)} />
              <Button title="Update Price" onPress={handleUpdatePrice} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsModalVisible(true)}>
            <View style={[styles.actionIcon, styles.greenAction]}>
              <Text style={styles.actionIconText}>+</Text>
            </View>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsPriceModalVisible(true)}
          >
            <View style={[styles.actionIcon, styles.orangeAction]}>
              <Text style={styles.actionIconText}>Rs</Text> {/* Changed icon from $ to Rs */}
            </View>
            <Text style={styles.actionText}>Update Prices</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsDeleteModalVisible(true)}>
            <View style={[styles.actionIcon, styles.redAction]}>
              <Text style={styles.actionIconText}>🗑️</Text>
            </View>
            <Text style={styles.actionText}>Delete Product</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Spacer for bottom tabs */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/40' }} 
          style={styles.logo} 
        />
        <Text style={styles.headerTitle}>Vrikshya Rakshya</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>📋</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      {renderDashboard()}
      
      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { marginBottom: 16 }]}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'home' ? styles.activeNavItem : null]} 
          onPress={() => setActiveTab('home')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, activeTab === 'home' ? styles.activeNavText : null]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'alerts' ? styles.activeNavItem : null]} 
          onPress={() => {
            setActiveTab('alerts');
            navigation.navigate('notificationCenter', { username }); // Pass username to notificationCenter
          }}
        >
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={[styles.navText, activeTab === 'alerts' ? styles.activeNavText : null]}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' ? styles.activeNavItem : null]} 
          onPress={() => {
            setActiveTab('profile');
            navigation.navigate('vendorprofile', { username }); // Pass username to vendorprofile
          }}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, activeTab === 'profile' ? styles.activeNavText : null]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2e7d32',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButtonText: {
    fontSize: 18,
  },
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subText: {
    fontSize: 14,
    color: '#e8f5e9',
    marginTop: 4,
  },
  badgeContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badge: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    width: '31%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  viewAllText: {
    fontSize: 12,
    color: '#4caf50',
  },
  orderCard: {
    marginTop: 24,   // adds space above each order card
    marginBottom: 8,
    marginVertical: 8,        // increased vertical margin for spacing
    paddingVertical: 16,      // doubled padding for bigger box
    paddingHorizontal: 12,    // added horizontal padding for width comfort
    minHeight: 80,            // ensures minimum height for consistent sizing
    borderRadius: 8,          // optional: add some rounding to soften the box edges
    backgroundColor: '#fafafa', // optional: subtle background color for emphasis
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  orderCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  orderProduct: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  orderAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
    textAlign: 'right',
  },
  orderStatus: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  statusProcessing: {
    color: '#ff9800',
  },
  statusShipped: {
    color: '#2196f3',
  },
  statusDelivered: {
    color: '#4caf50',
  },
  stockCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stockCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stockName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
  },
  stockCategory: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  stockCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
    marginRight: 12,
  },
  restockButton: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  restockText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 12,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActions: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  greenAction: {
    backgroundColor: '#e8f5e9',
  },
  orangeAction: {
    backgroundColor: '#fff3e0',
  },
  blueAction: {
    backgroundColor: '#e3f2fd',
  },
  redAction: {
    backgroundColor: '#ffebee', // Light red background for delete action
  },
  actionIconText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  productCardBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
  },
  productCategory: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 5, // Additional padding for devices with home indicator
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666666',
  },
  activeNavText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 70,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start', // Align modal to start
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 50, // Add padding to bring it lower
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative', // Ensure the close button is positioned relative to this container
    paddingTop: 40, // Add padding to avoid overlap with the close button
  },
  closeButton: {
    position: 'absolute',
    top: 30, // Adjusted to ensure visibilityts
    right: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    padding: 5,
    elevation: 3,
    zIndex: 10, // Ensure the button appears above other elements
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  fileButton: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  fileButtonText: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  disclaimerText: {
    fontSize: 14,
    color: '#ff0000',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
    textAlign: 'center',
  },
  deliverButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deliverButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default VendorHomePage;
