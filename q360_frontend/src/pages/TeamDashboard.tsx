// TeamDashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import TalentMatrix from '../components/TalentMatrix';
import RiskIndicators from '../components/RiskIndicators';
import DevelopmentPlans from '../components/DevelopmentPlans';
import { User } from '../services/AuthService';
import { Users, TrendingUp, CheckCircle, Clock, Award } from 'lucide-react';

interface TeamDashboardProps {
  onLogout: () => void;
  currentUser: User | null;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('team');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock team data
  const teamStats = {
    averageScore: 82,
    totalMembers: 12,
    activeEvaluations: 8,
  };

  const teamMembers = [
    { id: 1, name: 'Əliyev Cavid', position: 'Frontend Developer', score: 85, status: 'Tamamlandı' },
    { id: 2, name: 'Məmmədova Leyla', position: 'Backend Developer', score: 78, status: 'Davam edir' },
    { id: 3, name: 'Həsənov Rəşad', position: 'UI/UX Designer', score: 92, status: 'Tamamlandı' },
    { id: 4, name: 'Quliyeva Nərgiz', position: 'QA Engineer', score: 88, status: 'Tamamlandı' },
    { id: 5, name: 'İsmayılov Elşən', position: 'DevOps Engineer', score: 75, status: 'Davam edir' },
    { id: 6, name: 'Əbdülrəhmanova Gülnarə', position: 'Product Manager', score: 89, status: 'Tamamlandı' },
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
              <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Komanda Paneli</h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                İT Departamenti
              </p>
            </div>
            
            <Button variant="primary">
              Yeni Üzv Əlavə Et
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
                <TrendingUp size={24} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                Orta Skor
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-xxl)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-sm) 0',
                color: 'var(--primary-color)'
              }}>
                {teamStats.averageScore}%
              </p>
              <p className="text-secondary" style={{ margin: 0 }}>
                Komanda üzvlərinin orta qiyməti
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
                <Users size={24} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                Komanda Üzvləri
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-xxl)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-sm) 0',
                color: 'var(--success-color)'
              }}>
                {teamStats.totalMembers}
              </p>
              <p className="text-secondary" style={{ margin: 0 }}>
                Ümumi komanda üzvləri
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
                <Clock size={24} />
              </div>
              <h3 style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--primary-text-color)' }}>
                Aktiv Qiymətləndirmələr
              </h3>
              <p style={{ 
                fontSize: 'var(--font-size-xxl)', 
                fontWeight: 'bold', 
                margin: '0 0 var(--spacing-sm) 0',
                color: '#FFC107'
              }}>
                {teamStats.activeEvaluations}
              </p>
              <p className="text-secondary" style={{ margin: 0 }}>
                Davam edən qiymətləndirmələr
              </p>
            </Card>
          </div>
          
          <Card>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-lg)',
            }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Users size={20} />
                Komanda Üzvləri
              </h3>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <input 
                  type="text" 
                  placeholder="Axtar..." 
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--border-radius-medium)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--primary-text-color)',
                    fontFamily: 'var(--font-family)',
                  }}
                />
                <Button variant="secondary">
                  Filtr
                </Button>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Ad</th>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Vəzifə</th>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Skor</th>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Status</th>
                    <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr 
                      key={member.id} 
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
                            {member.name.charAt(0)}
                          </div>
                          {member.name}
                        </div>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)' }}>{member.position}</td>
                      <td style={{ padding: 'var(--spacing-md)' }}>
                        <span style={{ fontWeight: 'bold' }}>{member.score}%</span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)' }}>
                        <span 
                          style={{ 
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            borderRadius: 'var(--border-radius-small)',
                            backgroundColor: member.status === 'Tamamlandı' 
                              ? 'rgba(40, 167, 69, 0.1)' 
                              : 'rgba(0, 123, 255, 0.1)',
                            color: member.status === 'Tamamlandı' 
                              ? 'var(--success-color)' 
                              : 'var(--primary-color)',
                            fontSize: 'var(--font-size-small)',
                          }}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td style={{ padding: 'var(--spacing-md)' }}>
                        <Button variant="secondary" size="small">
                          Detallı Bax
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <TalentMatrix 
            data={[
              { name: 'Əliyev Cavid', performance: 9, potential: 8, quadrant: '1' },
              { name: 'Məmmədova Leyla', performance: 7, potential: 9, quadrant: '2' },
              { name: 'Həsənov Rəşad', performance: 8, potential: 6, quadrant: '3' },
              { name: 'Quliyeva Nərgiz', performance: 6, potential: 7, quadrant: '4' },
              { name: 'İsmayılov Elşən', performance: 8, potential: 8, quadrant: '1' }
            ]}
          />
          
          <RiskIndicators 
            data={[
              { 
                employee: 'Quliyeva Nərgiz', 
                riskLevel: 'medium', 
                indicators: ['Az fəaliyyət', 'Gecikən cavablar', 'Az daxilolmalar'], 
                lastUpdate: '2023-10-15' 
              },
              { 
                employee: 'Həsənov Rəşad', 
                riskLevel: 'low', 
                indicators: ['Orta fəaliyyət', 'Normal cavablar'], 
                lastUpdate: '2023-10-14' 
              }
            ]}
          />
          
          <DevelopmentPlans 
            data={[
              { 
                employee: 'Əliyev Cavid',
                plan: 'Frontend Gelişimi',
                goals: [
                  { id: 1, title: 'React Hooks öyrənmək', completed: true, deadline: '2023-11-01' },
                  { id: 2, title: 'TypeScript sertifikatı əldə etmək', completed: false, deadline: '2023-12-15' },
                  { id: 3, title: 'Yeni layihədə liderlik etmək', completed: false, deadline: '2024-01-30' }
                ],
                progress: 33,
                startDate: '2023-10-01',
                endDate: '2024-03-31'
              },
              { 
                employee: 'Məmmədova Leyla',
                plan: 'Backend Arxitektura',
                goals: [
                  { id: 1, title: 'Microservices öyrənmək', completed: true, deadline: '2023-10-30' },
                  { id: 2, title: 'Cloud arxitektura sertifikatı', completed: false, deadline: '2023-12-20' },
                  { id: 3, title: 'CI/CD proseslərini tətbiq etmək', completed: false, deadline: '2024-02-15' }
                ],
                progress: 33,
                startDate: '2023-09-15',
                endDate: '2024-03-15'
              }
            ]}
          />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--spacing-lg)',
            marginTop: 'var(--spacing-lg)',
          }}>
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <TrendingUp size={20} />
                Komanda Səlahiyyət Analizi
              </h3>
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
                  {[
                    { label: 'İş Performansı', value: 85, color: 'var(--primary-color)' },
                    { label: 'Komanda İşləri', value: 92, color: 'var(--success-color)' },
                    { label: 'İnkişaf', value: 78, color: 'var(--error-color)' },
                    { label: 'Ümumi', value: 85, color: '#FFC107' }
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
                <p className="text-secondary">Komanda səlahiyyət analizi</p>
              </div>
            </Card>
            
            <Card>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Award size={20} />
                Ən Yaxşı Performans
              </h3>
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
              }}>
                {teamMembers
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 3)
                  .map((member, index) => (
                    <div 
                      key={member.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: 'var(--spacing-sm)',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: index === 0 
                          ? 'var(--primary-color)' 
                          : 'var(--border-color)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        marginRight: 'var(--spacing-md)',
                        fontSize: 'var(--font-size-small)'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: '500' }}>
                          {member.name}
                        </p>
                        <p className="text-secondary text-small" style={{ margin: 0 }}>
                          {member.score}%
                        </p>
                      </div>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--success-color)'
                      }}>
                        <CheckCircle size={18} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamDashboard;