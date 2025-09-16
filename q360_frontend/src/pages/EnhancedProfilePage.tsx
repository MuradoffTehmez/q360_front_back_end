// EnhancedProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User, ChevronLeft, ChevronRight, Save, Send, HelpCircle, AlertCircle, Shield, Mail, Phone, Building, Calendar, Key, Globe } from 'lucide-react';
import { UserService, UpdateUserData } from '../services/userService';
import CircularProgressBar from '../components/dashboard/CircularProgressBar';

const EnhancedProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileCompleteness] = useState(85); // This would be calculated based on filled fields in a real app

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: '',
    timezone: 'Asia/Baku',
    language: 'Azərbaycan dili',
    bio: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await UserService.getCurrentUser();
        
        setFormData({
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          department: userData.department || '',
          position: userData.position || '',
          hireDate: userData.hire_date || '',
          timezone: 'Asia/Baku',
          language: 'Azərbaycan dili',
          bio: ''
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
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

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsSaving(true);
      try {
        // Prepare data for update
        const updateData: UpdateUserData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          position: formData.position,
          hire_date: formData.hireDate,
          bio: formData.bio
        };

        // Remove empty fields
        Object.keys(updateData).forEach(key => {
          if (updateData[key as keyof UpdateUserData] === '') {
            delete updateData[key as keyof UpdateUserData];
          }
        });

        // Update user data
        await UserService.updateUser(updateData);
        
        // Refresh user data in context
        await refreshUser();
        
        setIsEditing(false);
        alert("Profil məlumatları uğurla yeniləndi!");
      } catch (err: any) {
        alert("Yeniləmə zamanı xəta baş verdi: " + err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      position: user?.position || '',
      hireDate: user?.hire_date || '',
      timezone: 'Asia/Baku',
      language: 'Azərbaycan dili',
      bio: ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Profil" />
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="loading-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0, 123, 255, 0.2)',
              borderTop: '4px solid var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Profil" />
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg) auto',
                color: 'var(--error-color)'
              }}>
                <AlertCircle size={32} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Səhv baş verdi</h3>
              <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
                {error}
              </p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Yenidən cəhd et
              </Button>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        currentUser={user}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
        <Header title="Profil" />
        
        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--background-color)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 350px',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <div>
              <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 'var(--font-size-xl)'
                      }}>
                        {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                      </div>
                      {isEditing && (
                        <button
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <User size={16} />
                        </button>
                      )}
                    </div>
                    <div>
                      <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-secondary" style={{ margin: 0 }}>
                        {formData.position}
                      </p>
                      <p className="text-secondary" style={{ margin: 'var(--spacing-xs) 0 0 0' }}>
                        {formData.department}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    {isEditing ? (
                      <>
                        <Button 
                          variant="secondary" 
                          onClick={handleCancel}
                        >
                          Ləğv et
                        </Button>
                        <Button 
                          variant="primary" 
                          onClick={handleSave}
                          disabled={isSaving}
                          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                        >
                          <Save size={16} />
                          {isSaving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="primary" 
                        onClick={() => setIsEditing(true)}
                      >
                        Redaktə et
                      </Button>
                    )}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 'var(--spacing-lg)' 
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Şəxsi məlumatlar</h3>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="firstName" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Ad
                      </label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          error={!!errors.firstName}
                          errorMessage={errors.firstName}
                        />
                      ) : (
                        <p style={{ margin: 0 }}>{formData.firstName}</p>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="lastName" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Soyad
                      </label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          error={!!errors.lastName}
                          errorMessage={errors.lastName}
                        />
                      ) : (
                        <p style={{ margin: 0 }}>{formData.lastName}</p>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="email" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Email
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Mail size={16} style={{ color: 'var(--secondary-text-color)' }} />
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            errorMessage={errors.email}
                          />
                        ) : (
                          <p style={{ margin: 0 }}>{formData.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="phone" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Telefon
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Phone size={16} style={{ color: 'var(--secondary-text-color)' }} />
                        {isEditing ? (
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            errorMessage={errors.phone}
                          />
                        ) : (
                          <p style={{ margin: 0 }}>{formData.phone || 'Əlavə edilməyib'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="department" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Departament
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Building size={16} style={{ color: 'var(--secondary-text-color)' }} />
                        {isEditing ? (
                          <Input
                            id="department"
                            type="text"
                            value={formData.department}
                            onChange={handleChange}
                          />
                        ) : (
                          <p style={{ margin: 0 }}>{formData.department || 'Əlavə edilməyib'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>İş məlumatları</h3>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="position" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Vəzifə
                      </label>
                      {isEditing ? (
                        <Input
                          id="position"
                          type="text"
                          value={formData.position}
                          onChange={handleChange}
                        />
                      ) : (
                        <p style={{ margin: 0 }}>{formData.position || 'Əlavə edilməyib'}</p>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="hireDate" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        İşə qəbul tarixi
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Calendar size={16} style={{ color: 'var(--secondary-text-color)' }} />
                        {isEditing ? (
                          <Input
                            id="hireDate"
                            type="date"
                            value={formData.hireDate}
                            onChange={handleChange}
                          />
                        ) : (
                          <p style={{ margin: 0 }}>
                            {formData.hireDate ? new Date(formData.hireDate).toLocaleDateString() : 'Əlavə edilməyib'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="timezone" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Saat qurşağı
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Globe size={16} style={{ 
                          color: 'var(--secondary-text-color)', 
                          marginRight: 'var(--spacing-sm)',
                          verticalAlign: 'middle'
                        }} />
                        {isEditing ? (
                          <select
                            id="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            style={{
                              width: '100%',
                              padding: 'var(--spacing-sm)',
                              borderRadius: 'var(--border-radius-medium)',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              color: 'var(--primary-text-color)',
                              fontFamily: 'var(--font-family)',
                              fontSize: 'var(--font-size-base)'
                            }}
                          >
                            <option value="Asia/Baku">Asia/Baku (UTC+4)</option>
                            <option value="Europe/London">Europe/London (UTC+0)</option>
                            <option value="America/New_York">America/New_York (UTC-5)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                          </select>
                        ) : (
                          <p style={{ margin: 0 }}>{formData.timezone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="language" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Dil
                      </label>
                      {isEditing ? (
                        <select
                          id="language"
                          value={formData.language}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm)',
                            borderRadius: 'var(--border-radius-medium)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            color: 'var(--primary-text-color)',
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--font-size-base)'
                          }}
                        >
                          <option value="Azərbaycan dili">Azərbaycan dili</option>
                          <option value="English">English</option>
                          <option value="Русский">Русский</option>
                        </select>
                      ) : (
                        <p style={{ margin: 0 }}>{formData.language}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Bioqrafiya</h3>
                  {isEditing ? (
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Özünüz haqqında qısa məlumat əlavə edin..."
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-medium)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--primary-text-color)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)',
                        resize: 'vertical'
                      }}
                    />
                  ) : (
                    <p style={{ margin: 0 }}>
                      {formData.bio || 'Bioqrafiya əlavə edilməyib'}
                    </p>
                  )}
                </div>
              </Card>
              
              <Card>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <h3 style={{ margin: 0 }}>Təhlükəsizlik</h3>
                  <Shield size={20} style={{ color: 'var(--secondary-text-color)' }} />
                </div>
                
                <div style={{ 
                  padding: 'var(--spacing-lg)', 
                  backgroundColor: 'rgba(0, 123, 255, 0.05)',
                  borderRadius: 'var(--border-radius-medium)',
                  border: '1px solid rgba(0, 123, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(0, 123, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-color)'
                    }}>
                      <Key size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>Şifrə dəyişdir</h4>
                      <p className="text-secondary" style={{ margin: 0, fontSize: 'var(--font-size-small)' }}>
                        Hesabınızın təhlükəsizliyi üçün şifrənizi dəyişdirin
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/reset-password')}
                    style={{ 
                      marginTop: 'var(--spacing-md)',
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-sm)' 
                    }}
                  >
                    <Key size={16} />
                    Yeni şifrə təyin et
                  </Button>
                </div>
              </Card>
            </div>
            
            <div>
              <Card style={{ textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 var(--spacing-lg) 0' }}>Profil Tamamlığı</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
                  <CircularProgressBar percentage={profileCompleteness} size={120} />
                </div>
                <p className="text-secondary" style={{ margin: 'var(--spacing-md) 0 0 0' }}>
                  Profilinizin {profileCompleteness}%-i tamamlanıb
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => setIsEditing(true)}
                  style={{ marginTop: 'var(--spacing-md)' }}
                >
                  Tamamla
                </Button>
              </Card>
              
              <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                <h3 style={{ margin: '0 0 var(--spacing-lg) 0' }}>Əlaqə məlumatları</h3>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--spacing-md)' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(0, 123, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-color)'
                    }}>
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-secondary" style={{ margin: 0, fontSize: 'var(--font-size-small)' }}>
                        Email
                      </p>
                      <p style={{ margin: 'var(--spacing-xs) 0 0 0' }}>{formData.email}</p>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--success-color)'
                    }}>
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-secondary" style={{ margin: 0, fontSize: 'var(--font-size-small)' }}>
                        Telefon
                      </p>
                      <p style={{ margin: 'var(--spacing-xs) 0 0 0' }}>
                        {formData.phone || 'Əlavə edilməyib'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedProfilePage;