// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Mail, Lock } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const LoginPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('cavid@q360.az');
  const [password, setPassword] = useState('demo123');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = 'Email ünvanı tələb olunur';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Yanlış email formatı';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Şifrə tələb olunur';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Şifrə ən azı 6 simvol olmalıdır';
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
        await login(email, password);
        // If login is successful, the AuthContext will handle navigation
        navigate('/dashboard');
      } catch (error: any) {
        // Failed login
        setErrors({
          email: '',
          password: '',
          general: error.message || 'Email və ya şifrə yanlışdır'
        });
      } finally {
        setIsLoading(false);
      }
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
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="password" className="text-medium" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 500
            }}>
              Şifrə
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
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="checkbox" 
                id="remember" 
                style={{ 
                  marginRight: 'var(--spacing-sm)',
                  accentColor: 'var(--primary-color)'
                }} 
              />
              <label htmlFor="remember" className="text-small">
                Məni xatırla
              </label>
            </div>
            
            <Link 
              to="/forgot-password" 
              style={{ 
                color: 'var(--primary-color)', 
                textDecoration: 'none',
                fontSize: 'var(--font-size-small)',
                fontWeight: 500
              }}
            >
              Şifrəni unutdum?
            </Link>
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
            {isLoading ? 'Giriş edilir...' : 'Daxil Ol'}
          </Button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border-color)',
          position: 'relative',
          zIndex: 1
        }}>
          <p className="text-secondary" style={{ margin: 0 }}>
            Hesabınız yoxdur? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Qeydiyyatdan keçin</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;