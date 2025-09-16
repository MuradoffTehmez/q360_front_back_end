// RegistrationPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, User, Mail, Lock, Building, Phone } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const RegistrationPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: '',
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      phone: '',
      general: ''
    };

    if (!formData.firstName) {
      newErrors.firstName = 'Ad tələb olunur';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Soyad tələb olunur';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email ünvanı tələb olunur';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Yanlış email formatı';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Şifrə tələb olunur';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifrə ən azı 8 simvol olmalıdır';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Şifrə böyük, kiçik hərf və rəqəm daxil etməlidir';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifrə təsdiqi tələb olunur';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifrələr uyğun gəlmir';
      isValid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Departament tələb olunur';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, general: '' }));
      
      try {
        // Prepare data for registration
        const registrationData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          password_confirm: formData.confirmPassword,
          department: formData.department,
          phone: formData.phone,
        };
        
        await register(registrationData);
        
        // Successful registration
        setIsSuccess(true);
      } catch (error: any) {
        // Failed registration
        setErrors({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          department: '',
          phone: '',
          general: error.message || 'Qeydiyyat uğursuz oldu'
        });
      } finally {
        setIsLoading(false);
      }
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
            <User size={32} />
          </div>
          
          <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Qeydiyyat uğurlu oldu</h2>
          <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
            Hesabınız uğurla yaradıldı. Zəhmət olmasa email ünvanınıza göndərilən təsdiq linkinə daxil olun.
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
        maxWidth: '500px',
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
        
        <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>Hesab yarat</h2>
        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
          Yeni hesab yaratmaq üçün məlumatlarınızı daxil edin.
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <label htmlFor="firstName" className="text-medium" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 500
              }}>
                Ad
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ 
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--secondary-text-color)'
                }} />
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  errorMessage={errors.firstName}
                  placeholder="Adınız"
                  style={{ 
                    paddingLeft: '40px',
                    fontSize: 'var(--font-size-medium)'
                  }}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="lastName" className="text-medium" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 500
              }}>
                Soyad
              </label>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ 
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--secondary-text-color)'
                }} />
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  errorMessage={errors.lastName}
                  placeholder="Soyadınız"
                  style={{ 
                    paddingLeft: '40px',
                    fontSize: 'var(--font-size-medium)'
                  }}
                />
              </div>
            </div>
          </div>
          
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
                value={formData.email}
                onChange={handleChange}
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
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div>
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
                  value={formData.password}
                  onChange={handleChange}
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
            
            <div>
              <label htmlFor="confirmPassword" className="text-medium" style={{ 
                display: 'block', 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 500
              }}>
                Şifrə (təsdiq)
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="department" className="text-medium" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 500
            }}>
              Departament
            </label>
            <div style={{ position: 'relative' }}>
              <Building size={20} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--secondary-text-color)'
              }} />
              <Input
                id="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                error={!!errors.department}
                errorMessage={errors.department}
                placeholder="Departamentiniz"
                style={{ 
                  paddingLeft: '40px',
                  fontSize: 'var(--font-size-medium)'
                }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label htmlFor="phone" className="text-medium" style={{ 
              display: 'block', 
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 500
            }}>
              Telefon (istəyə bağlı)
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ 
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--secondary-text-color)'
              }} />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                errorMessage={errors.phone}
                placeholder="+994 XX XXX XX XX"
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
            {isLoading ? 'Yaradılır...' : 'Hesab yarat'}
          </Button>
          
          <div style={{ 
            textAlign: 'center', 
            marginTop: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid var(--border-color)',
            position: 'relative',
            zIndex: 1
          }}>
            <p className="text-secondary" style={{ margin: 0 }}>
              Artıq hesabınız var? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Daxil olun</Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegistrationPage;