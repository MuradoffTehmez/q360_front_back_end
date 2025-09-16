// Input.tsx
import React, { InputHTMLAttributes } from 'react';
import '../styles/globals.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  error = false,
  errorMessage,
  className = '',
  ...props
}) => {
  const baseClasses = 'input-field';
  const errorClass = error ? 'error' : '';
  
  const classes = `${baseClasses} ${errorClass} ${className}`.trim();
  
  return (
    <>
      <input className={classes} {...props} />
      {error && errorMessage && (
        <p className="text-error text-small">{errorMessage}</p>
      )}
    </>
  );
};

export default Input;