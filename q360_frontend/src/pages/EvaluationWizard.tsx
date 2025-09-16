// EvaluationWizard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User } from '../services/AuthService';
import { ChevronLeft, ChevronRight, Save, Users, Settings, Calendar } from 'lucide-react';

interface EvaluationWizardProps {
  onLogout: () => void;
  currentUser: User | null;
}

const EvaluationWizard: React.FC<EvaluationWizardProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('admin');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    participants: [] as string[],
    anonymous: true,
    selfEvaluation: true,
    peerEvaluation: true,
    managerEvaluation: true,
  });

  const participants = [
    'Əliyev Cavid',
    'Məmmədova Leyla',
    'Həsənov Rəşad',
    'Quliyeva Nərgiz',
    'İsmayılov Elşən',
    'Əbdülrəhmanova Gülnarə',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParticipantToggle = (participant: string) => {
    setFormData(prev => {
      const newParticipants = prev.participants.includes(participant)
        ? prev.participants.filter(p => p !== participant)
        : [...prev.participants, participant];
      
      return {
        ...prev,
        participants: newParticipants
      };
    });
  };

  const handleSubmit = () => {
    // Submit evaluation cycle logic would go here
    console.log('Evaluation cycle created:', formData);
    alert('Qiymətləndirmə dövrü uğurla yaradıldı!');
    navigate('/admin');
  };

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
          <Card>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-lg)',
            }}>
              <div>
                <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Yeni Qiymətləndirmə Dövrü</h2>
                <p className="text-secondary" style={{ margin: 0 }}>
                  Yeni qiymətləndirmə dövrü yaradın
              </p>
              </div>
              
              <Button 
                variant="secondary" 
                onClick={() => navigate('/admin')}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
              >
                Ləğv et
              </Button>
            </div>
            
            {/* Progress bar */}
            <div style={{ 
              marginBottom: 'var(--spacing-xl)',
              padding: '0 var(--spacing-md)',
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
              }}>
                <span className="text-medium">Addım {currentStep} / {totalSteps}</span>
                <span className="text-medium">{Math.round((currentStep / totalSteps) * 100)}% tamamlandı</span>
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
                    width: `${(currentStep / totalSteps) * 100}%`,
                    backgroundColor: 'var(--primary-color)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
            
            {/* Wizard steps */}
            <div>
              {currentStep === 1 && (
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Calendar size={20} />
                    Əsas Məlumatlar
                  </h3>
                  <p className="text-secondary">
                    Qiymətləndirmə dövrü üçün əsas məlumatları daxil edin
                  </p>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-lg)',
                    marginTop: 'var(--spacing-lg)',
                  }}>
                    <div>
                      <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                        Qiymətləndirmə Adı
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="İlkin qiymətləndirmə"
                      />
                    </div>
                    
                    <div>
                      <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                        Qiymətləndirmə Dövrü
                      </label>
                      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleInputChange}
                        />
                        <Input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Users size={20} />
                    İştirakçı Seçimi
                  </h3>
                  <p className="text-secondary">
                    Bu qiymətləndirmə dövrünə iştirak edəcək şəxsləri seçin
                  </p>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-md)',
                    marginTop: 'var(--spacing-lg)',
                  }}>
                    {participants.map((participant, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          padding: 'var(--spacing-sm)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-medium)',
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`participant-${index}`}
                          checked={formData.participants.includes(participant)}
                          onChange={() => handleParticipantToggle(participant)}
                          style={{ 
                            marginRight: 'var(--spacing-sm)',
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <label htmlFor={`participant-${index}`} style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: 'var(--spacing-sm)'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 'var(--font-size-small)'
                          }}>
                            {participant.charAt(0)}
                          </div>
                          {participant}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Settings size={20} />
                    Parametrlər
                  </h3>
                  <p className="text-secondary">
                    Qiymətləndirmə parametrlərini təyin edin
                  </p>
                  
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-lg)',
                    marginTop: 'var(--spacing-lg)',
                  }}>
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                      }}>
                        <input
                          type="checkbox"
                          id="anonymous"
                          name="anonymous"
                          checked={formData.anonymous}
                          onChange={handleInputChange}
                          style={{ 
                            marginRight: 'var(--spacing-sm)',
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <label htmlFor="anonymous">Anonim qiymətləndirmə</label>
                      </div>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        Qiymətləndirənlərin şəxsiyyəti gizli olacaq
                      </p>
                    </div>
                    
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                      }}>
                        <input
                          type="checkbox"
                          id="selfEvaluation"
                          name="selfEvaluation"
                          checked={formData.selfEvaluation}
                          onChange={handleInputChange}
                          style={{ 
                            marginRight: 'var(--spacing-sm)',
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <label htmlFor="selfEvaluation">Özünü qiymətləndirmə</label>
                      </div>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        İştirakçılar özünü qiymətləndirə biləcək
                      </p>
                    </div>
                    
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                      }}>
                        <input
                          type="checkbox"
                          id="peerEvaluation"
                          name="peerEvaluation"
                          checked={formData.peerEvaluation}
                          onChange={handleInputChange}
                          style={{ 
                            marginRight: 'var(--spacing-sm)',
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <label htmlFor="peerEvaluation">Həmkar qiymətləndirmə</label>
                      </div>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        Komanda üzvləri bir-birini qiymətləndirəcək
                      </p>
                    </div>
                    
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-sm)',
                      }}>
                        <input
                          type="checkbox"
                          id="managerEvaluation"
                          name="managerEvaluation"
                          checked={formData.managerEvaluation}
                          onChange={handleInputChange}
                          style={{ 
                            marginRight: 'var(--spacing-sm)',
                            accentColor: 'var(--primary-color)'
                          }}
                        />
                        <label htmlFor="managerEvaluation">Rəhbər qiymətləndirmə</label>
                      </div>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        Rəhbərlər özəl qiymətləndirmə edəcək
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Save size={20} />
                    Xülasə
                  </h3>
                  <p className="text-secondary">
                    Qiymətləndirmə dövrü məlumatlarını yoxlayın və başlatmaq üçün təsdiqləyin
                  </p>
                  
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4>Əsas Məlumatlar</h4>
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-md)',
                    }}>
                      <div>
                        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-xs) 0' }}>Ad</p>
                        <p style={{ margin: 0, fontWeight: 500 }}>{formData.name || 'Təyin edilməyib'}</p>
                      </div>
                      
                      <div>
                        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-xs) 0' }}>Dövr</p>
                        <p style={{ margin: 0, fontWeight: 500 }}>
                          {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Təyin edilməyib'} - 
                          {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Təyin edilməyib'}
                        </p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4>İştirakçılar ({formData.participants.length})</h4>
                    <div style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--spacing-sm)',
                      marginTop: 'var(--spacing-sm)'
                    }}>
                      {formData.participants.length > 0 ? (
                        formData.participants.map((participant, index) => (
                          <span 
                            key={index}
                            style={{ 
                              padding: 'var(--spacing-xs) var(--spacing-sm)',
                              backgroundColor: 'var(--primary-color)',
                              color: 'white',
                              borderRadius: 'var(--border-radius-small)',
                              fontSize: 'var(--font-size-small)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 'var(--spacing-xs)'
                            }}
                          >
                            <div style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 255, 255, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '10px'
                            }}>
                              {participant.charAt(0)}
                            </div>
                            {participant}
                          </span>
                        ))
                      ) : (
                        <p className="text-secondary">İştirakçı seçilməyib</p>
                      )}
                    </div>
                  </Card>
                  
                  <Card style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4>Parametrlər</h4>
                    <div style={{ 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 'var(--spacing-md)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: formData.anonymous ? 'var(--success-color)' : 'var(--error-color)',
                          marginRight: 'var(--spacing-sm)',
                        }} />
                        <span>Anonim qiymətləndirmə</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: formData.selfEvaluation ? 'var(--success-color)' : 'var(--error-color)',
                          marginRight: 'var(--spacing-sm)',
                        }} />
                        <span>Özünü qiymətləndirmə</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: formData.peerEvaluation ? 'var(--success-color)' : 'var(--error-color)',
                          marginRight: 'var(--spacing-sm)',
                        }} />
                        <span>Həmkar qiymətləndirmə</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: formData.managerEvaluation ? 'var(--success-color)' : 'var(--error-color)',
                          marginRight: 'var(--spacing-sm)',
                        }} />
                        <span>Rəhbər qiymətləndirmə</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: 'var(--spacing-xl)',
            }}>
              <Button 
                variant="secondary" 
                onClick={prevStep} 
                disabled={currentStep === 1}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-sm)' 
                }}
              >
                <ChevronLeft size={18} />
                Geri
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  variant="primary" 
                  onClick={nextStep}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)' 
                  }}
                >
                  Növbəti
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleSubmit}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)' 
                  }}
                >
                  Başlat
                  <Save size={18} />
                </Button>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EvaluationWizard;