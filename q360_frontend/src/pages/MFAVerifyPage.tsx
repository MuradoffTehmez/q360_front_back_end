// MFAVerifyPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Shield, Key } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { AuthService } from '../services/AuthService';

const MFAVerifyPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [errors, setErrors] = useState({
    verificationCode: '',
    backupCode: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Get user ID from location state
  const userId = location.state?.userId;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { verificationCode: '', backupCode: '', general: '' };

    if (useBackupCode) {
      if (!backupCode) {
        newErrors.backupCode = 'Ehtiyat kod tələb olunur';
        isValid = false;
      }
    } else {
      if (!verificationCode) {
        newErrors.verificationCode = 'Təsdiqləmə kodu tələb olunur';
        isValid = false;
      } else if (verificationCode.length !== 6) {
        newErrors.verificationCode = 'Kod 6 rəqəmli olmalıdır';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setErrors({ verificationCode: '', backupCode: '', general: '' });
      
      try {
        const result = await AuthService.verifyMFA(
          userId, 
          useBackupCode ? '' : verificationCode, 
          useBackupCode ? backupCode : undefined
        );
        
        if (result) {
          // Successful MFA verification
          navigate('/dashboard');
        }
      } catch (error: any) {
        setErrors({
          verificationCode: '',
          backupCode: '',
          general: error.message || 'MFA təsdiqləmə uğursuz oldu'
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
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-md) auto',
            color: 'var(--primary-color)'
          }}>
            <Shield size={32} />
          </div>
          <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>İki Faktorlu Autentifikasiya</h2>
          <p className="text-secondary" style={{ margin: 0 }}>
            Autentifikator tətbiqinizdən 6 rəqəmli kodu daxil edin
          </p>
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
          {!useBackupCode ? (
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="verificationCode" className="text-medium" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 500
              }}>
                Təsdiqləmə kodu
              </label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                error={!!errors.verificationCode}
                errorMessage={errors.verificationCode}
                placeholder="6 rəqəmli kod"
                style={{ 
                  fontSize: 'var(--font-size-medium)'
                }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label htmlFor="backupCode" className="text-medium" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 500
              }}>
                Ehtiyat kod
              </label>
              <Input
                id="backupCode"
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                error={!!errors.backupCode}
                errorMessage={errors.backupCode}
                placeholder="Ehtiyat kodunuzu daxil edin"
                style={{ 
                  fontSize: 'var(--font-size-medium)'
                }}
              />
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <button
              type="button"
              onClick={() => setUseBackupCode(!useBackupCode)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-color)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-small)',
                fontWeight: 500
              }}
            >
              {useBackupCode ? 'Normal kod istifadə et' : 'Ehtiyat kod istifadə et'}
            </button>
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
            {isLoading ? 'Təsdiqlənir...' : 'Daxil ol'}
          </Button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'var(--spacing-lg)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-small)',
              fontWeight: 500
            }}
          >
            Fərqli hesaba daxil ol
          </button>
        </div>
      </Card>
    </div>
  );
};

export default MFAVerifyPage;