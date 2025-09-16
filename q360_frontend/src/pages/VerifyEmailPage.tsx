// VerifyEmailPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Mail, Check, X } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { AuthService } from '../services/AuthService';

const VerifyEmailPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('');

  // Get token from URL parameters
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setMessage('Təsdiqləmə token-i tapılmadı');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      await AuthService.verifyEmail(token);
      setVerificationStatus('success');
      setMessage('Email ünvanınız uğurla təsdiqləndi. İndi hesabınıza daxil ola bilərsiniz.');
    } catch (error: any) {
      setVerificationStatus('error');
      setMessage(error.message || 'Email təsdiqləmə uğursuz oldu');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: isDarkMode 
        ? 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)' 
        : 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
      padding: 'var(--spacing-md)',
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '450px',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--border-radius-large)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'var(--primary-color)',
          opacity: 0.1,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-30px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'var(--success-color)',
          opacity: 0.1,
        }} />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: 'var(--primary-color)',
              fontSize: 'var(--font-size-xxl)'
            }}>
              Q360
            </h1>
            <p className="text-secondary" style={{ margin: 'var(--spacing-xs) 0 0 0' }}>
              Performans İdarəetmə Platforması
            </p>
          </div>
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
        </div>
        
        {verificationStatus === 'pending' && (
          <>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg) auto',
              color: 'var(--primary-color)'
            }}>
              <Mail size={32} />
            </div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Email təsdiqlənir</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              Email ünvanınız təsdiqlənir. Zəhmət olmasa gözləyin...
            </p>
          </>
        )}
        
        {verificationStatus === 'success' && (
          <>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg) auto',
              color: 'var(--success-color)'
            }}>
              <Check size={32} />
            </div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Email təsdiqləndi</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              {message}
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/login')}
              style={{ 
                padding: 'var(--spacing-md)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 600
              }}
            >
              Giriş səhifəsinə keç
            </Button>
          </>
        )}
        
        {verificationStatus === 'error' && (
          <>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg) auto',
              color: 'var(--error-color)'
            }}>
              <X size={32} />
            </div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Təsdiqləmə uğursuz oldu</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              {message}
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/login')}
              style={{ 
                padding: 'var(--spacing-md)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 600
              }}
            >
              Giriş səhifəsinə qayıt
            </Button>
          </>
        )}
      </Card>
    </div>
  );
};

export default VerifyEmailPage;