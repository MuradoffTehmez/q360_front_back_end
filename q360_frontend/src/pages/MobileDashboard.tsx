// MobileDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from '../components/ResponsiveHeader';
import ResponsiveSidebar from '../components/ResponsiveSidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  BarChart, 
  Activity, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Bell, 
  Calendar,
  Target,
  Award,
  Clock,
  AlertCircle
} from 'lucide-react';
import { User } from '../services/AuthService';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TaskList from '../components/dashboard/TaskList';
import CircularProgressBar from '../components/dashboard/CircularProgressBar';
import RadarChart from '../components/dashboard/RadarChart';

interface MobileDashboardProps {
  onLogout: () => void;
  currentUser: User | null;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock data for dashboard cards
  const dashboardCards = [
    { 
      title: 'Gözləyən Tapşırıqlar', 
      value: '12', 
      description: 'Yeni qiymətləndirmə',
      icon: <CheckCircle size={24} />,
      color: 'var(--primary-color)',
      change: '+2 bu həftə',
      trend: 'up'
    },
    { 
      title: 'Performans Xülasəsi', 
      value: '85%', 
      description: 'Ortalama skor',
      icon: <TrendingUp size={24} />,
      color: 'var(--success-color)',
      change: '+5% bu ay',
      trend: 'up'
    },
    { 
      title: 'Son Fəaliyyətlər', 
      value: '24', 
      description: 'Bu ay fəaliyyət',
      icon: <Activity size={24} />,
      color: 'var(--primary-color)',
      change: '+3 bu həftə',
      trend: 'up'
    },
    { 
      title: 'İştirak Faizi', 
      value: '78%', 
      description: 'Tamamlanma dərəcəsi',
      icon: <Users size={24} />,
      color: 'var(--primary-color)',
      change: '-2% bu ay',
      trend: 'down'
    },
  ];

  // Mock performance data
  const performanceData = [
    { month: 'Yan', score: 75 },
    { month: 'Fev', score: 80 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 85 },
    { month: 'İyn', score: 87 },
  ];

  // Mock radar chart data
  const radarData = [
    { subject: 'Əməkdaşlıq', A: 120, fullMark: 150 },
    { subject: 'İnisiativlik', A: 110, fullMark: 150 },
    { subject: 'İnkişaf', A: 130, fullMark: 150 },
    { subject: 'Təsirlilik', A: 100, fullMark: 150 },
    { subject: 'Problemin Həlli', A: 90, fullMark: 150 },
    { subject: 'İdarəetmə', A: 85, fullMark: 150 },
  ];

  // Mock activity data
  const activities = [
    { id: 1, text: 'Yeni qiymətləndirmə forması tamamlandı', time: '2 saat əvvəl', type: 'success' },
    { id: 2, text: 'Performans hesabatı hazırlandı', time: '5 saat əvvəl', type: 'info' },
    { id: 3, text: 'Rəhbər panelinə daxil olundu', time: '1 gün əvvəl', type: 'info' },
    { id: 4, text: 'Profil məlumatları yeniləndi', time: '2 gün əvvəl', type: 'warning' },
    { id: 5, text: 'Yeni qiymətləndirmə dövrü yaradıldı', time: '3 gün əvvəl', type: 'success' },
  ];

  // Mock tasks data
  const tasks = [
    { id: 1, title: 'İşçilərin qiymətləndirilməsi', dueDate: '2023-10-20', priority: 'high', completed: false },
    { id: 2, title: 'Performans hesabatı təqdimatı', dueDate: '2023-10-22', priority: 'medium', completed: false },
    { id: 3, title: 'Komanda görüşü hazırlığı', dueDate: '2023-10-25', priority: 'low', completed: true },
    { id: 4, title: 'İdeya bankına baxış', dueDate: '2023-10-28', priority: 'medium', completed: false },
  ];

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <ResponsiveHeader 
          title="Dashboard" 
          onLogout={onLogout}
          currentUser={currentUser}
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <ResponsiveSidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={onLogout} 
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main style={{ 
          marginTop: '70px',
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--background-color)',
          minHeight: 'calc(100vh - 70px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}>
            <div className="loading-spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0, 123, 255, 0.2)',
              borderTop: '4px solid var(--primary-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveHeader 
        title="Dashboard" 
        onLogout={onLogout}
        currentUser={currentUser}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <ResponsiveSidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main style={{ 
        marginTop: '70px',
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--background-color)',
        minHeight: 'calc(100vh - 70px)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)',
        }}>
          {dashboardCards.map((card, index) => (
            <Card key={index} style={{ 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              padding: 'var(--spacing-md)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: card.color,
                opacity: 0.1,
              }} />
              <div style={{ 
                margin: '0 auto var(--spacing-sm) auto', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}>
                {card.icon}
              </div>
              <h3 style={{ 
                margin: '0 0 var(--spacing-xs) 0', 
                color: 'var(--primary-text-color)',
                fontSize: 'var(--font-size-small)'
              }}>
                {card.title}
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-large)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-xs) 0',
                color: card.color
              }}>
                {card.value}
              </p>
              <p className="text-secondary text-small" style={{ margin: 0 }}>
                {card.description}
              </p>
            </Card>
          ))}
        </div>
        
        <Card style={{ marginBottom: 'var(--spacing-md)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--spacing-md)',
          }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', margin: 0 }}>
              <TrendingUp size={16} />
              Performans
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
              <Button variant="secondary" size="small" style={{ padding: 'var(--spacing-xs)' }}>
                <Calendar size={14} />
              </Button>
              <Button variant="secondary" size="small" style={{ padding: 'var(--spacing-xs)' }}>
                <BarChart size={14} />
              </Button>
            </div>
          </div>
          <div style={{ height: '200px' }}>
            <PerformanceChart data={performanceData} />
          </div>
        </Card>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-md)',
        }}>
          <Card>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', margin: '0 0 var(--spacing-md) 0' }}>
              <Bell size={16} />
              Son Fəaliyyətlər
            </h3>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <ActivityFeed activities={activities} />
            </div>
          </Card>
          
          <Card>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)',
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', margin: 0 }}>
                <Clock size={16} />
                Tapşırıqlar
              </h3>
              <Button variant="primary" size="small" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}>
                Hamısı
              </Button>
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <TaskList tasks={tasks} />
            </div>
          </Card>
          
          <Card>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', margin: '0 0 var(--spacing-md) 0' }}>
              <Award size={16} />
              İştirak Faizi
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgressBar percentage={78} size={100} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MobileDashboard;