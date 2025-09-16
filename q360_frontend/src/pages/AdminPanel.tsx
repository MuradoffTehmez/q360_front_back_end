// AdminPanel.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import SystemHealthMonitor from '../components/SystemHealthMonitor';
import AuditLogs from '../components/AuditLogs';
import WhiteLabeling from '../components/WhiteLabeling';
import { User } from '../services/AuthService';
import { Users, Building, Calendar, Search, Filter, Plus, Activity, Database, Wifi, Server, FileText, Palette } from 'lucide-react';

interface AdminPanelProps {
  onLogout: () => void;
  currentUser: User | null;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('admin');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock admin data
  const users = [
    { id: 1, name: 'Əliyev Cavid', email: 'cavid.aliyev@example.com', role: 'İstifadəçi', department: 'İT', status: 'Aktiv' },
    { id: 2, name: 'Məmmədova Leyla', email: 'leyla.mammadova@example.com', role: 'Menecer', department: 'İT', status: 'Aktiv' },
    { id: 3, name: 'Həsənov Rəşad', email: 'rashad.hasanov@example.com', role: 'İstifadəçi', department: 'Dizayn', status: 'Qeyri-aktiv' },
    { id: 4, name: 'Quliyeva Nərgiz', email: 'nargiz.quliyeva@example.com', role: 'İstifadəçi', department: 'Test', status: 'Aktiv' },
    { id: 5, name: 'İsmayılov Elşən', email: 'elshan.ismayilov@example.com', role: 'Admin', department: 'İT', status: 'Aktiv' },
  ];

  const departments = [
    { id: 1, name: 'İT Departamenti', users: 24 },
    { id: 2, name: 'Marketinq Departamenti', users: 18 },
    { id: 3, name: 'Satış Departamenti', users: 32 },
    { id: 4, name: 'HR Departamenti', users: 12 },
  ];

  const evaluationCycles = [
    { id: 1, name: 'İyul 2023 - İyul 2024', period: '01.07.2023 - 30.06.2024', status: 'Aktiv', participants: 42 },
    { id: 2, name: 'İyul 2022 - İyul 2023', period: '01.07.2022 - 30.06.2023', status: 'Tamamlandı', participants: 38 },
    { id: 3, name: 'İyul 2021 - İyul 2022', period: '01.07.2021 - 30.06.2022', status: 'Tamamlandı', participants: 35 },
  ];

