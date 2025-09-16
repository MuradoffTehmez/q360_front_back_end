// Card.tsx
import React, { HTMLAttributes } from 'react';
import '../styles/globals.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'card';
  const variantClass = variant === 'outlined' ? 'card-outlined' : '';
  
  const classes = `${baseClasses} ${variantClass} ${className}`.trim();
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;