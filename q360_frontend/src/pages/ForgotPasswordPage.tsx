// ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Mail, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { AuthService } from '../services/AuthService';

const ForgotPasswordPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', general: '' };

    if (!email) {
      newErrors.email = 'Email ünvanı tələb olunur';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Yanlış email formatı';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, general: '' }));
      
      try {
        await AuthService.passwordResetRequest(email);
        setIsSubmitted(true);
      } catch (error: any) {
        setErrors({
          email: '',
          general: error.message || 'Şifrə sıfırlama təlimatı göndərilərkən xəta baş verdi'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isSubmitted) {
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
            <Mail size={32} />
          </div>
          
          <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Şifrə sıfırlama təlimatı göndərildi</h2>
          <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
            {email} ünvanına şifrə sıfırlama təlimatlarını göndərdik. 
            Zəhmət olmasa email qutunuzu yoxlayın.
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
        
        <button
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            background: 'none',
            border: 'none',
            color: 'var(--primary-color)',
            cursor: 'pointer',
            padding: 'var(--spacing-sm) 0',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <ArrowLeft size={16} />
          Giriş səhifəsinə qayıt
        </button>
        
        <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Şifrənizi unutmusunuz?</h2>
        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
          Şifrənizi sıfırlamaq üçün email ünvanınızı daxil edin. 
          Sıfırlama təlimatlarını həmin ünvana göndərəcəyik.
        </p>
        
        {errors.general && (
          <div style={{ 
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            color: 'var(--error-color)',
            borderRadius: 'var(--border-radius-medium)',
            marginBottom: 'var(--spacing-md)',
            fontSize: 'var(--font-size-small)'
          }}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="email" className="text-medium" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 500
            }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--secondary-text-color)'
              }} />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                errorMessage={errors.email}
                placeholder="email@example.com"
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
            {isLoading ? 'Göndərilir...' : 'Təlimat göndər'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;