// Email validation - checks if email format is correct
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

// Password validation - ensures password is strong enough
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  return null;
};

// Full name validation - ensures name is not empty
export const validateFullName = (fullName: string): string | null => {
  if (!fullName.trim()) {
    return 'Full name is required';
  }
  
  if (fullName.trim().length < 2) {
    return 'Full name must be at least 2 characters long';
  }
  
  return null;
};

// Confirm password validation - ensures both passwords match
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};
