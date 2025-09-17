// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  Menu,
  Lightbulb,
  User,
  Building,
  TrendingDown
} from 'lucide-react';
import { DashboardService, DashboardData } from '../services/dashboardService';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import TaskList from '../components/dashboard/TaskList';
import CircularProgressBar from '../components/dashboard/CircularProgressBar';
import RadarChart from '../components/dashboard/RadarChart';
import MobileDashboard from './MobileDashboard';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activePage, setActivePage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await DashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Dashboard cards based on user role
  const getDashboardCards = () => {
    if (!dashboardData || !user) return [];

    if (user.role === 'admin') {
      return [
        { 
          title: 'Ümumi İstifadəçilər', 
          value: dashboardData.total_users, 
          description: 'Sistemdə qeydiyyatdan keçmiş istifadəçilər',
          icon: <Users size={24} />,
          color: 'var(--primary-color)',
          change: '+5 bu həftə',
          trend: 'up'
        },
        { 
          title: 'Ümumi İdeyalar', 
          value: dashboardData.total_ideas, 
          description: 'Təqdim edilmiş ideyalar',
          icon: <Lightbulb size={24} />,
          color: 'var(--success-color)',
          change: '+2 bu həftə',
          trend: 'up'
        },
        { 
          title: 'Ümumi Qiymətləndirmələr', 
          value: dashboardData.total_evaluations, 
          description: 'Tamamlanmış qiymətləndirmələr',
          icon: <TrendingUp size={24} />,
          color: 'var(--primary-color)',
          change: '+7 bu ay',
          trend: 'up'
        },
        { 
          title: 'Gözləyən Qiymətləndirmələr', 
          value: dashboardData.pending_evaluations, 
          description: 'Tamamlanmamış qiymətləndirmələr',
          icon: <Clock size={24} />,
          color: 'var(--warning-color)',
          change: '-1 bu həftə',
          trend: 'down'
        },
      ];
    } else if (user.role === 'manager') {
      return [
        { 
          title: 'Komanda Üzvləri', 
          value: dashboardData.team_members, 
          description: 'Ümumi komanda üzvləri',
          icon: <Users size={24} />,
          color: 'var(--primary-color)',
          change: '+1 bu ay',
          trend: 'up'
        },
        { 
          title: 'Komanda Qiymətləndirmələri', 
          value: dashboardData.team_evaluations, 
          description: 'Komanda qiymətləndirmələri',
          icon: <TrendingUp size={24} />,
          color: 'var(--success-color)',
          change: '+3 bu həftə',
          trend: 'up'
        },
        { 
          title: 'Gözləyən Komanda Qiymətləndirmələri', 
          value: dashboardData.pending_team_evaluations, 
          description: 'Tamamlanmamış qiymətləndirmələr',
          icon: <Clock size={24} />,
          color: 'var(--warning-color)',
          change: '-1 bu həftə',
          trend: 'down'
        },
        { 
          title: 'Komanda Performansı', 
          value: `${dashboardData.team_performance}%`, 
          description: 'Ortalama komanda performansı',
          icon: <Target size={24} />,
          color: 'var(--primary-color)',
          change: '+2% bu ay',
          trend: 'up'
        },
      ];
    } else {
      return [
        { 
          title: 'Mənim Qiymətləndirmələrim', 
          value: dashboardData.my_evaluations, 
          description: 'Ümumi qiymətləndirmələr',
          icon: <TrendingUp size={24} />,
          color: 'var(--primary-color)',
          change: '+1 bu ay',
          trend: 'up'
        },
        { 
          title: 'Gözləyən Qiymətləndirmələr', 
          value: dashboardData.pending_my_evaluations, 
          description: 'Tamamlanmamış qiymətləndirmələr',
          icon: <Clock size={24} />,
          color: 'var(--warning-color)',
          change: '-1 bu həftə',
          trend: 'down'
        },
        { 
          title: 'Mənim İdeyalarım', 
          value: dashboardData.my_ideas, 
          description: 'Təqdim edilmiş ideyalar',
          icon: <Lightbulb size={24} />,
          color: 'var(--success-color)',
          change: '+1 bu həftə',
          trend: 'up'
        },
        { 
          title: 'Performans Xülasəsi', 
          value: `${dashboardData.performance_score}%`, 
          description: 'Ortalama skor',
          icon: <Award size={24} />,
          color: 'var(--primary-color)',
          change: '+3% bu ay',
          trend: 'up'
        },
      ];
    }
  };

  // Extract performance data from dashboardData
  const performanceData = dashboardData?.performance_data || [
    { month: 'Yan', score: 75 },
    { month: 'Fev', score: 80 },
    { month: 'Mar', score: 78 },
    { month: 'Apr', score: 82 },
    { month: 'May', score: 85 },
    { month: 'İyn', score: 87 },
  ];

  // Extract radar chart data from dashboardData
  const radarData = dashboardData?.radar_data || [
    { subject: 'Əməkdaşlıq', A: 120, fullMark: 150 },
    { subject: 'İnisiativlik', A: 110, fullMark: 150 },
    { subject: 'İnkişaf', A: 130, fullMark: 150 },
    { subject: 'Təsirlilik', A: 100, fullMark: 150 },
    { subject: 'Problemin Həlli', A: 90, fullMark: 150 },
    { subject: 'İdarəetmə', A: 85, fullMark: 150 },
  ];

  // Extract tasks from dashboardData
  const tasks = dashboardData?.tasks || [
    { id: 1, title: 'İşçilərin qiymətləndirilməsi', dueDate: '2023-10-20', priority: 'high' as const, completed: false },
    { id: 2, title: 'Performans hesabatı təqdimatı', dueDate: '2023-10-22', priority: 'medium' as const, completed: false },
    { id: 3, title: 'Komanda görüşü hazırlığı', dueDate: '2023-10-25', priority: 'low' as const, completed: true },
    { id: 4, title: 'İdeya bankına baxış', dueDate: '2023-10-28', priority: 'medium' as const, completed: false },
  ];

  const dashboardCards = getDashboardCards();

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentUser={user}
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

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentUser={user}
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

  if (isMobile) {
    return <MobileDashboard onLogout={handleLogout} currentUser={user} />;
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
                  {card.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
              <ActivityFeed activities={(dashboardData?.recent_activities || []).map((activity, index) => ({
                ...activity,
                id: activity.id || index + 1,
                type: activity.type || 'info'
              }))} />
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