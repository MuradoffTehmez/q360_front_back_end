// Header.tsx
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Bell, User } from 'lucide-react';
import Button from './Button';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      position: 'fixed',
      top: 0,
      left: '250px',
      right: 0,
      zIndex: 99,
      backdropFilter: 'blur(10px)',
    }}>
      <h2 style={{ 
        margin: 0, 
        color: 'var(--primary-text-color)',
        fontSize: 'var(--font-size-xl)'
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <Button 
          variant="secondary" 
          onClick={toggleTheme}
          style={{ 
            minWidth: '40px', 
            padding: 'var(--spacing-sm)',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,0.05)'
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button 
          variant="secondary" 
          style={{ 
            minWidth: '40px', 
            padding: 'var(--spacing-sm)',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,0.05)',
            position: 'relative'
          }}
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--error-color)',
          }} />
        </Button>
        
        <Button 
          variant="secondary" 
          style={{ 
            minWidth: '40px', 
            padding: 'var(--spacing-sm)',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,0.05)'
          }}
        >
          <User size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;