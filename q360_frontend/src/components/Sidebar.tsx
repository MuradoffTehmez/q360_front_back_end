// Sidebar.tsx
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  User, 
  LogOut,
  Users,
  Settings,
  Shield,
  Lightbulb,
  Bell
} from 'lucide-react';
import Button from './Button';
import { User as UserType } from '../services/AuthService';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  currentUser: UserType | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout, currentUser }) => {
  // Filter menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'profile', label: 'Profil', icon: User },
      { id: 'settings', label: 'Tənzimləmələr', icon: Settings },
    ];

    if (currentUser?.role === 'employee') {
      return [
        ...baseItems,
        { id: 'ideas', label: 'İdeya Bankı', icon: Lightbulb },
        { id: 'notifications', label: 'Bildirişlər', icon: Bell },
        { id: 'evaluation', label: 'Qiymətləndirmə', icon: FileText },
        { id: 'reports', label: 'Fərdi Hesabatlar', icon: FileText },
        { id: 'report-center', label: 'Hesabat Mərkəzi', icon: BarChart3 },
      ];
    }

    if (currentUser?.role === 'manager') {
      return [
        ...baseItems,
        { id: 'ideas', label: 'İdeya Bankı', icon: Lightbulb },
        { id: 'notifications', label: 'Bildirişlər', icon: Bell },
        { id: 'evaluation', label: 'Qiymətləndirmə', icon: FileText },
        { id: 'reports', label: 'Fərdi Hesabatlar', icon: FileText },
        { id: 'report-center', label: 'Hesabat Mərkəzi', icon: BarChart3 },
        { id: 'team', label: 'Komanda', icon: Users },
      ];
    }

    if (currentUser?.role === 'admin') {
      return [
        ...baseItems,
        { id: 'ideas', label: 'İdeya Bankı', icon: Lightbulb },
        { id: 'notifications', label: 'Bildirişlər', icon: Bell },
        { id: 'evaluation', label: 'Qiymətləndirmə', icon: FileText },
        { id: 'reports', label: 'Fərdi Hesabatlar', icon: FileText },
        { id: 'report-center', label: 'Hesabat Mərkəzi', icon: BarChart3 },
        { id: 'team', label: 'Komanda', icon: Users },
        { id: 'admin', label: 'Admin Paneli', icon: Shield },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside style={{
      width: '250px',
      height: '100vh',
      backgroundColor: 'var(--surface-color)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-md) 0',
      position: 'fixed',
      zIndex: 100,
    }}>
      <div style={{ 
        padding: '0 var(--spacing-lg) var(--spacing-lg)', 
        borderBottom: '1px solid var(--border-color)',
        marginBottom: 'var(--spacing-md)'
      }}>
        <h1 style={{ 
          color: 'var(--primary-color)', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--border-radius-small)',
            background: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            Q
          </div>
          Q360
        </h1>
        {currentUser && (
          <div style={{ 
            marginTop: 'var(--spacing-sm)',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'rgba(0, 123, 255, 0.05)',
            borderRadius: 'var(--border-radius-small)'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-small)',
              fontWeight: 500,
              color: 'var(--primary-color)'
            }}>
              {currentUser.name}
            </p>
            <p className="text-secondary" style={{ 
              margin: 0, 
              fontSize: 'var(--font-size-small)'
            }}>
              {currentUser.role === 'admin' ? 'Administrator' : 
               currentUser.role === 'manager' ? 'Menecer' : 'İşçi'}
            </p>
          </div>
        )}
      </div>
      
      <nav style={{ flex: 1, padding: '0 var(--spacing-md)' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'primary' : 'secondary'}
              fullWidth
              onClick={() => onNavigate(item.id)}
              style={{
                justifyContent: 'flex-start',
                margin: 'var(--spacing-xs) 0',
                backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                color: isActive ? 'white' : 'var(--primary-text-color)',
                border: 'none',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'left'
              }}
            >
              <Icon size={20} style={{ marginRight: 'var(--spacing-sm)' }} />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <div style={{ padding: '0 var(--spacing-md) var(--spacing-md)' }}>
        <Button
          variant="secondary"
          fullWidth
          onClick={onLogout}
          style={{ 
            justifyContent: 'flex-start',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            color: 'var(--error-color)',
            border: 'none'
          }}
        >
          <LogOut size={20} style={{ marginRight: 'var(--spacing-sm)' }} />
          Çıxış
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;