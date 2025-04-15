import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useNavigation, useRoute } from '@react-navigation/native';

const Marketplace = () => {
  const navigation = useNavigation(); // Use useNavigation hook
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [activeTab, setActiveTab] = useState('marketplace');
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const router = useRouter();
  const route = useRoute();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/products');
        const data = await response.json();
        const productsData = Array.isArray(data) ? data.map(product => ({
          id: product.id.toString(),
          name: product.name,
          vendor: product.vendor_name,
          vendorLocation: product.vendor_address,
          price: product.price,
          stock: product.stock,
          image: `http://127.0.0.1:8000${product.image_url}`,
          details: product.description,
          availability: product.stock > 0 ? 'In Stock' : 'Out of Stock',
        })) : [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        setNoResults(productsData.length === 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setNoResults(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let results = [...products];
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(
        item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by tab
    if (activeTab === 'Vendors') {
      // This would typically be handled differently with vendor-specific data
      // For now, we're just grouping by vendor
      const vendorSet = new Set();
      results = results.filter(item => {
        if (!vendorSet.has(item.vendor)) {
          vendorSet.add(item.vendor);
          return true;
        }
        return false;
      });
    } else if (activeTab === 'Remedies') {
      // You'd implement remedy-specific filtering here
      // For mock purposes, we're keeping all products
    }
    
    // Sort results
    if (sortBy === 'price') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'location') {
      results.sort((a, b) => a.vendorLocation.localeCompare(b.vendorLocation));
    }
    
    setFilteredProducts(results);
    setNoResults(results.length === 0);
  }, [searchQuery, products, sortBy, activeTab]);

  const renderSortButton = (title, value) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === value && styles.sortButtonActive]}
      onPress={() => setSortBy(value)}
    >
      <Text style={[styles.sortButtonText, sortBy === value && styles.sortButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderTabButton = (title, iconName) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === title && styles.tabButtonActive]}
      onPress={() => setActiveTab(title)}
    >
      <Ionicons 
        name={iconName} 
        size={24} 
        color={activeTab === title ? '#fff' : '#2e6e41'} 
      />
      <Text style={[styles.tabButtonText, activeTab === title && styles.tabButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => navigation.navigate('ProductDetail', { productData: item, username: route.params.username })} // Use navigation from hook
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.vendorName}>{item.vendor}</Text>
        <Text style={styles.locationText}>{item.vendorLocation}</Text>
        <Text style={styles.detailsText} numberOfLines={2}>{item.details}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
        </View>
        <Text style={[
          styles.availabilityText,
          item.availability === 'In Stock' ? styles.inStock : 
          item.availability === 'Limited Stock' ? styles.limitedStock : 
          styles.outOfStock
        ]}>
          {item.availability}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderVendorItem = ({ item }) => (
    <View style={styles.vendorCard}>
      <Ionicons name="storefront-outline" size={32} color="#2e6e41" />
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.vendor}</Text>
        <Text style={styles.locationText}>{item.vendorLocation}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    if (activeTab === 'Vendors') {
      return renderVendorItem({ item });
    } else {
      return renderProductItem({ item });
    }
  };

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>No Results Found</Text>
      <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
    </View>
  );

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      router.push({ pathname: 'customerLandingPage', params: { username: route.params.username } });
    } else if (tab === 'marketplace') {
      router.push({ pathname: 'marketPlace', params: { username: route.params.username } });
    } else if (tab === 'notifications') {
      router.push({ pathname: 'notificationCenter', params: { username: route.params.username } });
    } else if (tab === 'profile') {
      router.push({ pathname: 'profile', params: { username: route.params.username } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search vendors, products, or remedies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={styles.sortTitle}>Sort By</Text>
        <View style={styles.sortButtons}>
          {renderSortButton('Price', 'price')}
          {renderSortButton('Location', 'location')}
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        {renderTabButton('Vendors', 'storefront-outline')}
        {renderTabButton('Products', 'cube-outline')}
        {renderTabButton('Remedies', 'medkit-outline')}
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Search Results</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#2e6e41" />
        ) : noResults ? (
          renderNoResults()
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
      
      <View style={styles.bottomNav}>
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
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sortButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#2e6e41',
  },
  sortButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  tabButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#2e6e41',
  },
  tabButtonActive: {
    backgroundColor: '#2e6e41',
  },
  tabButtonText: {
    color: '#2e6e41',
    marginTop: 4,
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  vendorName: {
    fontSize: 14,
    color: '#2e6e41',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  inStock: {
    color: '#2e8b57',
  },
  limitedStock: {
    color: '#ff8c00',
  },
  outOfStock: {
    color: '#dc3545',
  },
  vendorCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vendorInfo: {
    marginLeft: 16,
    flex: 1,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    padding: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 4, // Additional padding for devices with home indicator
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2, // Reduced gap between icon and text
  },
  activeNavText: {
    color: '#2e6b41',
    fontWeight: '500',
  },
});

export default Marketplace;