  const stats = {
    totalUsers: 126,
    activeCycles: 1,
    departments: 8,
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
              <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Super Admin Paneli</h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                Sistem idarəetmə paneli
              </p>
            </div>
            
            <Button variant="primary">
              Yeni Qiymətləndirmə Dövrü
            </Button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <Card style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md) auto',
                color: 'var(--primary-color)'
              }}>
                <Users size={24} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                Ümumi İstifadəçilər
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-xxl)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-sm) 0',
                color: 'var(--primary-color)'
              }}>
                {stats.totalUsers}
              </p>
              <p className="text-secondary" style={{ margin: 0 }}>
                Sistemdə qeydiyyatdan keçmiş istifadəçilər
              </p>
            </Card>
            
            <Card style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md) auto',
                color: 'var(--success-color)'
              }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                Aktiv Qiymətləndirmələr
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-xxl)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-sm) 0',
                color: 'var(--success-color)'
              }}>
                {stats.activeCycles}
              </p>
              <p className="text-secondary" style={{ margin: 0 }}>
                Davam edən qiymətləndirmə dövrləri
              </p>
            </Card>
            
            <Card style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md) auto',
                color: '#FFC107'
              }}>
                <Building size={24} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                Departamentlər
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-xxl)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-sm) 0',
                color: '#FFC107'
              }}>
                {stats.departments}
              </p>
              <p className="text-secondary" style={{ margin: 0 }}>
                Ümumi departament sayı
              </p>
            </Card>
          </div>
          
          <SystemHealthMonitor 
            data={[
              { metric: 'Server CPU', value: 45, status: 'healthy', icon: <Server size={24} /> },
              { metric: 'Yaddaş İstifadəsi', value: 68, status: 'warning', icon: <Database size={24} /> },
              { metric: 'Şəbəkə Statusu', value: 100, status: 'healthy', icon: <Wifi size={24} /> },
              { metric: 'Verilənlər Bazası', value: 99, status: 'healthy', icon: <Database size={24} /> }
            ]}
          />
          
          <AuditLogs 
            data={[
              { 
                id: 1, 
                user: 'Əliyev Cavid', 
                action: 'İstifadəçi yaratdı', 
                resource: 'Yeni işçi hesabı', 
                timestamp: '2023-10-15T14:30:00', 
                ip: '192.168.1.105', 
                location: 'Bakı, Azərbaycan' 
              },
              { 
                id: 2, 
                user: 'Məmmədova Leyla', 
                action: 'Qiymətləndirmə yenilədi', 
                resource: 'Frontend Developer dövrü', 
                timestamp: '2023-10-15T11:15:00', 
                ip: '192.168.1.112', 
                location: 'Bakı, Azərbaycan' 
              },
              { 
                id: 3, 
                user: 'İsmayılov Elşən', 
                action: 'İstifadəçi silindi', 
                resource: 'Test hesabı', 
                timestamp: '2023-10-14T16:45:00', 
                ip: '192.168.1.108', 
                location: 'Bakı, Azərbaycan' 
              },
              { 
                id: 4, 
                user: 'Əliyev Cavid', 
                action: 'Hesabat yaratdı', 
                resource: 'Aylıq performans', 
                timestamp: '2023-10-14T10:30:00', 
                ip: '192.168.1.105', 
                location: 'Bakı, Azərbaycan' 
              },
              { 
                id: 5, 
                user: 'Quliyeva Nərgiz', 
                action: 'Parametrlər yeniləndi', 
                resource: 'Bildiriş ayarları', 
                timestamp: '2023-10-13T14:20:00', 
                ip: '192.168.1.115', 
                location: 'Bakı, Azərbaycan' 
              }
            ]}
          />
          
          <WhiteLabeling onSave={(settings) => console.log('White labeling settings saved:', settings)} />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <Card>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)',
              }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Users size={20} />
                  İstifadəçi İdarəetməsi
                </h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ 
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--secondary-text-color)'
                    }} />
                    <Input 
                      placeholder="Axtar..." 
                      style={{ 
                        paddingLeft: '34px',
                        width: '200px'
                      }}
                    />
                  </div>
                  <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Filter size={18} />
                    Filtr
                  </Button>
                  <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Plus size={18} />
                    Yeni İstifadəçi
                  </Button>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Ad</th>
                      <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Email</th>
                      <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Rol</th>
                      <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Departament</th>
                      <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        style={{ borderBottom: '1px solid var(--border-color)' }}
                      >
                        <td style={{ padding: 'var(--spacing-md)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-color)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: 'var(--font-size-small)'
                            }}>
                              {user.name.charAt(0)}
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td style={{ padding: 'var(--spacing-md)' }}>{user.email}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>{user.role}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>{user.department}</td>
                        <td style={{ padding: 'var(--spacing-md)' }}>
                          <span 
                            style={{ 
                              padding: 'var(--spacing-xs) var(--spacing-sm)',
                              borderRadius: 'var(--border-radius-small)',
                              backgroundColor: user.status === 'Aktiv' 
                                ? 'rgba(40, 167, 69, 0.1)' 
                                : 'rgba(220, 53, 69, 0.1)',
                              color: user.status === 'Aktiv' 
                                ? 'var(--success-color)' 
                                : 'var(--error-color)',
                              fontSize: 'var(--font-size-small)',
                            }}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--spacing-md)' }}>
                          <Button variant="secondary" size="small">
                            Redaktə
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <Card>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-lg)',
                }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Building size={20} />
                    Departamentlər
                  </h3>
                  <Button variant="primary" size="small" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Plus size={16} />
                    Yeni
                  </Button>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                }}>
                  {departments.map((dept) => (
                    <div 
                      key={dept.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--spacing-sm) 0',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <div>
                        <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: '500' }}>
                          {dept.name}
                        </p>
                        <p className="text-secondary text-small" style={{ margin: 0 }}>
                          {dept.users} istifadəçi
                        </p>
                      </div>
                      <Button variant="secondary" size="small">
                        Redaktə
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-lg)',
                }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Calendar size={20} />
                    Qiymətləndirmə Dövrləri
                  </h3>
                  <Button 
                    variant="primary" 
                    size="small" 
                    onClick={() => navigate('/evaluation-wizard')}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                  >
                    <Plus size={16} />
                    Yeni
                  </Button>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                }}>
                  {evaluationCycles.map((cycle) => (
                    <div 
                      key={cycle.id} 
                      style={{ 
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-medium)',
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                      }}>
                        <p style={{ margin: '0', fontWeight: '500' }}>
                          {cycle.name}
                        </p>
                        <span 
                          style={{ 
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            borderRadius: 'var(--border-radius-small)',
                            backgroundColor: cycle.status === 'Aktiv' 
                              ? 'rgba(40, 167, 69, 0.1)' 
                              : 'rgba(108, 117, 125, 0.1)',
                            color: cycle.status === 'Aktiv' 
                              ? 'var(--success-color)' 
                              : 'var(--secondary-text-color)',
                            fontSize: 'var(--font-size-small)',
                          }}
                        >
                          {cycle.status}
                        </span>
                      </div>
                      <p className="text-secondary text-small" style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                        {cycle.period}
                      </p>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        {cycle.participants} iştirakçı
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;