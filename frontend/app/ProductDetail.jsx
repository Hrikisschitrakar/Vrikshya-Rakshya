import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft, Package, MapPin, ShoppingCart } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';

const ProductDetail = () => {
  const route = useRoute(); // Access the route object
  const { productData: product } = route.params; // Retrieve product data from route params
  const { username } = route.params; // Retrieve username from route params
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
          <Text style={styles.description}>username: {username}</Text>
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

          {/* Add to Cart Button */}
          <TouchableOpacity style={styles.button}>
            <ShoppingCart color="#FFFFFF" size={20} />
            <Text style={styles.buttonText}>Buy Now!!</Text>
          </TouchableOpacity>

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
});

export default ProductDetail;