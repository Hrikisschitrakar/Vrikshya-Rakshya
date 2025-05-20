// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
// import { Package, MapPin, ShoppingCart } from 'lucide-react-native';
// import { useRoute } from '@react-navigation/native';
// import { WebView } from 'react-native-webview';  // Import WebView
// import config from '../config';
// const ProductDetail = () => {
//   const route = useRoute();
//   const { productData: product } = route.params;
//   const { username } = route.params;

//   const [userId, setUserId] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [paymentUrl, setPaymentUrl] = useState(null);  // State to hold URL

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const response = await fetch(`${config.API_IP}/customer/profile/${username}`);
//         if (response.ok) {
//           const data = await response.json();
//           setUserId(data.id);
//         } else {
//           console.error('Failed to fetch user ID');
//         }
//       } catch (error) {
//         console.error('Error fetching user ID:', error);
//       }
//     };
//     fetchUserId();
//   }, [username]);

//   const handleIncrease = () => {
//     if (quantity < product.stock) setQuantity(quantity + 1);
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleBuyNow = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not loaded yet. Please try again.');
//       return;
//     }

//     try {
//       // Using query params POST with empty body as per your backend needs
//       const url = `${config.API_IP}/create_order?product_name=${encodeURIComponent(product.name)}&quantity=${quantity}&user_id=${userId}`;

//       console.log('Sending POST request with URL:', url);

//       const response = await fetch(url, {
//         method: 'POST',
//         body: null,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Payment URL:', data.payment_url);
//         setPaymentUrl(data.payment_url); // Set URL to open in WebView
//       } else {
//         const errorData = await response.json();
//         console.error('Order creation error:', errorData);
//         Alert.alert('Error', errorData.detail || 'Failed to create order. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error creating order:', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   if (paymentUrl) {
//     return <WebView source={{ uri: paymentUrl }} style={{ flex: 1 }} />;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         {/* Your existing UI here */}
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
//         </View>

//         <View style={styles.infoContainer}>
//           <Text style={styles.productName}>{product.name}</Text>
//           <Text style={styles.price}>${product.price.toFixed(2)}</Text>
//           <Text style={styles.description}>{product.description}</Text>
//           <Text style={styles.description}>Username: {username}</Text>
//           <Text style={styles.description}>User ID: {userId || 'Loading...'}</Text>
//           <View style={styles.stockContainer}>
//             <Package color="#4CAF50" size={18} />
//             <Text style={[styles.stockText, { color: product.stock > 0 ? '#2E7D32' : '#D32F2F' }]}>
//               {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//             </Text>
//           </View>

//           <View style={styles.shopContainer}>
//             <Text style={styles.shopTitle}>Shop Information</Text>
//             <Text style={styles.shopName}>{product.vendor}</Text>
//             <View style={styles.addressContainer}>
//               <MapPin color="#4CAF50" size={16} />
//               <Text style={styles.address}>{product.vendorLocation}</Text>
//             </View>
//           </View>

//           <View style={styles.counterContainer}>
//             <TouchableOpacity
//               style={[styles.counterButton, quantity === 1 && styles.disabledButton]}
//               onPress={handleDecrease}
//               disabled={quantity === 1}
//             >
//               <Text style={styles.counterButtonText}>-</Text>
//             </TouchableOpacity>
//             <Text style={styles.counterText}>{quantity}</Text>
//             <TouchableOpacity
//               style={[styles.counterButton, quantity === product.stock && styles.disabledButton]}
//               onPress={handleIncrease}
//               disabled={quantity === product.stock}
//             >
//               <Text style={styles.counterButtonText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
//             <ShoppingCart color="#FFFFFF" size={20} />
//             <Text style={styles.buttonText}>Buy Now!!</Text>
//           </TouchableOpacity>

