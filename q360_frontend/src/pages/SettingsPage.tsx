// SettingsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { User } from '../services/AuthService';
import { Save, Shield, Bell, Globe, Lock } from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
  currentUser: User | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('settings');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const [settings, setSettings] = useState({
    language: 'az',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save settings logic would go here
    console.log('Settings saved:', settings);
    alert('Tənzimləmələr yadda saxlanıldı!');
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
            <div>
              <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Tənzimləmələr</h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                Hesab və platforma tənzimləmələri
              </p>
            </div>
            
            <Button variant="primary" onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Save size={18} />
              Yadda Saxla
            </Button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-lg)',
          }}>
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Globe size={20} />
                Ümumi Tənzimləmələr
              </h3>
              <p className="text-secondary">Platforma ilə bağlı ümumi tənzimləmələri edə bilərsiniz.</p>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-lg)',
                marginTop: 'var(--spacing-lg)',
              }}>
                <div>
                  <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                    Dil Tənzimləmələri
                  </label>
                  <p className="text-secondary text-small" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                    Platformanın dilini seçin
                  </p>
                  
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--border-radius-medium)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--primary-text-color)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--font-size-medium)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="az">Azərbaycan dili</option>
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                    Bildirişlər
                  </label>
                  <p className="text-secondary text-small" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                    Bildiriş tənzimləmələri
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <label htmlFor="emailNotifications">Email bildirişləri</label>
                      <input 
                        type="checkbox" 
                        id="emailNotifications" 
                        name="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={handleChange}
                        style={{ 
                          accentColor: 'var(--primary-color)'
                        }}
                      />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <label htmlFor="smsNotifications">SMS bildirişlər</label>
                      <input 
                        type="checkbox" 
                        id="smsNotifications" 
                        name="smsNotifications"
                        checked={settings.smsNotifications}
                        onChange={handleChange}
                        style={{ 
                          accentColor: 'var(--primary-color)'
                        }}
                      />
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <label htmlFor="pushNotifications">Push bildirişlər</label>
                      <input 
                        type="checkbox" 
                        id="pushNotifications" 
                        name="pushNotifications"
                        checked={settings.pushNotifications}
                        onChange={handleChange}
                        style={{ 
                          accentColor: 'var(--primary-color)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Shield size={20} />
                  Hesab Təhlükəsizliyi
                </h3>
                <p className="text-secondary">Hesabınızın təhlükəsizliyi ilə bağlı tənzimləmələr.</p>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-lg)',
                }}>
                  <Button variant="secondary" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)'
                  }}>
                    <span>İki faktorlu autentifikasiya</span>
                    <span style={{ 
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--border-radius-small)',
                      backgroundColor: 'rgba(40, 167, 69, 0.1)',
                      color: 'var(--success-color)',
                      fontSize: 'var(--font-size-small)',
                    }}>
                      Aktiv
                    </span>
                  </Button>
                  
                  <Button variant="secondary" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)'
                  }}>
                    <span>Şifrəni dəyiş</span>
                    <span>→</span>
                  </Button>
                  
                  <Button variant="error" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)'
                  }}>
                    <span>Hesabı sil</span>
                    <span>→</span>
                  </Button>
                </div>
              </Card>
              
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Bell size={20} />
                  Bildiriş Tənzimləmələri
                </h3>
                <p className="text-secondary">Hansı bildirişləri almaq istədiyinizi seçin.</p>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-lg)',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <span>Yeni qiymətləndirmə</span>
                    <input 
                      type="checkbox" 
                      defaultChecked
                      style={{ 
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <span>Hesabat hazır</span>
                    <input 
                      type="checkbox" 
                      defaultChecked
                      style={{ 
                        accentColor: 'var(--primary-color)'
                      }}
                    />
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-sm) 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <span>Sistem yenilikləri</span>
                    <input 
                      type="checkbox" 
                      defaultChecked
                      style={{ 
                        accentColor: 'var(--primary-color)'
                      }}
                    />
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

export default SettingsPage;