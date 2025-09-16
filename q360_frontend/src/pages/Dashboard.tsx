// Dashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { BarChart, Activity, CheckCircle, Users, TrendingUp, Bell, Calendar } from 'lucide-react';
import { User } from '../services/AuthService';

interface DashboardProps {
  onLogout: () => void;
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock data for dashboard cards
  const dashboardCards = [
    { 
      title: 'Tapşırıqlar', 
      value: '12', 
      description: 'Yeni tapşırıq',
      icon: <CheckCircle size={24} />,
      color: 'var(--primary-color)'
    },
    { 
      title: 'Performans Xülasəsi', 
      value: '85%', 
      description: 'Ortalama skor',
      icon: <TrendingUp size={24} />,
      color: 'var(--success-color)'
    },
    { 
      title: 'Son Fəaliyyətlər', 
      value: '24', 
      description: 'Bu ay fəaliyyət',
      icon: <Activity size={24} />,
      color: 'var(--primary-color)'
    },
    { 
      title: 'İştirak Faizi', 
      value: '78%', 
      description: 'Tamamlanma dərəcəsi',
      icon: <Users size={24} />,
      color: 'var(--primary-color)'
    },
  ];

  // Mock activity data
  const activities = [
    { id: 1, text: 'Yeni qiymətləndirmə forması tamamlandı', time: '2 saat əvvəl' },
    { id: 2, text: 'Performans hesabatı hazırlandı', time: '5 saat əvvəl' },
    { id: 3, text: 'Rəhbər panelinə daxil olundu', time: '1 gün əvvəl' },
    { id: 4, text: 'Profil məlumatları yeniləndi', time: '2 gün əvvəl' },
    { id: 5, text: 'Yeni qiymətləndirmə dövrü yaradıldı', time: '3 gün əvvəl' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header title="Dashboard" />
        
        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--background-color)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            {dashboardCards.map((card, index) => (
              <Card key={index} style={{ 
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: card.color,
                  opacity: 0.1,
                }} />
                <div style={{ 
                  margin: '0 auto var(--spacing-md) auto', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(0, 123, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color
                }}>
                  {card.icon}
                </div>
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                  {card.title}
                </h3>
                <p style={{ 
                  fontSize: 'var(--font-size-xxl)', 
                  fontWeight: 'bold', 
                  margin: '0 0 var(--spacing-sm) 0',
                  color: card.color
                }}>
                  {card.value}
                </p>
                <p className="text-secondary" style={{ margin: 0 }}>
                  {card.description}
                </p>
              </Card>
            ))}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--spacing-lg)',
          }}>
            <Card>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)',
              }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <TrendingUp size={20} />
                  Performans Qrafiki
                </h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button style={{ 
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-small)',
                    color: 'var(--primary-text-color)',
                    cursor: 'pointer'
                  }}>
                    <Calendar size={16} />
                  </button>
                  <button style={{ 
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-small)',
                    color: 'var(--primary-text-color)',
                    cursor: 'pointer'
                  }}>
                    <BarChart size={16} />
                  </button>
                </div>
              </div>
              <div style={{ 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'var(--surface-color)',
                borderRadius: 'var(--border-radius-medium)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-around',
                  padding: 'var(--spacing-lg)'
                }}>
                  {['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn'].map((month, index) => (
                    <div key={month} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <div style={{ 
                        width: '40px', 
                        backgroundColor: 'var(--primary-color)', 
                        borderRadius: 'var(--border-radius-small)',
                        height: `${40 + index * 15}%`,
                        marginBottom: 'var(--spacing-sm)'
                      }} />
                      <span className="text-small text-secondary">{month}</span>
                    </div>
                  ))}
                </div>
                <p className="text-secondary">Performans qrafiki</p>
              </div>
            </Card>
            
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Bell size={20} />
                Son Fəaliyyətlər
              </h3>
              <div style={{ 
                height: '300px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}>
                {activities.map((activity) => (
                  <div 
                    key={activity.id} 
                    style={{ 
                      padding: 'var(--spacing-sm)',
                      borderBottom: '1px solid var(--border-color)',
                      display: 'flex',
                      gap: 'var(--spacing-md)'
                    }}
                  >
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'var(--primary-color)',
                      marginTop: '8px'
                    }} />
                    <div>
                      <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
                        {activity.text}
                      </p>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;