import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from '../../src/contexts/UserContext';
import { useAuth } from '../../src/hooks/useAuth';
import { useLocation } from '../../src/hooks/useLocation';
import { useImagePicker } from '../../src/hooks/useImagePicker';
import { ImageData } from '../../src/types';
import { LocationSearch } from '../../src/components/LocationSearch';
import { ImageUpload } from '../../src/components/ImageUpload';
import { ImageActionSheet } from '../../src/components/ImageActionSheet';
import { CustomCamera } from '../../src/components/CustomCamera';
import { Colors } from '../../src/constants/colors';
import { Spacing, BorderRadius, FontSizes } from '../../src/constants/spacing';

export default function DashboardScreen() {
  const { user } = useUser();
  const { logout } = useAuth();
  const { 
    address, 
    isLoading: locationLoading, 
    error: locationError, 
    getCurrentLocation,
    clearError: clearLocationError 
  } = useLocation();
  const imageState = useImagePicker();
  const { 
    selectedImage: hookSelectedImage, 
    isLoading: imageLoading, 
    error: imageError, 
    pickImageFromCamera, 
    pickImageFromGallery,
    clearImage,
    clearError: clearImageError 
  } = imageState;
  
  const [showImageActionSheet, setShowImageActionSheet] = useState(false);
  const [showCustomCamera, setShowCustomCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  const handleLocationPress = () => {
    clearLocationError();
    getCurrentLocation();
  };

  const handleImagePress = () => {
    clearImageError();
    setShowImageActionSheet(true);
  };

  const handleCameraPress = () => {
    setShowCustomCamera(true);
  };

  const handleGalleryPress = async () => {
    const result = await pickImageFromGallery();
    if (result) {
      setSelectedImage(result);
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setSelectedImage(null);
            clearImage();
          }
        },
      ]
    );
  };

  const handlePhotoTaken = (uri: string) => {
    // Create image data from the captured photo
    const imageData = {
      uri,
      width: 400, // Default width for camera photos
      height: 300, // Default height for camera photos
      type: 'image',
    };
    
    // Set the image directly in the image picker state
    // We need to modify the useImagePicker hook to accept external images
    setSelectedImage(imageData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.fullName?.split(' ')[0] || 'User'}! 👋
            </Text>
            <Text style={styles.subtitleText}>
              Ready to capture some amazing moments?
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Location Search */}
        <LocationSearch
          address={address}
          isLoading={locationLoading}
          error={locationError}
          onLocationPress={handleLocationPress}
        />

        {/* Image Upload */}
        <ImageUpload
          selectedImage={selectedImage || hookSelectedImage}
          isLoading={imageLoading}
          error={imageError}
          onPress={handleImagePress}
          onRemove={handleRemoveImage}
        />

      </ScrollView>

      {/* Image Action Sheet */}
      <ImageActionSheet
        visible={showImageActionSheet}
        onClose={() => setShowImageActionSheet(false)}
        onCameraPress={handleCameraPress}
        onGalleryPress={handleGalleryPress}
      />

      {/* Custom Camera */}
      <CustomCamera
        visible={showCustomCamera}
        onClose={() => setShowCustomCamera(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  logoutButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
  },
});
