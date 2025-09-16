// ResponsiveHeader.tsx
import React, { useState } from 'react';
import { Menu, X, Bell, User } from 'lucide-react';
import Button from '../components/Button';
import { User as UserType } from '../services/AuthService';

interface ResponsiveHeaderProps {
  title: string;
  onLogout: () => void;
  currentUser: UserType | null;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ 
  title, 
  onLogout, 
  currentUser,
  toggleSidebar,
  isSidebarOpen
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--spacing-lg)',
      zIndex: 1000,
      marginLeft: isSidebarOpen ? '250px' : '0',
      transition: 'margin-left 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <Button 
          variant="secondary" 
          onClick={toggleSidebar}
          style={{ 
            minWidth: '40px', 
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius-small)',
            border: 'none',
            background: 'rgba(0,0,0,0.05)'
          }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        
        <h1 style={{ 
          margin: 0, 
          color: 'var(--primary-color)',
          fontSize: 'var(--font-size-xl)'
        }}>
          {title}
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
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
          <Bell size={20} />
        </Button>
        
        <div style={{ position: 'relative' }}>
          <Button 
            variant="secondary" 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            style={{ 
              minWidth: '40px', 
              padding: 'var(--spacing-sm)',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={20} />
          </Button>
          
          {isUserMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--spacing-sm)',
                minWidth: '200px',
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-medium)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 1000
              }}
            >
              <div style={{ padding: 'var(--spacing-md)' }}>
                <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
                  {currentUser?.name}
                </p>
                <p className="text-secondary text-small" style={{ margin: 0 }}>
                  {currentUser?.email}
                </p>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-md)',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'var(--error-color)',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Çıxış
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ResponsiveHeader;