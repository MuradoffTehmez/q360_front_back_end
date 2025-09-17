// IdeasBank.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Lightbulb, ThumbsUp, MessageCircle, Search, Filter, Plus, Award, TrendingUp } from 'lucide-react';
import { IdeasService, Idea } from '../services/ideasService';

const IdeasBank: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('ideas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch ideas from backend
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        setError(null);
        const ideasData = await IdeasService.getIdeas();
        setIdeas(ideasData);
      } catch (err: any) {
        setError(err.message || 'Failed to load ideas');
        console.error('Error fetching ideas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchIdeas();
    }
  }, [user]);

  // Handle voting on an idea
  const handleVote = async (ideaId: number) => {
    try {
      const result = await IdeasService.voteOnIdea(ideaId);
      setIdeas(ideas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, likes_count: result.likes_count } 
          : idea
      ));
    } catch (err: any) {
      console.error('Error voting on idea:', err);
      alert('Voting failed: ' + err.message);
    }
  };

  // Filter ideas based on search term
  const filteredIdeas = ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.submitter.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.submitter.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock top contributors data (in a real app, this would come from the API)
  const topContributors = [
    { id: 1, name: 'Əliyev Cavid', ideas: 12, department: 'İT' },
    { id: 2, name: 'Quliyeva Nərgiz', ideas: 9, department: 'Marketinq' },
    { id: 3, name: 'Həsənov Rəşad', ideas: 7, department: 'Ümumi İdarə' }
  ];

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
          <Header title="İdeya Bankı" />
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
          <Header title="İdeya Bankı" />
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
                <Lightbulb size={32} />
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        currentUser={user}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
        <Header title="İdeya Bankı" />
        
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
            
            <Button 
              variant="primary" 
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
              onClick={() => navigate('/submit-idea')}
            >
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                  {filteredIdeas.map((idea) => (
                    <Card key={idea.id} style={{ 
                      borderLeft: '4px solid var(--primary-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                    onClick={() => navigate(`/idea/${idea.id}`)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{idea.title}</h4>
                          <p className="text-secondary" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                            {idea.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <span className="text-small" style={{ fontWeight: 500 }}>
                              {idea.submitter.first_name} {idea.submitter.last_name}
                            </span>
                            <span className="text-small text-secondary">
                              {idea.department?.name || 'Departament təyin edilməyib'}
                            </span>
                            <span className="text-small text-secondary">
                              {new Date(idea.created_at).toLocaleDateString('az-AZ')}
                            </span>
                          </div>
                        </div>
                        
                        <div style={{ 
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--border-radius-small)',
                          backgroundColor: idea.status === 'implemented' 
                            ? 'rgba(40, 167, 69, 0.1)' 
                            : idea.status === 'approved' 
                              ? 'rgba(0, 123, 255, 0.1)' 
                              : 'rgba(255, 193, 7, 0.1)',
                          color: idea.status === 'implemented' 
                            ? 'var(--success-color)' 
                            : idea.status === 'approved' 
                              ? 'var(--primary-color)' 
                              : '#FFC107',
                          fontSize: 'var(--font-size-small)',
                          fontWeight: 500
                        }}>
                          {idea.status === 'implemented' && 'Tətbiq Edilib'}
                          {idea.status === 'approved' && 'Təsdiqlənib'}
                          {idea.status === 'under_review' && 'İncələnir'}
                          {idea.status === 'submitted' && 'Təqdim Edilib'}
                          {idea.status === 'draft' && 'Qaralama'}
                          {idea.status === 'rejected' && 'Rədd Edilib'}
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: 'var(--spacing-lg)', 
                        marginTop: 'var(--spacing-sm)',
                        paddingTop: 'var(--spacing-sm)',
                        borderTop: '1px solid var(--border-color)'
                      }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(idea.id);
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-xs)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--secondary-text-color)',
                            cursor: 'pointer',
                            padding: 'var(--spacing-xs) 0'
                          }}
                        >
                          <ThumbsUp size={16} />
                          <span>{idea.likes_count}</span>
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/idea/${idea.id}`);
                          }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 'var(--spacing-xs)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--secondary-text-color)',
                            cursor: 'pointer',
                            padding: 'var(--spacing-xs) 0'
                          }}
                        >
                          <MessageCircle size={16} />
                          <span>{idea.comments_count}</span>
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
                      {ideas.length}
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
                      {ideas.filter(i => i.status === 'implemented').length}
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
                      {ideas.filter(i => i.status === 'approved').length}
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
                      {ideas.filter(i => i.status === 'under_review').length}
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