// EnhancedProfilePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User, ChevronLeft, ChevronRight, Save, Send, HelpCircle, AlertCircle, Shield } from 'lucide-react';
import { User as UserType } from '../services/AuthService';
import CircularProgressBar from '../components/dashboard/CircularProgressBar';

interface EnhancedProfilePageProps {
  onLogout: () => void;
  currentUser: UserType | null;
}

const EnhancedProfilePage: React.FC<EnhancedProfilePageProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileCompleteness] = useState(85); // Mock value

  const [formData, setFormData] = useState({
    firstName: currentUser?.first_name || '',
    lastName: currentUser?.last_name || '',
    email: currentUser?.email || '',
    phone: '+994 XX XXX XX XX',
    department: currentUser?.department || '',
    position: 'Frontend Developer',
    hireDate: '2022-03-15',
    timezone: 'Asia/Baku',
    language: 'Azərbaycan dili',
    bio: 'Təcrübəli frontend developer. React, TypeScript və modern veb texnologiyalar üzrə ixtisaslaşmışam.'
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

  const handleSave = () => {
    if (validateForm()) {
      setIsSaving(true);
      // Simulate save operation
      setTimeout(() => {
        setIsSaving(false);
        setIsEditing(false);
        alert("Profil məlumatları uğurla yeniləndi!");
      }, 1000);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      firstName: currentUser?.first_name || '',
      lastName: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone: '+994 XX XXX XX XX',
      department: currentUser?.department || '',
      position: 'Frontend Developer',
      hireDate: '2022-03-15',
      timezone: 'Asia/Baku',
      language: 'Azərbaycan dili',
      bio: 'Təcrübəli frontend developer. React, TypeScript və modern veb texnologiyalar üzrə ixtisaslaşmışam.'
    });
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser}
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
                          <p style={{ margin: 0 }}>{formData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>İş məlumatları</h3>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label style={{ 
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
                          <p style={{ margin: 0 }}>{formData.department}</p>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label style={{ 
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
                        <p style={{ margin: 0 }}>{formData.position}</p>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label style={{ 
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
                            {new Date(formData.hireDate).toLocaleDateString('az-AZ')}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="bio" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Bioqrafiya
                      </label>
                      {isEditing ? (
                        <textarea
                          id="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Özünüz barədə qısa məlumat..."
                          style={{
                            width: '100%',
                            minHeight: '100px',
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
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{formData.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 style={{ margin: '0 0 var(--spacing-lg) 0' }}>Tənzimləmələr</h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 'var(--spacing-lg)' 
                }}>
                  <div>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label htmlFor="timezone" style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Saat qurşağı
                      </label>
                      {isEditing ? (
                        <select
                          id="timezone"
                          value={formData.timezone}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            borderRadius: 'var(--border-radius-medium)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            color: 'var(--primary-text-color)',
                            fontFamily: 'var(--font-family)',
                            fontSize: 'var(--font-size-base)'
                          }}
                        >
                          <option value="Asia/Baku">Asia/Baku (GMT+4)</option>
                          <option value="Europe/London">Europe/London (GMT+0)</option>
                          <option value="America/New_York">America/New_York (GMT-5)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                        </select>
                      ) : (
                        <p style={{ margin: 0 }}>{formData.timezone}</p>
                      )}
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
                            padding: 'var(--spacing-sm) var(--spacing-md)',
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
                        <p style={{ margin: 0 }}>
                          <Globe size={16} style={{ 
                            color: 'var(--secondary-text-color)', 
                            marginRight: 'var(--spacing-sm)',
                            verticalAlign: 'middle'
                          }} />
                          {formData.language}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        İki Faktorlu Autentifikasiya
                      </label>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: 'var(--border-radius-medium)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                          <Shield size={16} style={{ color: 'var(--secondary-text-color)' }} />
                          <span>
                            {currentUser?.mfa_enabled ? 'Aktiv' : 'Deaktiv'}
                          </span>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => navigate('/mfa')}
                        >
                          {currentUser?.mfa_enabled ? 'Dəyiş' : 'Aktiv et'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: 'var(--spacing-xs)',
                        fontWeight: 500
                      }}>
                        Şifrəni dəyiş
                      </label>
                      <Button 
                        variant="secondary" 
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                        onClick={() => navigate('/reset-password')}
                      >
                        <Key size={16} />
                        Yeni şifrə təyin et
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <Card style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ margin: '0 0 var(--spacing-lg) 0' }}>Profil Tamamlığı</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>
                  <CircularProgressBar percentage={profileCompleteness} size={120} />
                </div>
                <p className="text-secondary" style={{ margin: 0 }}>
                  Profiliniz {profileCompleteness}% tamamlanıb. 
                  Daha çox məlumat əlavə edərək profilinizi tamamlayın.
                </p>
              </Card>
              
              <Card>
                <h3 style={{ margin: '0 0 var(--spacing-lg) 0' }}>Ən son fəaliyyət</h3>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--spacing-md)' 
                }}>
                  <div style={{ 
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
                      Qiymətləndirmə forması tamamlandı
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      2 saat əvvəl
                    </p>
                  </div>
                  <div style={{ 
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
                      Profil məlumatları yeniləndi
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      1 gün əvvəl
                    </p>
                  </div>
                  <div style={{ 
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
                      Yeni ideya təqdim etdi
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      3 gün əvvəl
                    </p>
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