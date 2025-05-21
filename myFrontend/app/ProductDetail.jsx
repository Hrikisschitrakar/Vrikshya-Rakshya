import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, TextInput } from 'react-native';
import { Package, MapPin, ShoppingCart, MoreVertical } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import config from '../config';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const ProductDetail = () => {
  const route = useRoute();
  const { productData: product } = route.params;
  const { username } = route.params;

  const [userId, setUserId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [averageRating, setAverageRating] = useState('Loading...');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]); // State to store comments
  const [newComment, setNewComment] = useState(''); // State for new comment input

  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) {
        console.error('Username is missing or invalid');
        return;
      }

      try {
        console.log('Fetching user ID for username:', username); // Debugging log
        const response = await fetch(`${config.API_IP}/get-user-id?username=${encodeURIComponent(username)}`);
        console.log('Response status:', response.status); // Debugging log
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user ID:', data.user_id); // Debugging log
          setUserId(data.user_id);
        } else {
          const errorText = await response.text();
          console.error(`Failed to fetch user ID: ${response.status} - ${response.statusText}`, errorText);
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`${config.API_IP}/reviews/average/${product.id}`);
        if (response.ok) {
          const rating = await response.json();
          setAverageRating(rating !== null && !isNaN(Number(rating)) ? `${rating.toFixed(1)} / 5` : 'No reviews');
        } else {
          setAverageRating('No reviews');
        }
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating('No reviews');
      }
    };

    // Ensure comments are fetched and displayed properly
    const fetchComments = async () => {
      try {
        const response = await fetch(`${config.API_IP}/comments/${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error('Failed to fetch comments:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchUserId();
    fetchAverageRating();
    fetchComments();
  }, [username, product.id]);

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleBuyNow = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not loaded yet. Please try again.');
      return;
    }

    try {
      const url = `${config.API_IP}/create_order?product_id=${encodeURIComponent(product.id)}&quantity=${quantity}&user_id=${userId}`;

      console.log('Sending POST request with URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        body: null,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Payment URL:', data.payment_url);
        setPaymentUrl(data.payment_url);
      } else {
        const errorData = await response.json();
        console.error('Order creation error:', errorData);
        Alert.alert('Error', errorData.detail || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRateProduct = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating before submitting.');
      return;
    }

    try {
      const response = await fetch(`${config.API_IP}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          user_id: userId,
          rating: rating, // Send rating as a number
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for rating this product!');
        setRating(0); // Reset the rating
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.detail || 'Failed to submit rating. Please try again.';
        Alert.alert('Error', errorMessage); // Show specific error message
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleReportProduct = () => {
    Alert.alert(
      'Report Product',
      'Are you sure you want to report this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${config.API_IP}/report-product`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  product_id: product.id,
                  reporter_username: username, // Use reporter_username instead of user_id
                  reason: 'Inappropriate content', // Example reason
                }),
              });

              if (response.ok) {
                Alert.alert('Success', 'The product has been reported.');
              } else {
                const errorData = await response.json();
                console.error('Error reporting product:', errorData);
                Alert.alert('Error', errorData.detail || 'Failed to report the product. Please try again.');
              }
            } catch (error) {
              console.error('Error reporting product:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Error', 'Comment cannot be empty.');
      return;
    }

    try {
      const response = await fetch(`${config.API_IP}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id, // Ensure product_id is sent
          user_id: userId, // Ensure user_id is sent
          content: newComment.trim(), // Corrected field name to 'content'
        }),
      });

      if (response.ok) {
        const commentData = await response.json();
        setComments([...comments, commentData]);
        setNewComment('');
        Alert.alert('Success', 'Comment added successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error adding comment:', errorData);
        Alert.alert('Error', errorData.detail || 'Failed to add comment. Please try again.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        style={{ flex: 1 }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.status === 'success') {
              Alert.alert('Payment Successful', data.message);
              setPaymentUrl(null); // Close WebView
            }
          } catch {
            // Ignore non-JSON messages
          }
        }}
        injectedJavaScript={`
          (function() {
            function checkPage() {
              try {
                const text = document.body.innerText || "";
                if (text.includes('"status":"success"')) {
                  window.ReactNativeWebView.postMessage(text);
                }
              } catch(e) {}
            }
            setInterval(checkPage, 1000);
          })();
        `}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleReportProduct} style={styles.reportButton}>
          <MoreVertical size={24} color="#424242" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          {/* <Text style={styles.description}>Username: {username}</Text> */}
          {/* <Text style={styles.description}>User ID: {userId || 'Loading...'}</Text> */}

          {/* Display average rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Average Rating:</Text>
            <Text style={styles.ratingValue}>{averageRating}</Text>
          </View>

          <View style={styles.stockContainer}>
            <Package color="#4CAF50" size={18} />
            <Text style={[styles.stockText, { color: product.stock > 0 ? '#2E7D32' : '#D32F2F' }]}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Text>
          </View>

          <View style={styles.shopContainer}>
            <Text style={styles.shopTitle}>Shop Information</Text>
            <Text style={styles.shopName}>{product.vendor}</Text>
            <View style={styles.addressContainer}>
              <MapPin color="#4CAF50" size={16} />
              <Text style={styles.address}>{product.vendorLocation}</Text>
            </View>
          </View>

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

          <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
            <ShoppingCart color="#FFFFFF" size={20} />
            <Text style={styles.buttonText}>Buy Now!!</Text>
          </TouchableOpacity>

          {/* Rate this Product Section */}
          <View style={styles.rateContainer}>
            <Text style={styles.rateTitle}>Rate this Product</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Package
                    size={24}
                    color={star <= rating ? '#FFD700' : '#CCCCCC'}
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleRateProduct}>
              <Text style={styles.submitButtonText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={styles.commentTitle}>Comments</Text>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <View key={index} style={styles.commentItem}>
                  <Text style={styles.commentAuthor}>{comment.username || 'Anonymous'}</Text> {/* Ensure 'username' field exists */}
                  <Text style={styles.commentText}>{comment.content || comment.text}</Text> {/* Use 'content' or fallback to 'text' */}
                </View>
              ))
            ) : (
              <Text style={styles.commentPlaceholder}>No comments yet. Be the first to comment!</Text>
            )}
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddComment}>
              <Text style={styles.submitButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9F5' },
  imageContainer: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  image: { width: '100%', height: '100%' },
  infoContainer: { padding: 16 },
  productName: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginBottom: 8 },
  price: { fontSize: 22, fontWeight: '600', color: '#2E7D32', marginBottom: 16 },
  description: { fontSize: 16, color: '#424242', lineHeight: 24, marginBottom: 16 },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#424242',
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  stockContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  stockText: { marginLeft: 8, fontSize: 16, fontWeight: '500' },
  shopContainer: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 8, marginBottom: 24 },
  shopTitle: { fontSize: 16, fontWeight: '600', color: '#1B5E20', marginBottom: 8 },
  shopName: { fontSize: 16, fontWeight: '500', color: '#2E7D32' },
  addressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  address: { marginLeft: 6, fontSize: 14, color: '#424242' },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  counterButton: { backgroundColor: '#4CAF50', borderRadius: 4, padding: 10, marginHorizontal: 10 },
  disabledButton: { backgroundColor: '#A5D6A7' },
  counterButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  counterText: { fontSize: 18, fontWeight: 'bold', color: '#424242' },
  rateContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  rateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starIcon: {
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#F5F9F5',
  },
  reportButton: {
    padding: -5,
  },
  commentSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 12,
  },
  commentItem: {
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1B5E20',
  },
  commentText: {
    fontSize: 14,
    color: '#424242',
    marginTop: 4,
  },
  commentPlaceholder: {
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
  },
  commentInput: {
    marginTop: 12,
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CED4DA',
    fontSize: 16,
    color: '#495057',
  },
});

export default ProductDetail;
