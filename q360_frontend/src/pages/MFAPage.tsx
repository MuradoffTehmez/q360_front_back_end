// MFAPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Shield, Key, QrCode } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import { AuthService } from '../services/AuthService';

const MFAPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [mfaStatus, setMfaStatus] = useState(currentUser?.mfa_enabled || false);
  const [setupStep, setSetupStep] = useState<'notStarted' | 'setup' | 'verify' | 'completed'>('notStarted');
  const [mfaData, setMfaData] = useState({
    secret: '',
    backupCodes: [] as string[],
    qrCodeUrl: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [errors, setErrors] = useState({
    verificationCode: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
      setMfaStatus(user.mfa_enabled);
    }
  }, [navigate]);

  const handleSetupMFA = async () => {
    setIsLoading(true);
    setErrors({ verificationCode: '', general: '' });
    
    try {
      const data = await AuthService.setupMFA();
      setMfaData(data);
      setSetupStep('setup');
    } catch (error: any) {
      setErrors({
        verificationCode: '',
        general: error.message || 'MFA setup failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyMFA = async () => {
    if (!verificationCode) {
      setErrors({
        verificationCode: 'Təsdiqləmə kodu tələb olunur',
        general: ''
      });
      return;
    }

    setIsLoading(true);
    setErrors({ verificationCode: '', general: '' });
    
    try {
      await AuthService.enableMFA(verificationCode);
      setSetupStep('completed');
      setMfaStatus(true);
      
      // Update current user in localStorage
      const user = AuthService.getCurrentUser();
      if (user) {
        user.mfa_enabled = true;
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
      }
    } catch (error: any) {
      setErrors({
        verificationCode: '',
        general: error.message || 'MFA verification failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    setIsLoading(true);
    setErrors({ verificationCode: '', general: '' });
    
    try {
      await AuthService.disableMFA();
      setMfaStatus(false);
      setSetupStep('notStarted');
      
      // Update current user in localStorage
      const user = AuthService.getCurrentUser();
      if (user) {
        user.mfa_enabled = false;
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
      }
    } catch (error: any) {
      setErrors({
        verificationCode: '',
        general: error.message || 'MFA disable failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupCodeUse = () => {
    setSetupStep('verify');
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
        maxWidth: '600px',
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
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          backgroundColor: mfaStatus 
            ? 'rgba(40, 167, 69, 0.1)' 
            : 'rgba(255, 193, 7, 0.1)',
          borderRadius: 'var(--border-radius-medium)',
          border: `1px solid ${mfaStatus ? 'var(--success-color)' : '#FFC107'}`
        }}>
          <Shield size={24} style={{ 
            color: mfaStatus ? 'var(--success-color)' : '#FFC107' 
          }} />
          <div>
            <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
              {mfaStatus ? 'MFA Aktivdir' : 'MFA Deaktivdir'}
            </h2>
            <p className="text-secondary" style={{ margin: 'var(--spacing-xs) 0 0 0', fontSize: 'var(--font-size-small)' }}>
              {mfaStatus 
                ? 'Hesabınız iki faktorlu autentifikasiya ilə qorunur' 
                : 'Hesabınızın təhlükəsizliyini artırmaq üçün MFA aktiv edin'}
            </p>
          </div>
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
        
        {!mfaStatus && setupStep === 'notStarted' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg) auto',
              color: 'var(--primary-color)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>İki Faktorlu Autentifikasiya</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              Hesabınızın təhlükəsizliyini artırmaq üçün iki faktorlu autentifikasiyanı aktiv edin. 
              Bu funksiya hesabınıza daxil olmaq üçün əlavə bir təhlükəsizlik qatı təmin edir.
            </p>
            <Button 
              variant="primary" 
              onClick={handleSetupMFA}
              disabled={isLoading}
              style={{ 
                padding: 'var(--spacing-md) var(--spacing-xl)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 600
              }}
            >
              {isLoading ? 'Hazırlanır...' : 'MFA Aktiv Et'}
            </Button>
          </div>
        )}
        
        {!mfaStatus && setupStep === 'setup' && (
          <div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>MFA Qurulumu</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              Aşağıdakı QR kodu autentifikator tətbiqinizlə (Google Authenticator, Authy və s.) 
              skan edin və ya açar sözü əl ilə daxil edin.
            </p>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <div style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'white',
                borderRadius: 'var(--border-radius-medium)',
                border: '1px solid var(--border-color)'
              }}>
                {/* In a real app, this would be an actual QR code */}
                <div style={{
                  width: '200px',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: 'var(--border-radius-small)'
                }}>
                  <QrCode size={48} style={{ color: '#6c757d' }} />
                </div>
              </div>
              
              <div style={{ width: '100%' }}>
                <label className="text-medium" style={{ 
                  display: 'block', 
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: 500
                }}>
                  Açar söz
                </label>
                <div style={{ 
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--surface-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-medium)',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all'
                }}>
                  {mfaData.secret}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label className="text-medium" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 500
              }}>
                Təsdiqləmə kodu
              </label>
              <Input
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
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <Button 
                variant="secondary" 
                onClick={() => setSetupStep('notStarted')}
                style={{ 
                  padding: 'var(--spacing-md)',
                  fontSize: 'var(--font-size-medium)',
                  fontWeight: 600
                }}
              >
                Ləğv et
              </Button>
              <Button 
                variant="primary" 
                onClick={handleVerifyMFA}
                disabled={isLoading}
                style={{ 
                  padding: 'var(--spacing-md)',
                  fontSize: 'var(--font-size-medium)',
                  fontWeight: 600,
                  flex: 1
                }}
              >
                {isLoading ? 'Təsdiqlənir...' : 'Təsdiqlə'}
              </Button>
            </div>
            
            <div style={{ 
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(0, 123, 255, 0.05)',
              borderRadius: 'var(--border-radius-medium)',
              border: '1px solid var(--primary-color)'
            }}>
              <h3 style={{ 
                margin: '0 0 var(--spacing-sm) 0', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-sm)' 
              }}>
                <Key size={16} />
                Ehtiyat kodlar
              </h3>
              <p className="text-secondary" style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--font-size-small)' }}>
                Aşağıdakı ehtiyat kodları güvənli yerdə saxlayın. 
                Autentifikator tətbiqinizi itirdiyiniz halda hesabınıza daxil olmaq üçün istifadə edin:
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: 'var(--spacing-sm)',
                marginTop: 'var(--spacing-sm)'
              }}>
                {mfaData.backupCodes.map((code, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 'var(--border-radius-small)',
                      fontFamily: 'monospace',
                      fontSize: 'var(--font-size-small)'
                    }}
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {mfaStatus && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg) auto',
              color: 'var(--success-color)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>MFA Aktivdir</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              Hesabınız iki faktorlu autentifikasiya ilə qorunur. 
              Təhlükəsizliyiniz artırılıb.
            </p>
            <Button 
              variant="secondary" 
              onClick={handleDisableMFA}
              disabled={isLoading}
              style={{ 
                padding: 'var(--spacing-md) var(--spacing-xl)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 600
              }}
            >
              {isLoading ? 'Deaktiv edilir...' : 'MFA Deaktiv Et'}
            </Button>
          </div>
        )}
        
        {setupStep === 'completed' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(40, 167, 69, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--spacing-lg) auto',
              color: 'var(--success-color)'
            }}>
              <Shield size={32} />
            </div>
            <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>MFA Uğurla Aktiv Edildi</h2>
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              İki faktorlu autentifikasiya uğurla aktiv edildi. 
              Hesabınızın təhlükəsizliyi artırılıb.
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/profile')}
              style={{ 
                padding: 'var(--spacing-md) var(--spacing-xl)',
                fontSize: 'var(--font-size-medium)',
                fontWeight: 600
              }}
            >
              Profilə qayıt
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MFAPage;