//           {/* Wishlist button code unchanged */}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // your styles unchanged



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F9F5',
//   },
//   imageContainer: {
//     backgroundColor: '#E8F5E9',
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 300,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   infoContainer: {
//     padding: 16,
//   },
//   productName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1B5E20',
//     marginBottom: 8,
//   },
//   price: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#2E7D32',
//     marginBottom: 16,
//   },
//   description: {
//     fontSize: 16,
//     color: '#424242',
//     lineHeight: 24,
//     marginBottom: 16,
//   },
//   stockContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   stockText: {
//     marginLeft: 8,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   shopContainer: {
//     backgroundColor: '#E8F5E9',
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 24,
//   },
//   shopTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1B5E20',
//     marginBottom: 8,
//   },
//   shopName: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#2E7D32',
//   },
//   addressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   address: {
//     marginLeft: 6,
//     fontSize: 14,
//     color: '#424242',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     borderRadius: 8,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: '600',
//     marginLeft: 8,
//   },
//   wishlistButton: {
//     marginTop: 16,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#4CAF50',
//     borderRadius: 8,
//     padding: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   wishlistButtonText: {
//     color: '#4CAF50',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   counterContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//   },
//   counterButton: {
//     backgroundColor: '#4CAF50',
//     borderRadius: 4,
//     padding: 10,
//     marginHorizontal: 10,
//   },
//   disabledButton: {
//     backgroundColor: '#A5D6A7',
//   },
//   counterButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   counterText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#424242',
//   },
// });

// export default ProductDetail;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
// import { Package, MapPin, ShoppingCart } from 'lucide-react-native';
// import { useRoute } from '@react-navigation/native';
// import { WebView } from 'react-native-webview';
// import config from '../config';

// const ProductDetail = () => {
//   const route = useRoute();
//   const { productData: product } = route.params;
//   const { username } = route.params;

//   const [userId, setUserId] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [paymentUrl, setPaymentUrl] = useState(null);

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const response = await fetch(`${config.API_IP}/customer/profile/${username}`);
//         if (response.ok) {
//           const data = await response.json();
//           setUserId(data.id);
//         } else {
//           console.error('Failed to fetch user ID');
//         }
//       } catch (error) {
//         console.error('Error fetching user ID:', error);
//       }
//     };
//     fetchUserId();
//   }, [username]);

//   const handleIncrease = () => {
//     if (quantity < product.stock) setQuantity(quantity + 1);
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleBuyNow = async () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID not loaded yet. Please try again.');
//       return;
//     }

//     try {
//       const url = `${config.API_IP}/create_order?product_id=${encodeURIComponent(product.id)}&quantity=${quantity}&user_id=${userId}`;

//       console.log('Sending POST request with URL:', url);

//       const response = await fetch(url, {
//         method: 'POST',
//         body: null,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('Payment URL:', data.payment_url);
//         setPaymentUrl(data.payment_url);
//       } else {
//         const errorData = await response.json();
//         console.error('Order creation error:', errorData);
//         Alert.alert('Error', errorData.detail || 'Failed to create order. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error creating order:', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };

//   if (paymentUrl) {
//     return (
//       <WebView
//         source={{ uri: paymentUrl }}
//         style={{ flex: 1 }}
//         onNavigationStateChange={(navState) => {
//           // Check if URL contains 'status=success' indicating payment success
//           if (navState.url.includes('status=success')) {
//             Alert.alert('Payment Successful', 'Thank you for your purchase!');
//             setPaymentUrl(null); // Close WebView by resetting paymentUrl
//           }
//         }}
//       />
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
//         </View>

//         <View style={styles.infoContainer}>
//           <Text style={styles.productName}>{product.name}</Text>
//           <Text style={styles.price}>${product.price.toFixed(2)}</Text>
//           <Text style={styles.description}>{product.description}</Text>
//           <Text style={styles.description}>Username: {username}</Text>
//           <Text style={styles.description}>User ID: {userId || 'Loading...'}</Text>
//           <View style={styles.stockContainer}>
//             <Package color="#4CAF50" size={18} />
//             <Text style={[styles.stockText, { color: product.stock > 0 ? '#2E7D32' : '#D32F2F' }]}>
//               {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//             </Text>
//           </View>

//           <View style={styles.shopContainer}>
//             <Text style={styles.shopTitle}>Shop Information</Text>
//             <Text style={styles.shopName}>{product.vendor}</Text>
//             <View style={styles.addressContainer}>
//               <MapPin color="#4CAF50" size={16} />
//               <Text style={styles.address}>{product.vendorLocation}</Text>
//             </View>
//           </View>

//           <View style={styles.counterContainer}>
//             <TouchableOpacity
//               style={[styles.counterButton, quantity === 1 && styles.disabledButton]}
//               onPress={handleDecrease}
//               disabled={quantity === 1}
//             >
//               <Text style={styles.counterButtonText}>-</Text>
//             </TouchableOpacity>
//             <Text style={styles.counterText}>{quantity}</Text>
//             <TouchableOpacity
//               style={[styles.counterButton, quantity === product.stock && styles.disabledButton]}
//               onPress={handleIncrease}
//               disabled={quantity === product.stock}
//             >
//               <Text style={styles.counterButtonText}>+</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
//             <ShoppingCart color="#FFFFFF" size={20} />
//             <Text style={styles.buttonText}>Buy Now!!</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F5F9F5' },
//   imageContainer: {
//     backgroundColor: '#E8F5E9',
//     padding: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 300,
//   },
//   image: { width: '100%', height: '100%' },
//   infoContainer: { padding: 16 },
//   productName: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginBottom: 8 },
//   price: { fontSize: 22, fontWeight: '600', color: '#2E7D32', marginBottom: 16 },
//   description: { fontSize: 16, color: '#424242', lineHeight: 24, marginBottom: 16 },
//   stockContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
//   stockText: { marginLeft: 8, fontSize: 16, fontWeight: '500' },
//   shopContainer: { backgroundColor: '#E8F5E9', padding: 16, borderRadius: 8, marginBottom: 24 },
//   shopTitle: { fontSize: 16, fontWeight: '600', color: '#1B5E20', marginBottom: 8 },
//   shopName: { fontSize: 16, fontWeight: '500', color: '#2E7D32' },
//   addressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
//   address: { marginLeft: 6, fontSize: 14, color: '#424242' },
//   button: {
//     backgroundColor: '#4CAF50',
//     borderRadius: 8,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 8 },
//   counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
//   counterButton: { backgroundColor: '#4CAF50', borderRadius: 4, padding: 10, marginHorizontal: 10 },
//   disabledButton: { backgroundColor: '#A5D6A7' },
//   counterButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
//   counterText: { fontSize: 18, fontWeight: 'bold', color: '#424242' },
// });

// export default ProductDetail;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Package, MapPin, ShoppingCart } from 'lucide-react-native';
import { useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import config from '../config';

const ProductDetail = () => {
  const route = useRoute();
  const { productData: product } = route.params;
  const { username } = route.params;

  const [userId, setUserId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${config.API_IP}/customer/profile/${username}`);
        if (response.ok) {
          const data = await response.json();
          setUserId(data.id);
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
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.description}>Username: {username}</Text>
          <Text style={styles.description}>User ID: {userId || 'Loading...'}</Text>
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
});

export default ProductDetail;
