// ReportCenter.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User } from '../services/AuthService';
import { BarChart3, Download, Filter, Plus, Search, FileText, TrendingUp, Building } from 'lucide-react';

interface ReportCenterProps {
  onLogout: () => void;
  currentUser: User | null;
}

const ReportCenter: React.FC<ReportCenterProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('reports');
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock report templates
  const reportTemplates = [
    { id: 1, name: 'Fərdi Performans Hesabatı', description: 'İşçinin fərdi performansını göstərən detallı hesabat', category: 'Fərdi' },
    { id: 2, name: 'Komanda Performansı', description: 'Komandanın ümumi performansını analiz edən hesabat', category: 'Komanda' },
    { id: 3, name: 'Departament Müqayisəsi', description: 'Fərqli departamentlərin performansını müqayisə edən hesabat', category: 'Departament' },
    { id: 4, name: 'Şirkət Səviyyəli Ümumi Baxış', description: 'Şirkətin ümumi istedad mənzərəsini göstərən hesabat', category: 'Ümumi' }
  ];

  // Mock generated reports
  const generatedReports = [
    { id: 1, name: 'Aylıq Performans Hesabatı - Oktyabr 2023', date: '2023-10-15', author: 'Sistem', status: 'Hazırdır' },
    { id: 2, name: 'Komanda Performansı - İT Departamenti', date: '2023-10-10', author: 'Əliyev Cavid', status: 'Hazırdır' },
    { id: 3, name: 'İndividuallar üzrə Performans Müqayisəsi', date: '2023-10-05', author: 'Məmmədova Leyla', status: 'Hazırdır' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = reportTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                <BarChart3 size={24} style={{ color: 'var(--primary-color)' }} />
                Hesabat Mərkəzi
              </h2>
              <p className="text-secondary" style={{ margin: 0 }}>
                Standart və fərdiləşdirilə bilən hesabatlar
              </p>
            </div>
            
            <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <Plus size={18} />
              Yeni Hesabat Yarat
            </Button>
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
                  <FileText size={20} />
                  Hesabat Şablonları
                </h3>
                
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
                      placeholder="Şablon axtar..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ 
                        paddingLeft: '34px',
                        width: '200px'
                      }}
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      borderRadius: 'var(--border-radius-medium)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--primary-text-color)',
                      fontFamily: 'var(--font-family)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">Bütün Kateqoriyalar</option>
                    <option value="Fərdi">Fərdi</option>
                    <option value="Komanda">Komanda</option>
                    <option value="Departament">Departament</option>
                    <option value="Ümumi">Ümumi</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    style={{ 
                      borderLeft: '4px solid var(--primary-color)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{template.name}</h4>
                        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                          {template.description}
                        </p>
                        <span style={{ 
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--border-radius-small)',
                          backgroundColor: 'rgba(0, 123, 255, 0.1)',
                          color: 'var(--primary-color)',
                          fontSize: 'var(--font-size-small)',
                          fontWeight: 500
                        }}>
                          {template.category}
                        </span>
                      </div>
                      
                      <Button variant="primary" size="small">
                        Yarat
                      </Button>
                    </div>
                  </Card>
                ))}
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
                    <TrendingUp size={20} />
                    Yaradılmış Hesabatlar
                  </h3>
                  
                  <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <Filter size={16} />
                    Filtr
                  </Button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  {generatedReports.map((report) => (
                    <div 
                      key={report.id}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-medium)'
                      }}
                    >
                      <div>
                        <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{report.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                          <span className="text-secondary text-small">
                            {new Date(report.date).toLocaleDateString('az-AZ')}
                          </span>
                          <span className="text-secondary text-small">
                            {report.author}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <span style={{ 
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--border-radius-small)',
                          backgroundColor: 'rgba(40, 167, 69, 0.1)',
                          color: 'var(--success-color)',
                          fontSize: 'var(--font-size-small)',
                          fontWeight: 500
                        }}>
                          {report.status}
                        </span>
                        <Button variant="secondary" size="small" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                          <Download size={16} />
                          Yüklə
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <Building size={20} />
                  Şirkət Səviyyəli Ümumi Baxış
                </h3>
                <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
                  İcraçı direktorlar üçün şirkətin ümumi istedad mənzərəsi
                </p>
                
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-lg)'
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
                      92%
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      Ümumi Məmnuniyyət
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
                      87%
                    </p>
                    <p className="text-secondary text-small" style={{ margin: 0 }}>
                      Performans Artışı
                    </p>
                  </div>
                </div>
                
                <Button variant="primary" fullWidth>
                  Detallı Baxış
                </Button>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportCenter;