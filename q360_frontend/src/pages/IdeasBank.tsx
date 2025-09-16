// IdeasBank.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User } from '../services/AuthService';
import { Lightbulb, ThumbsUp, MessageCircle, Search, Filter, Plus, Award, TrendingUp } from 'lucide-react';

interface IdeasBankProps {
  onLogout: () => void;
  currentUser: User | null;
}

const IdeasBank: React.FC<IdeasBankProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('ideas');
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock ideas data
  const ideas = [
    {
      id: 1,
      title: 'Remote Work Policy Improvement',
      description: 'Enhance our remote work policies to increase productivity and work-life balance.',
      author: 'Əliyev Cavid',
      department: 'İT Departamenti',
      likes: 24,
      comments: 8,
      date: '2023-10-15',
      status: 'Under Review'
    },
    {
      id: 2,
      title: 'New Employee Onboarding Program',
      description: 'Create a more comprehensive onboarding program for new hires.',
      author: 'Məmmədova Leyla',
      department: 'HR Departamenti',
      likes: 18,
      comments: 5,
      date: '2023-10-10',
      status: 'Approved'
    },
    {
      id: 3,
      title: 'Office Sustainability Initiative',
      description: 'Implement eco-friendly practices in our office spaces.',
      author: 'Həsənov Rəşad',
      department: 'Ümumi İdarə',
      likes: 32,
      comments: 12,
      date: '2023-10-05',
      status: 'Implemented'
    },
    {
      id: 4,
      title: 'Flexible Working Hours',
      description: 'Introduce flexible working hours to improve work-life balance.',
      author: 'Quliyeva Nərgiz',
      department: 'Marketinq',
      likes: 41,
      comments: 15,
      date: '2023-09-28',
      status: 'Under Review'
    }
  ];

  const topContributors = [
    { id: 1, name: 'Əliyev Cavid', ideas: 12, department: 'İT' },
    { id: 2, name: 'Quliyeva Nərgiz', ideas: 9, department: 'Marketinq' },
    { id: 3, name: 'Həsənov Rəşad', ideas: 7, department: 'Ümumi İdarə' }
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
                <Lightbulb size={24} style={{ color: 'var(--primary-color)' }} />
                İdeya Bankı
              </h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                Yeni ideyalarınızı paylaşın və şirkətin inkişafına töhfə verin
              </p>
            </div>
            
            <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Plus size={18} />
              Yeni İdea Təqdim Et
            </Button>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <div>
              <Card>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 'var(--spacing-lg)',
                }}>
                  <h3>Ən Son İdeyalar</h3>
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
                        placeholder="İdeya axtar..." 
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
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {ideas.map((idea) => (
                    <Card key={idea.id} style={{ 
                      borderLeft: '4px solid var(--primary-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{idea.title}</h4>
                          <p className="text-secondary" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                            {idea.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <span className="text-small" style={{ fontWeight: 500 }}>
                              {idea.author}
                            </span>
                            <span className="text-small text-secondary">
                              {idea.department}
                            </span>
                            <span className="text-small text-secondary">
                              {new Date(idea.date).toLocaleDateString('az-AZ')}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ 
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--border-radius-small)',
                          backgroundColor: idea.status === 'Implemented' 
                            ? 'rgba(40, 167, 69, 0.1)' 
                            : idea.status === 'Approved' 
                              ? 'rgba(0, 123, 255, 0.1)' 
                              : 'rgba(255, 193, 7, 0.1)',
                          color: idea.status === 'Implemented' 
                            ? 'var(--success-color)' 
                            : idea.status === 'Approved' 
                              ? 'var(--primary-color)' 
                              : '#FFC107',
                          fontSize: 'var(--font-size-small)',
                          fontWeight: 500
                        }}>
                          {idea.status}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--spacing-lg)', 
                        marginTop: 'var(--spacing-sm)',
                        paddingTop: 'var(--spacing-sm)',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <button style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--spacing-xs)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--secondary-text-color)',
                          cursor: 'pointer',
                          padding: 'var(--spacing-xs) 0'
                        }}>
                          <ThumbsUp size={16} />
                          <span>{idea.likes}</span>
                        </button>
                        
                        <button style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 'var(--spacing-xs)',
                          background: 'none',
                          border: 'none',
                          color: 'var(--secondary-text-color)',
                          cursor: 'pointer',
                          padding: 'var(--spacing-xs) 0'
                        }}>
                          <MessageCircle size={16} />
                          <span>{idea.comments}</span>
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Award size={20} />
                  Ən Aktiv İştirakçılar
                </h3>
                
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-md)'
                }}>
                  {topContributors.map((contributor, index) => (
                    <div 
                      key={contributor.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: 'var(--spacing-sm) 0',
                        borderBottom: index < topContributors.length - 1 ? '1px solid var(--border-color)' : 'none'
                      }}
                    >
                      <div style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        backgroundColor: index === 0 
                          ? 'var(--primary-color)' 
                          : index === 1 
                            ? 'var(--success-color)' 
                            : 'var(--error-color)',
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
                        <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
                          {contributor.name}
                        </p>
                        <p className="text-secondary text-small" style={{ margin: 0 }}>
                          {contributor.ideas} idea • {contributor.department}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <TrendingUp size={20} />
                  Statistikalar
                </h3>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-md)',
                  marginTop: 'var(--spacing-md)'
                }}>
                  <div style={{ 
                    textAlign: 'center',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(0, 123, 255, 0.05)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p style={{ 
                      margin: '0 0 var(--spacing-xs) 0', 
                      fontSize: 'var(--font-size-xl)', 
                      fontWeight: 'bold',
                      color: 'var(--primary-color)'
                    }}>
                      42
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      Ümumi İdea
                    </p>
                  </div>
                  
                  <div style={{ 
                    textAlign: 'center',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(40, 167, 69, 0.05)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p style={{ 
                      margin: '0 0 var(--spacing-xs) 0', 
                      fontSize: 'var(--font-size-xl)', 
                      fontWeight: 'bold',
                      color: 'var(--success-color)'
                    }}>
                      18
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      Tətbiq Edilən
                    </p>
                  </div>
                  
                  <div style={{ 
                    textAlign: 'center',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(255, 193, 7, 0.05)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p style={{ 
                      margin: '0 0 var(--spacing-xs) 0', 
                      fontSize: 'var(--font-size-xl)', 
                      fontWeight: 'bold',
                      color: '#FFC107'
                    }}>
                      7
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      Təsdiqlənən
                    </p>
                  </div>
                  
                  <div style={{ 
                    textAlign: 'center',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(108, 117, 125, 0.05)',
                    borderRadius: 'var(--border-radius-medium)'
                  }}>
                    <p style={{ 
                      margin: '0 0 var(--spacing-xs) 0', 
                      fontSize: 'var(--font-size-xl)', 
                      fontWeight: 'bold',
                      color: 'var(--secondary-text-color)'
                    }}>
                      3
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      İncələnən
                    </p>
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

export default IdeasBank;