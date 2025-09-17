// SubmitIdeaPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { ArrowLeft, Lightbulb, Tag, Building, FileText } from 'lucide-react';
import { IdeasService, NewIdea } from '../services/ideasService';

const SubmitIdeaPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('ideas');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    department: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    category: '',
    department: ''
  });

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      description: '',
      category: '',
      department: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = 'İdea başlığı tələb olunur';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'İdea təsviri tələb olunur';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setError(null);
      
      try {
        const ideaData: NewIdea = {
          title: formData.title,
          description: formData.description
        };

        // Only add category and department if they have values
        if (formData.category) ideaData.category = parseInt(formData.category);
        if (formData.department) ideaData.department = parseInt(formData.department);

        await IdeasService.createIdea(ideaData);
        setSuccess(true);
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          department: ''
        });
      } catch (err: any) {
        setError(err.message || 'İdea təqdim edilərkən xəta baş verdi');
        console.error('Error submitting idea:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar 
          activePage={activePage} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentUser={user}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Yeni İdea Təqdim Et" />
          
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)', maxWidth: '500px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-lg) auto',
                color: 'var(--success-color)'
              }}>
                <Lightbulb size={32} />
              </div>
              
              <h2 style={{ margin: '0 0 var(--spacing-md) 0' }}>İdeanız uğurla təqdim edildi!</h2>
              <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
                Təqdim etdiyiniz idea moderator tərəfindən incələnəcək. Nəticə haqqında bildiriş alacaqsınız.
              </p>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
                <Button 
                  variant="secondary" 
                  onClick={() => setSuccess(false)}
                >
                  Yeni İdea Təqdim Et
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/ideas')}
                >
                  İdeya Bankına Keç
                </Button>
              </div>
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
        <Header title="Yeni İdea Təqdim Et" />
        
        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--background-color)',
        }}>
          <button
            onClick={() => navigate('/ideas')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              padding: 'var(--spacing-sm) 0',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            <ArrowLeft size={16} />
            Geri
          </button>
          
          <Card>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-lg)'
            }}>
              <Lightbulb size={24} style={{ color: 'var(--primary-color)' }} />
              <h2 style={{ margin: 0 }}>Yeni İdea Təqdim Et</h2>
            </div>
            
            <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
              Yeni ideyanızı təqdim edin və şirkətin inkişafına töhfə verin. 
              Təqdim etdiyiniz ideya moderator tərəfindən incələnəcək.
            </p>
            
            {error && (
              <div style={{ 
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                color: 'var(--error-color)',
                borderRadius: 'var(--border-radius-medium)',
                marginBottom: 'var(--spacing-md)',
                fontSize: 'var(--font-size-small)'
              }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="title" style={{ 
                  display: 'block', 
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: 500
                }}>
                  İdea Başlığı
                </label>
                <div style={{ position: 'relative' }}>
                  <Lightbulb size={18} style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--secondary-text-color)'
                  }} />
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    errorMessage={errors.title}
                    placeholder="İdeanızı qısa və aydın şəkildə təsvir edin..."
                    style={{ 
                      paddingLeft: '40px',
                      fontSize: 'var(--font-size-medium)'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="description" style={{ 
                  display: 'block', 
                  marginBottom: 'var(--spacing-xs)',
                  fontWeight: 500
                }}>
                  İdea Təsviri
                </label>
                <div style={{ position: 'relative' }}>
                  <FileText size={18} style={{ 
                    position: 'absolute',
                    left: '12px',
                    top: '12px',
                    color: 'var(--secondary-text-color)'
                  }} />
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="İdeanızı ətraflı şəkildə izah edin. Niyə bu ideya önəmlidir? Necə tətbiq edilə bilər? Hansı faydaları gətirə bilər?"
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-md) 40px',
                      borderRadius: 'var(--border-radius-medium)',
                      border: `1px solid ${errors.description ? 'var(--error-color)' : 'var(--border-color)'}`,
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--primary-text-color)',
                      fontFamily: 'var(--font-family)',
                      fontSize: 'var(--font-size-base)',
                      resize: 'vertical'
                    }}
                  />
                  {errors.description && (
                    <div style={{ 
                      color: 'var(--error-color)', 
                      fontSize: 'var(--font-size-small)', 
                      marginTop: 'var(--spacing-xs)' 
                    }}>
                      {errors.description}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div>
                  <label htmlFor="category" style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)',
                    fontWeight: 500
                  }}>
                    Kateqoriya
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={18} style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--secondary-text-color)'
                    }} />
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px',
                        borderRadius: 'var(--border-radius-medium)',
                        border: `1px solid ${errors.category ? 'var(--error-color)' : 'var(--border-color)'}`,
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--primary-text-color)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)'
                      }}
                    >
                      <option value="">Kateqoriya seçin</option>
                      <option value="1">İş Prosesləri</option>
                      <option value="2">Texnologiya</option>
                      <option value="3">Müştəri Xidməti</option>
                      <option value="4">Ətraf Mühit</option>
                      <option value="5">Digər</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="department" style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)',
                    fontWeight: 500
                  }}>
                    Departament
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Building size={18} style={{ 
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--secondary-text-color)'
                    }} />
                    <select
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px',
                        borderRadius: 'var(--border-radius-medium)',
                        border: `1px solid ${errors.department ? 'var(--error-color)' : 'var(--border-color)'}`,
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--primary-text-color)',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-base)'
                      }}
                    >
                      <option value="">Departament seçin</option>
                      <option value="1">İT Departamenti</option>
                      <option value="2">HR Departamenti</option>
                      <option value="3">Marketinq</option>
                      <option value="4">Ümumi İdarə</option>
                      <option value="5">Maliyyə</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
                style={{ 
                  padding: 'var(--spacing-md)',
                  fontSize: 'var(--font-size-medium)',
                  fontWeight: 600,
                  width: '100%'
                }}
              >
                {loading ? 'Təqdim edilir...' : 'İdeanı Təqdim Et'}
              </Button>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default SubmitIdeaPage;