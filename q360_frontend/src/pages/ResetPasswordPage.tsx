// ResetPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Lock, Check } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const ResetPasswordPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get token from URL parameters (in a real app)
  const token = searchParams.get('token') || 'sample-token';

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (!password) {
      newErrors.password = 'Şifrə tələb olunur';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Şifrə ən azı 8 simvol olmalıdır';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Şifrə böyük, kiçik hərf və rəqəm daxil etməlidir';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Şifrə təsdiqi tələb olunur';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Şifrələr uyğun gəlmir';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, this would reset the password using the token
        setIsSuccess(true);
        setIsLoading(false);
      }, 1500);
    }
  };

  if (isSuccess) {
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
          
          <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Şifrə uğurla dəyişdirildi</h2>
          <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
            Şifrəniz uğurla yeniləndi. Yeni şifrəniz ilə hesabınıza daxil ola bilərsiniz.
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
        </Card>
      </div>
    );
  }

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
        overflow: 'hidden'
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
        
        <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Yeni şifrə təyin et</h2>
        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
          Yeni şifrənizi təyin edin. Şifrəniz ən azı 8 simvol olmalı və böyük, kiçik hərf və rəqəm daxil etməlidir.
        </p>
        
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="password" className="text-medium" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 500
            }}>
              Yeni şifrə
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--secondary-text-color)'
              }} />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                errorMessage={errors.password}
                placeholder="••••••••"
                style={{ 
                  paddingLeft: '40px',
                  fontSize: 'var(--font-size-medium)'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="confirmPassword" className="text-medium" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 500
            }}>
              Yeni şifrə (təsdiq)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--secondary-text-color)'
              }} />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                placeholder="••••••••"
                style={{ 
                  paddingLeft: '40px',
                  fontSize: 'var(--font-size-medium)'
                }}
              />
            </div>
          </div>
          
          <Button 
            variant="primary" 
            type="submit" 
            fullWidth
            disabled={isLoading}
            style={{ 
              padding: 'var(--spacing-md)',
              fontSize: 'var(--font-size-medium)',
              fontWeight: 600
            }}
          >
            {isLoading ? 'Yenilənir...' : 'Şifrəni yenilə'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;