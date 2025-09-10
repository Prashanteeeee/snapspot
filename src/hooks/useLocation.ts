import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Location as LocationType } from '../types';

interface LocationState {
  location: LocationType | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [locationState, setLocationState] = useState<LocationState>({
    location: null,
    address: null,
    isLoading: false,
    error: null,
  });

  // Clear any previous errors
  const clearError = useCallback(() => {
    setLocationState(prev => ({ ...prev, error: null }));
  }, []);

  // Request location permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationState(prev => ({
          ...prev,
          error: 'Location permission denied. Please enable location access in settings.',
        }));
        return false;
      }
      
      return true;
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        error: 'Failed to request location permissions.',
      }));
      return false;
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    setLocationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setLocationState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Get address from coordinates (reverse geocoding)
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        // Custom address format: "9H22+P2 Dankaur, Uttar Pradesh, 203201"
        const addressParts = [];
        
        // Add street number and street name (if available)
        if (address.streetNumber && address.street) {
          addressParts.push(`${address.streetNumber} ${address.street}`);
        } else if (address.street) {
          addressParts.push(address.street);
        }
        
        // Add city/town
        if (address.city) {
          addressParts.push(address.city);
        }
        
        // Add state/region
        if (address.region) {
          addressParts.push(address.region);
        }
        
        // Add postal code (if available)
        if (address.postalCode) {
          addressParts.push(address.postalCode);
        }
        
        // Join with commas
        const fullAddress = addressParts.join(', ');

        setLocationState(prev => ({
          ...prev,
          location: locationData,
          address: fullAddress || 'Address not found',
          isLoading: false,
          error: null,
        }));
      } else {
        setLocationState(prev => ({
          ...prev,
          location: locationData,
          address: 'Address not found',
          isLoading: false,
          error: null,
        }));
      }
    } catch (error) {
      setLocationState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to get location',
      }));
    }
  }, [requestPermissions]);

  // Clear location data
  const clearLocation = useCallback(() => {
    setLocationState({
      location: null,
      address: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...locationState,
    getCurrentLocation,
    clearLocation,
    clearError,
  };
};
