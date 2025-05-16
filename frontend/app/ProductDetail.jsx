import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { ArrowLeft, Package, MapPin, ShoppingCart } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Import WebView

const ProductDetail = () => {
  const route = useRoute(); // Access the route object
  const { productData: product } = route.params; // Retrieve product data from route params
  const { username } = route.params; // Retrieve username from route params

  const [userId, setUserId] = useState(null); // State to store user ID
  const [quantity, setQuantity] = useState(1); // State for product quantity
  const [webViewUrl, setWebViewUrl] = useState(null); // State for WebView URL

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/customer/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserId(data.id); // Assuming the response contains the user ID as `id`
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, [username]);

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleBuyNow = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not loaded yet. Please try again.');
      return;
    }

    try {
      const requestData = {
        product_name: product.name,
        quantity: parseInt(quantity, 10), // Ensure quantity is an integer
        user_id: parseInt(userId, 10), // Ensure user_id is an integer
      };

      console.log('Sending order creation request with data:', requestData);

      const response = await fetch('http://127.0.0.1:8000/create_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData), // Ensure the body is properly stringified
      });

      console.log('Order creation response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Order creation response data:', data);

        if (data.payment_url) {
          setWebViewUrl(data.payment_url); // Set the payment URL returned by the backend
        } else {
          Alert.alert('Error', 'Failed to retrieve payment URL.');
        }
      } else {
        const errorData = await response.json();
        console.error('Order creation error response:', errorData);
        Alert.alert('Error', errorData.detail || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (webViewUrl) {
    return <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.description}>Username: {username}</Text>
          <Text style={styles.description}>User ID: {userId || 'Loading...'}</Text>
          <View style={styles.stockContainer}>
            <Package color="#4CAF50" size={18} />
            <Text 
              style={[
                styles.stockText, 
                { color: product.stock > 0 ? '#2E7D32' : '#D32F2F' }
              ]}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </View>

          {/* Shop Information */}
          <View style={styles.shopContainer}>
            <Text style={styles.shopTitle}>Shop Information</Text>
            <Text style={styles.shopName}>{product.vendor}</Text>
            {/* <Text style={styles.shopName}>{product.id}</Text> */}
            <View style={styles.addressContainer}>
              <MapPin color="#4CAF50" size={16} />
              <Text style={styles.address}>{product.vendorLocation}</Text>
            </View>
          </View>

          {/* Quantity Counter */}
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.counterButton, quantity === 1 && styles.disabledButton]}
              onPress={handleDecrease}
              disabled={quantity === 1}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.counterButton, quantity === product.stock && styles.disabledButton]}
              onPress={handleIncrease}
              disabled={quantity === product.stock}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
            <ShoppingCart color="#FFFFFF" size={20} />
            <Text style={styles.buttonText}>Buy Now!!</Text>
          </TouchableOpacity>

          {/* Wishlist Button */}
          <TouchableOpacity 
            style={styles.wishlistButton}
            onPress={async () => {
              try {
                const response = await fetch(`http://127.0.0.1:8000/wishlist/${username}/${product.id}`, {
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
            <Text style={styles.wishlistButtonText}> ♡Add to Wishlist</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9F5', // Light green background
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#2E7D32', // Dark green text
    fontSize: 16,
  },
  imageContainer: {
    backgroundColor: '#E8F5E9', // Very light green background
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20', // Very dark green
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2E7D32', // Dark green
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    marginBottom: 16,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  shopContainer: {
    backgroundColor: '#E8F5E9', // Very light green background
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20', // Very dark green
    marginBottom: 8,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32', // Dark green
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  address: {
    marginLeft: 6,
    fontSize: 14,
    color: '#424242',
  },
  button: {
    backgroundColor: '#4CAF50', // Medium green
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  wishlistButton: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  counterButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7', // Lighter green for disabled buttons
  },
  counterButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
});

export default ProductDetail;