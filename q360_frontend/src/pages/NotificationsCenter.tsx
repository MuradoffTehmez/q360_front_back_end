// NotificationsCenter.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { User } from '../services/AuthService';
import { Bell, CheckCircle, AlertCircle, Info, X, Filter, Eye, Archive } from 'lucide-react';

interface NotificationsCenterProps {
  onLogout: () => void;
  currentUser: User | null;
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('notifications');
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'Yeni Qiymətləndirmə Tapşırığı',
      message: 'Sizə yeni qiymətləndirmə tapşırığı təyin edildi. Zəhmət olmasa 3 gün ərzində tamamlayın.',
      type: 'info',
      date: '2023-10-15T14:30:00',
      unread: true,
      action: 'İndi Bax'
    },
    {
      id: 2,
      title: 'Hesabat Hazırdır',
      message: 'Əliyev Cavid üçün performans hesabatı hazırlandı. Detallı baxış üçün klikləyin.',
      type: 'success',
      date: '2023-10-14T10:15:00',
      unread: true,
      action: 'Hesabata Bax'
    },
    {
      id: 3,
      title: 'Yadda Saxlanılmamış Dəyişikliklər',
      message: 'Qiymətləndirmə formanızda yadda saxlanılmamış dəyişikliklər var. Zəhmət olmasa yoxlayın.',
      type: 'warning',
      date: '2023-10-13T16:45:00',
      unread: false,
      action: 'Bax'
    },
    {
      id: 4,
      title: 'Sistem Yeniləməsi',
      message: 'Platforma ən son versiyaya yeniləndi. Yeni funksiyalar haqqında ətraflı məlumat üçün baxış edin.',
      type: 'info',
      date: '2023-10-12T09:00:00',
      unread: false,
      action: 'Ətraflı'
    },
    {
      id: 5,
      title: 'Deadline Yaxınlaşır',
      message: 'Frontend Developer qiymətləndirməsi üçün vaxt bitmək üzrədir. Zəhmət olmasa təcil edin.',
      type: 'error',
      date: '2023-10-11T11:20:00',
      unread: false,
      action: 'Təcil Et'
    }
  ];

  const notificationTypes = [
    { id: 'all', label: 'Bütün Bildirişlər', count: 5 },
    { id: 'unread', label: 'Oxunmamış', count: 2 },
    { id: 'info', label: 'Məlumat', count: 2 },
    { id: 'success', label: 'Uğur', count: 1 },
    { id: 'warning', label: 'Xəbərdarlıq', count: 1 },
    { id: 'error', label: 'Xəta', count: 1 }
  ];

  const [activeFilter, setActiveFilter] = useState('all');
  const [notificationsList, setNotificationsList] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotificationsList(notificationsList.map(notification => 
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotificationsList(notificationsList.map(notification => ({ ...notification, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotificationsList(notificationsList.filter(notification => notification.id !== id));
  };

  const getFilteredNotifications = () => {
    if (activeFilter === 'all') return notificationsList;
    if (activeFilter === 'unread') return notificationsList.filter(n => n.unread);
    return notificationsList.filter(n => n.type === activeFilter);
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} style={{ color: 'var(--success-color)' }} />;
      case 'warning': return <AlertCircle size={20} style={{ color: '#FFC107' }} />;
      case 'error': return <AlertCircle size={20} style={{ color: 'var(--error-color)' }} />;
      default: return <Info size={20} style={{ color: 'var(--primary-color)' }} />;
    }
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
              <h2 style={{ margin: '0 0 var(--spacing-sm) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Bell size={24} style={{ color: 'var(--primary-color)' }} />
                Bildirişlər Mərkəzi
              </h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                Bütün sistem bildirişləri və xəbərdarlıqlar
              </p>
            </div>
            
            <Button 
              variant="secondary" 
              onClick={markAllAsRead}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <CheckCircle size={18} />
              Hamısını Oxunub Kimi İşarələ
            </Button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 4fr',
            gap: 'var(--spacing-lg)',
          }}>
            <Card>
              <h3>Filtrlər</h3>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)',
                marginTop: 'var(--spacing-md)'
              }}>
                {notificationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveFilter(type.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      background: activeFilter === type.id 
                        ? 'rgba(0, 123, 255, 0.1)' 
                        : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--border-radius-small)',
                      color: activeFilter === type.id 
                        ? 'var(--primary-color)' 
                        : 'var(--primary-text-color)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: activeFilter === type.id ? 500 : 400
                    }}
                  >
                    <span>{type.label}</span>
                    <span style={{
                      backgroundColor: 'var(--border-color)',
                      color: 'var(--secondary-text-color)',
                      padding: '2px 8px',
                      borderRadius: 'var(--border-radius-small)',
                      fontSize: 'var(--font-size-small)'
                    }}>
                      {type.count}
                    </span>
                  </button>
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
                <h3>
                  {activeFilter === 'all' ? 'Bütün Bildirişlər' : 
                   activeFilter === 'unread' ? 'Oxunmamış Bildirişlər' : 
                   notificationTypes.find(t => t.id === activeFilter)?.label}
                </h3>
                <span className="text-secondary">
                  {getFilteredNotifications().length} bildiriş
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {getFilteredNotifications().length > 0 ? (
                  getFilteredNotifications().map((notification) => (
                    <Card 
                      key={notification.id} 
                      style={{ 
                        borderLeft: `4px solid ${
                          notification.type === 'success' ? 'var(--success-color)' :
                          notification.type === 'warning' ? '#FFC107' :
                          notification.type === 'error' ? 'var(--error-color)' :
                          'var(--primary-color)'
                        }`,
                        opacity: notification.unread ? 1 : 0.7,
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            backgroundColor: `${
                              notification.type === 'success' ? 'rgba(40, 167, 69, 0.1)' :
                              notification.type === 'warning' ? 'rgba(255, 193, 7, 0.1)' :
                              notification.type === 'error' ? 'rgba(220, 53, 69, 0.1)' :
                              'rgba(0, 123, 255, 0.1)'
                            }`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getIconByType(notification.type)}
                          </div>
                          
                          <div>
                            <h4 style={{ 
                              margin: '0 0 var(--spacing-xs) 0',
                              color: notification.unread ? 'var(--primary-text-color)' : 'var(--secondary-text-color)'
                            }}>
                              {notification.title}
                            </h4>
                            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                              {notification.message}
                            </p>
                            <p className="text-small" style={{ margin: 0, color: 'var(--secondary-text-color)' }}>
                              {new Date(notification.date).toLocaleString('az-AZ')}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-sm)' }}>
                          {notification.unread && (
                            <span style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-color)',
                            }} />
                          )}
                          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                            <Button 
                              variant="secondary" 
                              size="small"
                              onClick={() => markAsRead(notification.id)}
                              disabled={!notification.unread}
                              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
                            >
                              <Eye size={14} />
                              {notification.action}
                            </Button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid var(--border-color)',
                                background: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--secondary-text-color)'
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 'var(--spacing-xl)', 
                    color: 'var(--secondary-text-color)' 
                  }}>
                    <Bell size={48} style={{ margin: '0 auto var(--spacing-md) auto', opacity: 0.3 }} />
                    <h3>Heç bir bildiriş yoxdur</h3>
                    <p>Hal-hazırda bu kateqoriyada bildiriş yoxdur</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsCenter;