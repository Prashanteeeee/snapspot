import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        // User is logged in, navigate to dashboard
        router.replace('/(tabs)/dashboard');
      } else {
        // No user data, navigate to login
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, go to login screen
      router.replace('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: 20,
        }}>
          SnapSpot
        </Text>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{
          fontSize: 16,
          color: '#9ca3af',
          marginTop: 20,
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  return null;
}
