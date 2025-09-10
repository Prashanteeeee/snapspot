import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSizes } from '../constants/spacing';

interface LocationSearchProps {
  address: string | null;
  isLoading: boolean;
  error: string | null;
  onLocationPress: () => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  address,
  isLoading,
  error,
  onLocationPress,
}) => {
  const handleCopyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      Alert.alert('Copied!', 'Address copied to clipboard');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Location</Text>
      
      <View style={[
        styles.searchContainer,
        error && styles.searchContainerError,
      ]}>
        <View style={styles.leftContent}>
          <Ionicons
            name="location"
            size={20}
            color={Colors.textSecondary}
          />
          
          <View style={styles.textContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Getting location...</Text>
              </View>
            ) : (
              <Text style={[
                styles.addressText,
                !address && styles.placeholderText,
              ]}>
                {address || 'Get your current location'}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightContent}>
          {address && (
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyAddress}
            >
              <Ionicons name="copy" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onLocationPress}
            disabled={isLoading}
          >
            <Ionicons
              name="location"
              size={20}
              color={isLoading ? Colors.primary : Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 56,
  },
  searchContainerError: {
    borderColor: Colors.error,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: Spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  addressText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  placeholderText: {
    color: Colors.textMuted,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  locationButton: {
    padding: Spacing.sm,
  },
});
