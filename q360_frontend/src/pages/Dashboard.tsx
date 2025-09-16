// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
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
  AlertCircle,
  Menu
} from 'lucide-react';
import { User } from '../services/AuthService';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TaskList from '../components/dashboard/TaskList';
import CircularProgressBar from '../components/dashboard/CircularProgressBar';
import RadarChart from '../components/dashboard/RadarChart';
import MobileDashboard from './MobileDashboard';

interface DashboardProps {
  onLogout: () => void;
  currentUser: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, currentUser }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (isMobile) {
    return <MobileDashboard onLogout={onLogout} currentUser={currentUser} />;
  }
  
  return <DesktopDashboard onLogout={onLogout} currentUser={currentUser} />;
};

const DesktopDashboard: React.FC<DashboardProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
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
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={onLogout} 
          currentUser={currentUser}
        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Dashboard" />
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
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
                <p className="text-secondary" style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                  {card.description}
                </p>
                <p className={`text-small ${card.trend === 'up' ? 'text-success' : 'text-error'}`} style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  {card.trend === 'up' ? <TrendingUp size={14} /> : <AlertCircle size={14} />}
                  {card.change}
                </p>
              </Card>
            ))}
          </div>
          
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
                  <TrendingUp size={20} />
                  Performans Qrafiki
                </h3>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <Button variant="secondary" size="small">
                    <Calendar size={16} />
                  </Button>
                  <Button variant="secondary" size="small">
                    <BarChart size={16} />
                  </Button>
                </div>
              </div>
              <PerformanceChart data={performanceData} />
            </Card>
            
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Bell size={20} />
                Son Fəaliyyətlər
              </h3>
              <ActivityFeed activities={activities} />
            </Card>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Target size={20} />
                Komanda Performansı
              </h3>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RadarChart data={radarData} />
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
                    <Clock size={20} />
                    Gözləyən Tapşırıqlar
                  </h3>
                  <Button variant="primary" size="small">
                    Hamısı
                  </Button>
                </div>
                <TaskList tasks={tasks} />
              </Card>
              
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Award size={20} />
                  İştirak Faizi
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px' }}>
                  <CircularProgressBar percentage={78} size={120} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;