// User types
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
}

// Location types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// Image types
export interface ImageData {
  uri: string;
  width: number;
  height: number;
  type?: string;
}

// Navigation types
export type RootStackParamList = {
  index: undefined;
  '(auth)': undefined;
  '(tabs)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
};

export type TabsStackParamList = {
  dashboard: undefined;
};
