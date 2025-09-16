// ReportsPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { User } from '../services/AuthService';
import { Download, TrendingUp, BarChart3, PieChart, FileText } from 'lucide-react';

interface ReportsPageProps {
  onLogout: () => void;
  currentUser: User | null;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('reports');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock report data
  const reportPeriods = [
    { id: 1, name: 'İyul 2023 - İyul 2024', status: 'Tamamlandı' },
    { id: 2, name: 'İyul 2022 - İyul 2023', status: 'Tamamlandı' },
    { id: 3, name: 'İyul 2021 - İyul 2022', status: 'Tamamlandı' },
  ];

  const performanceData = [
    { name: 'İş Performansı', value: 85 },
    { name: 'Komanda İşləri', value: 92 },
    { name: 'İnkişaf', value: 78 },
    { name: 'Ümumi', value: 85 },
  ];

  const strengths = [
    'Effektiv problem həlli bacarığı',
    'Yeni texnologiyaların sürətli öyrənilməsi',
    'Komanda ilə yaxşı əməkdaşlıq',
  ];

  const weaknesses = [
    'Vaxtın idarə edilməsi',
    'Prezentasiya bacarıqları',
  ];

  const feedbacks = [
    'Cavid komanda üzvləri ilə yaxşı əməkdaşlıq edir və tapşırıqları vaxtında yerinə yetirir.',
    'İnkişaf etməyə çalışır, lakin bəzən vaxtın idarə edilməsi ilə problemlər yaşayır.',
    'Yeni texnologiyalara qarşı marağı çoxdur, bu isə qiymətləndirilməlidir.',
  ];

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
                <FileText size={24} style={{ color: 'var(--primary-color)' }} />
                Fərdi Hesabat
              </h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                Əliyev Cavid • Frontend Developer
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <select style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--border-radius-medium)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--primary-text-color)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--font-size-medium)',
                cursor: 'pointer'
              }}>
                {reportPeriods.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
              
              <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Download size={18} />
                PDF Olaraq Yüklə
              </Button>
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
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
                  <BarChart3 size={20} />
                  Performans Müqayisəsi
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
                    Cədvəl
                  </button>
                  <button style={{ 
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    background: 'var(--primary-color)',
                    border: '1px solid var(--primary-color)',
                    borderRadius: 'var(--border-radius-small)',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    Qrafik
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
                  padding: 'var(--spacing-lg) var(--spacing-lg) var(--spacing-xl) var(--spacing-lg)'
                }}>
                  {[
                    { label: 'Siz', value: 85, color: 'var(--primary-color)' },
                    { label: 'Rəhbər', value: 78, color: 'var(--success-color)' },
                    { label: 'Komanda', value: 82, color: 'var(--error-color)' }
                  ].map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      height: '100%'
                    }}>
                      <div style={{ 
                        width: '40px', 
                        backgroundColor: item.color, 
                        borderRadius: 'var(--border-radius-small)',
                        height: `${item.value}%`,
                        marginBottom: 'var(--spacing-sm)'
                      }} />
                      <span className="text-small text-secondary">{item.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-secondary">Performans müqayisəsi</p>
              </div>
            </Card>
            
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <TrendingUp size={20} />
                Performans Xülasəsi
              </h3>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}>
                {performanceData.map((item, index) => (
                  <div key={index}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: 'var(--spacing-xs)',
                    }}>
                      <span>{item.name}</span>
                      <span style={{ fontWeight: 'bold' }}>{item.value}%</span>
                    </div>
                    <div style={{ 
                      height: '8px',
                      backgroundColor: 'var(--border-color)',
                      borderRadius: 'var(--border-radius-small)',
                      overflow: 'hidden',
                    }}>
                      <div 
                        style={{ 
                          height: '100%',
                          width: `${item.value}%`,
                          backgroundColor: item.value >= 80 
                            ? 'var(--success-color)' 
                            : item.value >= 60 
                              ? 'var(--primary-color)' 
                              : 'var(--error-color)',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
                <TrendingUp size={20} />
                Güclü Tərəflər
              </h3>
              <ul style={{ 
                paddingLeft: 'var(--spacing-xl)',
                margin: 'var(--spacing-md) 0 0 0',
              }}>
                {strengths.map((strength, index) => (
                  <li key={index} style={{ marginBottom: 'var(--spacing-sm)' }}>
                    {strength}
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <TrendingUp size={20} style={{ transform: 'rotate(180deg)' }} />
                Zəif Tərəflər
              </h3>
              <ul style={{ 
                paddingLeft: 'var(--spacing-xl)',
                margin: 'var(--spacing-md) 0 0 0',
              }}>
                {weaknesses.map((weakness, index) => (
                  <li key={index} style={{ marginBottom: 'var(--spacing-sm)' }}>
                    {weakness}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          
          <Card>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <PieChart size={20} />
              Anonim Yazılı Rəylər
            </h3>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-md)',
            }}>
              {feedbacks.map((feedback, index) => (
                <div 
                  key={index} 
                  style={{ 
                    padding: 'var(--spacing-md)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-medium)',
                  }}
                >
                  <p style={{ margin: 0 }}>{feedback}</p>
                </div>
              ))}
            </div>
          </Card>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: 'var(--spacing-lg)' 
          }}>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/report-center')}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
            >
              <BarChart3 size={18} />
              Daha Çox Hesabat Görün
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;