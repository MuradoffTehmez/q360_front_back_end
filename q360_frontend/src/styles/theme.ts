// Theme configuration for Q360 Platform
export const lightTheme = {
  // Background colors
  background: '#F8F9FA',
  surface: '#FFFFFF',
  
  // Text colors
  primaryText: '#212529',
  secondaryText: '#6C757D',
  
  // Brand colors
  primary: '#007BFF',
  success: '#28A745',
  error: '#DC3545',
  
  // Borders
  border: '#DEE2E6',
  
  // Shadows
  shadow: '0 2px 8px rgba(0,0,0,0.1)',
};

export const darkTheme = {
  // Background colors
  background: '#121212',
  surface: '#1E1E1E',
  
  // Text colors
  primaryText: '#E0E0E0',
  secondaryText: '#8A8A8A',
  
  // Brand colors
  primary: '#4D9FFF',
  success: '#33C15B',
  error: '#F15B6C',
  
  // Borders
  border: '#333333',
  
  // Shadows
  shadow: '0 2px 8px rgba(0,0,0,0.3)',
};

export type Theme = typeof lightTheme;