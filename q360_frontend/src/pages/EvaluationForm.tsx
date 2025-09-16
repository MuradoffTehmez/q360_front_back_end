// EvaluationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { User } from '../services/AuthService';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface EvaluationFormProps {
  onLogout: () => void;
  currentUser: User | null;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('evaluation');
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

  // Mock evaluation data
  const employee = {
    name: 'Məmmədov Cavid',
    position: 'Frontend Developer',
    department: 'İT Departamenti',
  };

  const categories = [
    {
      id: 1,
      name: 'İş Performansı',
      questions: [
        { id: 1, text: 'Tapşırıqları vaxtında yerinə yetirir' },
        { id: 2, text: 'Keyfiyyətli iş təqdim edir' },
        { id: 3, text: 'Problemləri müstəqil həll edir' },
      ]
    },
    {
      id: 2,
      name: 'Komanda İşləri',
      questions: [
        { id: 4, text: 'Komanda üzvləri ilə effektiv əməkdaşlıq edir' },
        { id: 5, text: 'Məsuliyyətli davranır' },
      ]
    },
    {
      id: 3,
      name: 'İnkişaf',
      questions: [
        { id: 6, text: 'Yeni texnologiyaları öyrənir' },
        { id: 7, text: 'Özünü inkişaf etdirməyə çalışır' },
      ]
    }
  ];

  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [comments, setComments] = useState('');

  const handleRatingChange = (questionId: number, rating: number) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleSubmit = () => {
    // Submit evaluation logic would go here
    console.log('Evaluation submitted:', { ratings, comments });
    alert('Qiymətləndirmə uğurla göndərildi!');
    navigate('/dashboard');
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
                <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>Qiymətləndirmə Forması</h2>
                <p className="text-secondary" style={{ margin: 0 }}>
                  {employee.name} • {employee.position}
                </p>
              </div>
              
              <div style={{ 
                textAlign: 'right',
                padding: 'var(--spacing-md)',
                background: 'rgba(0, 123, 255, 0.05)',
                borderRadius: 'var(--border-radius-medium)'
              }}>
                <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>Qiymətləndirmə dövrü:</p>
                <p style={{ margin: 0, color: 'var(--primary-color)' }}>İyul 2023 - İyul 2024</p>
              </div>
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
            
            {/* Form content */}
            <div>
              {categories.map((category) => (
                <div key={category.id} style={{ marginBottom: 'var(--spacing-xl)' }}>
                  <h3 style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)'
                  }}>
                    {category.name}
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {category.questions.map((question) => (
                      <div key={question.id}>
                        <p style={{ margin: '0 0 var(--spacing-sm) 0' }}>{question.text}</p>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => handleRatingChange(question.id, value)}
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                border: '2px solid',
                                borderColor: ratings[question.id] === value 
                                  ? 'var(--primary-color)' 
                                  : 'var(--border-color)',
                                backgroundColor: ratings[question.id] === value 
                                  ? 'var(--primary-color)' 
                                  : 'transparent',
                                color: ratings[question.id] === value 
                                  ? 'white' 
                                  : 'var(--primary-text-color)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
                  Şərh (istəyə bağlı)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-medium)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--primary-text-color)',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size-base)',
                    resize: 'vertical'
                  }}
                  placeholder="Əlavə şərhlərinizi buraya yazın..."
                />
              </div>
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
                  Göndər
                  <ChevronRight size={18} />
                </Button>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EvaluationForm;