// Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import '../styles/globals.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const widthClass = fullWidth ? 'full-width' : '';
  
  const classes = `${baseClasses} ${variantClasses} ${widthClass} ${className}`.trim();
  
  // Size styles
  const sizeStyles = {
    small: {
      padding: 'var(--spacing-xs) var(--spacing-sm)',
      fontSize: 'var(--font-size-small)',
    },
    medium: {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      fontSize: 'var(--font-size-base)',
    },
    large: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontSize: 'var(--font-size-medium)',
    },
  };
  
  return (
    <button 
      className={classes} 
      style={{ 
        ...sizeStyles[size],
        ...props.style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;