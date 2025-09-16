// ProfilePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User } from '../services/AuthService';
import { Camera, Save, Lock, Bell } from 'lucide-react';

interface ProfilePageProps {
  onLogout: () => void;
  currentUser: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('profile');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const [formData, setFormData] = useState({
    firstName: currentUser?.name.split(' ')[0] || '',
    lastName: currentUser?.name.split(' ')[1] || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNotifications(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile logic would go here
    console.log('Profile updated:', { formData, notifications });
    alert('Profil məlumatları yeniləndi!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px', marginTop: '70px' }}>
        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--background-color)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <h2 style={{ margin: 0 }}>Profil</h2>
            <Button variant="primary" onClick={handleSubmit}>
              <Save size={18} style={{ marginRight: 'var(--spacing-sm)' }} />
              Yadda Saxla
            </Button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-lg)',
          }}>
            <Card>
              <h3>Şəxsi Məlumatlar</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div style={{ 
                  position: 'relative',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'bold'
                  }}>
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                  <button style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}>
                    <Camera size={16} />
                  </button>
                </div>
                <p style={{ margin: 0, fontWeight: 500 }}>
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-secondary" style={{ margin: 0 }}>
                  {currentUser?.role === 'admin' ? 'Administrator' : 
                   currentUser?.role === 'manager' ? 'Menecer' : 'İşçi'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                    Ad
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                    Soyad
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </Card>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Lock size={20} />
                  Şifrəni Dəyiş
                </h3>
                <form>
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                      Hazırki Şifrə
                    </label>
                    <Input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                      Yeni Şifrə
                    </label>
                    <Input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                      Yeni Şifrəni Təsdiqlə
                    </label>
                    <Input
                      type="password"
                      name="confirmNewPassword"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <Button variant="primary">
                    Şifrəni Yenilə
                  </Button>
                </form>
              </Card>
              
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Bell size={20} />
                  Bildirişlər
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="email"
                      name="email"
                      checked={notifications.email}
                      onChange={handleChange}
                      style={{ 
                        marginRight: 'var(--spacing-sm)',
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                    <label htmlFor="email">Email bildirişləri</label>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="sms"
                      name="sms"
                      checked={notifications.sms}
                      onChange={handleChange}
                      style={{ 
                        marginRight: 'var(--spacing-sm)',
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                    <label htmlFor="sms">SMS bildirişlər</label>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      id="push"
                      name="push"
                      checked={notifications.push}
                      onChange={handleChange}
                      style={{ 
                        marginRight: 'var(--spacing-sm)',
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                    <label htmlFor="push">Push bildirişlər</label>
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

export default ProfilePage;