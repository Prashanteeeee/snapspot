import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ImageData } from '../types';

interface ImagePickerState {
  selectedImage: ImageData | null;
  isLoading: boolean;
  error: string | null;
}

export const useImagePicker = () => {
  const [imageState, setImageState] = useState<ImagePickerState>({
    selectedImage: null,
    isLoading: false,
    error: null,
  });

  // Clear any previous errors
  const clearError = useCallback(() => {
    setImageState(prev => ({ ...prev, error: null }));
  }, []);

  // Request camera permissions
  const requestCameraPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        setImageState(prev => ({
          ...prev,
          error: 'Camera permission denied. Please enable camera access in settings.',
        }));
        return false;
      }
      
      return true;
    } catch (error) {
      setImageState(prev => ({
        ...prev,
        error: 'Failed to request camera permissions.',
      }));
      return false;
    }
  }, []);

  // Request media library permissions
  const requestMediaLibraryPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        setImageState(prev => ({
          ...prev,
          error: 'Media library permission denied. Please enable photo access in settings.',
        }));
        return false;
      }
      
      return true;
    } catch (error) {
      setImageState(prev => ({
        ...prev,
        error: 'Failed to request media library permissions.',
      }));
      return false;
    }
  }, []);

  // Pick image from camera
  const pickImageFromCamera = useCallback(async () => {
    setImageState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        setImageState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageData: ImageData = {
          uri: asset.uri,
          width: asset.width || 0,
          height: asset.height || 0,
          type: asset.type || 'image',
        };

        setImageState(prev => ({
          ...prev,
          selectedImage: imageData,
          isLoading: false,
          error: null,
        }));
      } else {
        setImageState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      setImageState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to take photo',
      }));
    }
  }, [requestCameraPermissions]);

  // Pick image from gallery
  const pickImageFromGallery = useCallback(async () => {
    setImageState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) {
        setImageState(prev => ({ ...prev, isLoading: false }));
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageData: ImageData = {
          uri: asset.uri,
          width: asset.width || 0,
          height: asset.height || 0,
          type: asset.type || 'image',
        };

        setImageState(prev => ({
          ...prev,
          selectedImage: imageData,
          isLoading: false,
          error: null,
        }));
        
        return imageData;
      } else {
        setImageState(prev => ({ ...prev, isLoading: false }));
        return null;
      }
    } catch (error) {
      setImageState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to pick image',
      }));
      return null;
    }
  }, [requestMediaLibraryPermissions]);

  // Clear selected image
  const clearImage = useCallback(() => {
    setImageState({
      selectedImage: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...imageState,
    pickImageFromCamera,
    pickImageFromGallery,
    clearImage,
    clearError,
  };
};
