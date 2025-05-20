import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import config from '../config';
const CustomerLandingPage = () => {
  const router = useRouter();
  const route = useRoute();// Access route params
  const { username } = route.params; 
  const navigation = useNavigation(); // Use useNavigation hook
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      // Fetch product data with an empty string or default value initially
      fetchProducts('');
    })();
  }, []);

  const fetchProducts = async (query) => {
    try {
      // Encode the query and replace '+' with '%20'
      const encodedQuery = encodeURIComponent(query).replace(/\+/g, '%20');
      const response = await axios.get(`${config.API_IP}/products_by_name/{search}`, {
        params: { search_term: encodedQuery },
      });
      const productsData = response.data.map(product => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        vendorLocation: product.vendor_address,
        image: `${config.API_IP}${product.image_url}`,
        vendor: product.vendor_name,
        stock: product.stock, // Include stock information
      }));

      // Select 5 random products
      const randomProducts = productsData.sort(() => 0.5 - Math.random()).slice(0, 5);
      setProducts(randomProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };
  if (__DEV__) {
    console.disableYellowBox = true; // Disable yellow box warnings
  }
  
  const takePicture = async () => {
    if (!hasPermission) {
      alert('Camera permission is required');
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        analyzePlantLeaf(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        analyzePlantLeaf(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const analyzePlantLeaf = async (uri) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'plant_image.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post(`${config.API_IP}/predict/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { "Predicted Label": predictedLabel, "Confidence Score": confidenceScore } = response.data;

      const confidence = parseFloat(confidenceScore.replace('%', '')) / 100;

      if (confidence < 0.6) {
        setResult({ status: 'error', message: 'Sorry, cannot predict. Try another image.' });
      } else {
        const labelParts = predictedLabel.split('___');
        const plantName = labelParts[0];
        const condition = labelParts[1] || 'Healthy';

        setResult({
          plantName,
          condition,
          confidence,
          recommendation: condition === 'healthy'
            ? 'Your plant is looking great! Continue with your current care routine.' 
            : `The plant is affected by ${condition}. Please take necessary actions to treat it.`,
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({ status: 'error', message: 'Failed to analyze image. Please try again.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productData: item, username })} // Pass entire product data, including stock
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.vendor}</Text>
        <Text style={styles.productVendor} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productVendor}>stock: {item.stock}</Text>
        <Text style={styles.productVendor}>Location: {item.vendorLocation}</Text> {/* Added location */}

        <View style={styles.productPriceRow}>
          <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={async () => {
              try {
                const response = await fetch(`${config.API_IP}/wishlist/${username}/${item.id}`, {
                  method: 'POST',
                });
                if (response.ok) {
                  alert('Product added to wishlist successfully!');
                } else {
                  const responseData = await response.json();
                  if (responseData.detail === 'Product is already in your wishlist') {
                    alert('Product is already in your wishlist.');
                  } else {
                    alert('Failed to add product to wishlist.');
                  }
                }
              } catch (error) {
                console.error('Error adding to wishlist:', error);
                alert('An error occurred. Please try again.');
              }
            }}
          >
            <Ionicons name="heart-outline" size={20} color="#2e6b41" />
          </TouchableOpacity>
          <Text style={styles.productPrice}>Rs.{item.price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addToCartButton}>
            <Ionicons name="cart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const saveRemedy = async (username, diseaseName) => {
    try {
      const response = await axios.post(
        `${config.API_IP}/save-remedy?username=${encodeURIComponent(username)}&disease_name=${encodeURIComponent(diseaseName)}`
      );

      if (response.status === 200) {
        const { plant_name, description, remedies, pesticides_fertilizers } = response.data;

        // Store remedy details in variables
        const plantName = plant_name;
        const diseaseDescription = description;
        const remedyList = remedies;
        const pesticidesAndFertilizers = pesticides_fertilizers;

        console.log('Pesticides and Fertilizers:', pesticidesAndFertilizers);

        // Fetch products based on pesticidesAndFertilizers
        fetchProducts(pesticidesAndFertilizers); // Pass directly without encoding

        Alert.alert(
          'Remedy Details',
          `\nPlant Name: ${plantName}\n` +
          '\n' +
          `Disease: ${diseaseName}\n` +
          '\n' +
          `Description: ${diseaseDescription}\n` +
          '\n' +
          `Remedies: ${remedyList}\n` +
          '\n' +
          `Pesticides/Fertilizers: ${pesticidesAndFertilizers}`,
          [{ text: 'OK' }],
          { cancelable: true }
        );
      } else {
        Alert.alert('Error', 'Failed to fetch remedy details.');
      }
    } catch (error) {
      console.error('Error saving remedy:', error);
      Alert.alert('Error', 'An error occurred while saving the remedy.');
    }
  };
  
  // Update the renderResultCard function
  const renderResultCard = () => {
    if (!result) return null;
  
    let statusColor = '#4caf50'; // Default green for healthy
    let statusText = result.plantName || 'Healthy'; // Updated to display plantName
  
    if (result.status === 'disease') {
      statusColor = '#f44336'; // Red for disease
      statusText = `${result.plantName}: ${result.condition}`; // Updated to include plantName and condition
    } else if (result.status === 'pest') {
      statusColor = '#ff9800'; // Orange for pest
      statusText = `${result.plantName}: Pest - ${result.pest}`; // Updated to include plantName and pest
    } else if (result.status === 'nutrient_deficiency') {
      statusColor = '#ffc107'; // Yellow for deficiency
      statusText = `${result.plantName}: Deficiency - ${result.deficiency}`; // Updated to include plantName and deficiency
    } else if (result.status === 'error') {
      statusColor = '#9e9e9e'; // Grey for error
      statusText = 'Error';
    }
  
    return (
      <View style={[styles.resultCard, { borderColor: statusColor }]}>
        <View style={styles.resultHeader}>
          <Text style={[styles.resultStatus, { color: statusColor }]}>{statusText}</Text>
          <Text style={styles.resultConfidence}>
            {result.confidence ? `${(result.confidence * 100).toFixed(0)}% confident` : ''}
          </Text>
        </View>
        <Text style={styles.resultRecommendation}>
          {result.recommendation || result.message}
        </Text>
        {result.status !== 'healthy' && result.status !== 'error' && (
          <TouchableOpacity 
            style={styles.viewSolutionsButton}
            onPress={() => {
              saveRemedy(username, result.plantName + '___' + result.condition);
            }}
          >
            <Text style={styles.viewSolutionsText}>View Recommended Measures </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    
    switch (tabName) {
      case 'home':
        fetchProducts();
        break;
      case 'marketplace':
        router.push({ pathname: 'marketPlace', params: { username } }); // Pass username to marketPlace.jsx
        break;
      case 'notifications':
        router.push({ pathname: 'notificationCenter', params: { username } }); // Pass username to notifications.jsx
        break;
      case 'profile':
        router.push({pathname: 'profile', params: { username } }); // Pass username to profile.jsx
        break;
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#2e6b41" /></View>;
  }
  
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {/* Plant Health Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Health Test</Text>
          <Text style={styles.sectionDescription}>
            Take or upload a photo of your plant leaf to check its health status
          </Text>
          
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons name="image" size={80} color="#ccc" />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
            
            {analyzing && (
              <View style={styles.analyzeOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.analyzeText}>Analyzing leaf...</Text>
              </View>
            )}
          </View>
          
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
              <MaterialIcons name="camera-alt" size={24} color="#fff" />
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={24} color="#fff" />
              <Text style={styles.imageButtonText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
          
          {renderResultCard()}
        </View>
        
        {/* Marketplace Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marketplace for {username} </Text>
          <Text style={styles.sectionDescription}>
            Find products for your plants from our verified vendors
          </Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#2e6b41" style={styles.loader} />
          ) : (
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>No products available at the moment</Text>
              }
            />
          )}
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => handleTabPress('marketplace')}
          >
            <Text style={styles.viewAllText}>View All Products</Text>
          </TouchableOpacity>
        </View>
        
        {/* Add padding at bottom to ensure content isn't hidden behind tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Bottom Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="home" 
            size={24} 
            color={activeTab === 'home' ? '#2e6b41' : '#888'} 
          />
          <Text style={[
            styles.navText,
            activeTab === 'home' && styles.activeNavText
          ]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabPress('marketplace')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="shopping-cart" 
            size={24} 
            color={activeTab === 'marketplace' ? '#2e6b41' : '#888'} 
          />
          <Text style={[
            styles.navText,
            activeTab === 'marketplace' && styles.activeNavText
          ]}>
            Market
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabPress('notifications')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="notifications" 
            size={24} 
            color={activeTab === 'notifications' ? '#2e6b41' : '#888'} 
          />
          <Text style={[
            styles.navText,
            activeTab === 'notifications' && styles.activeNavText
          ]}>
            Alerts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabPress('profile')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? '#2e6b41' : '#888'} 
          />
          <Text style={[
            styles.navText,
            activeTab === 'profile' && styles.activeNavText
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e6b41',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 16,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#999',
  },
  analyzeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzeText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2e6b41',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  resultConfidence: {
    fontSize: 14,
    color: '#666',
  },
  resultRecommendation: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  viewSolutionsButton: {
    marginTop: 16,
    backgroundColor: '#2e6b41',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewSolutionsText: {
    color: '#fff',
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productVendor: {
    fontSize: 12,
    color: '#2e6b41',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#2e6b41',
    borderRadius: 4,
    padding: 6,
  },
  wishlistButton: {
    borderRadius: 4,
    padding: 6,
    marginLeft: -115,
  },
  loader: {
    marginVertical: 20,
  },
  emptyListText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: '#2e6b41',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: '#2e6b41',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 70, // Height of the navigation bar
  },
  
  // Navigation Bar Styles
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12, // Additional padding for devices with home indicator
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 11,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: '#888',
  },
  activeNavText: {
    color: '#2e6b41',
    fontWeight: '600',
  },
});

export default CustomerLandingPage;