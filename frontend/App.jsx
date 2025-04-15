import React from 'react';
import { UserProvider } from './context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerLandingPage from './CustomerLandingPage';
import ProductDetail from './ProductDetail';
import Solutions from './Solutions';
import MarketPlace from './MarketPlace';
import NotificationCenter from './NotificationCenter';
import Profile from './Profile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="CustomerLandingPage">
          <Stack.Screen name="CustomerLandingPage" component={CustomerLandingPage} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="Solutions" component={Solutions} />
          <Stack.Screen name="MarketPlace" component={MarketPlace} />
          <Stack.Screen name="NotificationCenter" component={NotificationCenter} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}