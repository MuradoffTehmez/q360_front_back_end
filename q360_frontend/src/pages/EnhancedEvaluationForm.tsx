// EnhancedEvaluationForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, ChevronLeft, ChevronRight, Save, Send, HelpCircle, AlertCircle } from 'lucide-react';
import { User as UserType } from '../services/AuthService';

interface EnhancedEvaluationFormProps {
  onLogout: () => void;
  currentUser: UserType | null;
}

const EnhancedEvaluationForm: React.FC<EnhancedEvaluationFormProps> = ({ onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('evaluation');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // Mock evaluation data
  const evaluationData = {
    title: "İşçinin Performans Qiymətləndirilməsi",
    subject: "Əliyev Cavid",
    position: "Frontend Developer",
    department: "İT Departamenti",
    period: "01.07.2023 - 30.06.2024"
  };

  // Mock questions
  const steps = [
    {
      title: "Ümumi Performans",
      questions: [
        {
          id: 1,
          text: "İşçinin layihələrdəki ümumi performansı necədir?",
          type: "rating",
          required: true,
          helpText: "İşçinin layihələrdəki dəqiqliyini, vaxtında yerinə yetirməsini və keyfiyyətini qiymətləndirin."
        },
        {
          id: 2,
          text: "İşçinin komanda ilə əməkdaşlıq qabiliyyəti necədir?",
          type: "rating",
          required: true,
          helpText: "İşçinin komanda üzvləri ilə necə əməkdaşlıq etdiyini və kommunikasiya bacarıqlarını qiymətləndirin."
        }
      ]
    },
    {
      title: "Texniki Bacarıqlar",
      questions: [
        {
          id: 3,
          text: "İşçinin proqramlaşdırma bacarıqları necədir?",
          type: "rating",
          required: true,
          helpText: "İşçinin istifadə etdiyi texnologiyalarda necə mütəxəssis olduğunu qiymətləndirin."
        },
        {
          id: 4,
          text: "İşçinin problem həll etmə qabiliyyəti necədir?",
          type: "rating",
          required: true,
          helpText: "İşçinin qarşılaşdığı texniki problemləri necə həll etdiyini qiymətləndirin."
        }
      ]
    },
    {
      title: "İdarəetmə və Liderlik",
      questions: [
        {
          id: 5,
          text: "İşçinin liderlik potensialı varmı?",
          type: "rating",
          required: false,
          helpText: "İşçinin başqalarına təsir etmə qabiliyyətini və liderlik xüsusiyyətlərini qiymətləndirin."
        },
        {
          id: 6,
          text: "İşçinin inisiativlik göstərməsi necədir?",
          type: "rating",
          required: true,
          helpText: "İşçinin işinə inisiativ yanaşdığını və təkliflər verdiyini qiymətləndirin."
        }
      ]
    },
    {
      title: "Əlavə Şərhlər",
      questions: [
        {
          id: 7,
          text: "İşçinin inkişaf etdirilməsi üçün tövsiyələriniz nələrdir?",
          type: "text",
          required: true,
          helpText: "İşçinin performansını artıra biləcək konkret təkliflər verin."
        },
        {
          id: 8,
          text: "İşçinin güclü tərəfləri nələrdir?",
          type: "text",
          required: false,
          helpText: "İşçinin ən yaxşı göstərdiyi sahələri qeyd edin."
        }
      ]
    }
  ];

  const [answers, setAnswers] = useState<Record<number, any>>({});

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      alert("Qiymətləndirmə uğurla yadda saxlanıldı!");
    }, 1000);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Check if all required questions are answered
    const currentStepQuestions = steps[currentStep].questions;
    const requiredQuestions = currentStepQuestions.filter(q => q.required);
    const unansweredRequired = requiredQuestions.some(q => !answers[q.id]);
    
    if (unansweredRequired) {
      alert("Zəhmət olmasa bütün tələb olunan sualları cavablandırın!");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate submit operation
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Qiymətləndirmə uğurla təqdim edildi!");
      navigate('/dashboard');
    }, 1000);
  };

  const nextStep = () => {
    // Check if all required questions are answered
    const currentStepQuestions = steps[currentStep].questions;
    const requiredQuestions = currentStepQuestions.filter(q => q.required);
    const unansweredRequired = requiredQuestions.some(q => !answers[q.id]);
    
    if (unansweredRequired) {
      alert("Zəhmət olmasa bütün tələb olunan sualları cavablandırın!");
      return;
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'rating':
        return (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <label style={{ fontWeight: 500 }}>{question.text}</label>
              {question.helpText && (
                <div 
                  style={{ 
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  <HelpCircle 
                    size={16} 
                    style={{ 
                      color: 'var(--secondary-text-color)',
                      cursor: 'pointer'
                    }} 
                  />
                  <div 
                    className="tooltip"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--primary-text-color)',
                      padding: 'var(--spacing-sm)',
                      borderRadius: 'var(--border-radius-medium)',
                      boxShadow: 'var(--shadow-md)',
                      width: '250px',
                      fontSize: 'var(--font-size-small)',
                      display: 'none',
                      zIndex: 1000
                    }}
                  >
                    {question.helpText}
                  </div>
                </div>
              )}
              {question.required && (
                <span style={{ color: 'var(--error-color)' }}>*</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAnswerChange(question.id, value)}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '2px solid var(--border-color)',
                    backgroundColor: answers[question.id] === value ? 'var(--primary-color)' : 'var(--surface-color)',
                    color: answers[question.id] === value ? 'white' : 'var(--primary-text-color)',
                    fontSize: 'var(--font-size-medium)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!answers[question.id]) {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!answers[question.id]) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-small)',
              color: 'var(--secondary-text-color)'
            }}>
              <span>Pis</span>
              <span>Əla</span>
            </div>
          </div>
        );
      case 'text':
        return (
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              <label style={{ fontWeight: 500 }}>{question.text}</label>
              {question.helpText && (
                <div 
                  style={{ 
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  <HelpCircle 
                    size={16} 
                    style={{ 
                      color: 'var(--secondary-text-color)',
                      cursor: 'pointer'
                    }} 
                  />
                  <div 
                    className="tooltip"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'var(--surface-color)',
                      color: 'var(--primary-text-color)',
                      padding: 'var(--spacing-sm)',
                      borderRadius: 'var(--border-radius-medium)',
                      boxShadow: 'var(--shadow-md)',
                      width: '250px',
                      fontSize: 'var(--font-size-small)',
                      display: 'none',
                      zIndex: 1000
                    }}
                  >
                    {question.helpText}
                  </div>
                </div>
              )}
              {question.required && (
                <span style={{ color: 'var(--error-color)' }}>*</span>
              )}
            </div>
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Cavabınızı burada yazın..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-medium)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--primary-text-color)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--font-size-base)',
                resize: 'vertical'
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={onLogout} 
        currentUser={currentUser}
      />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
        <Header title="Qiymətləndirmə Forması" />
        
        <main style={{ 
          flex: 1, 
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--background-color)',
        }}>
          <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-lg)',
              paddingBottom: 'var(--spacing-lg)',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div>
                <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>{evaluationData.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <User size={16} style={{ color: 'var(--secondary-text-color)' }} />
                    <span>{evaluationData.subject}</span>
                  </div>
                  <span className="text-secondary">•</span>
                  <span>{evaluationData.position}</span>
                  <span className="text-secondary">•</span>
                  <span>{evaluationData.department}</span>
                </div>
              </div>
              <div style={{ 
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderRadius: 'var(--border-radius-medium)',
                color: 'var(--primary-color)',
                fontWeight: 500
              }}>
                {evaluationData.period}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              marginBottom: 'var(--spacing-lg)',
              flexWrap: 'wrap'
            }}>
              {steps.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--border-radius-medium)',
                    border: 'none',
                    backgroundColor: currentStep === index ? 'var(--primary-color)' : 'var(--surface-color)',
                    color: currentStep === index ? 'white' : 'var(--primary-text-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    fontWeight: currentStep === index ? 600 : 400
                  }}
                >
                  {index + 1}. {step.title}
                </button>
              ))}
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)'
            }}>
              <h3 style={{ margin: 0 }}>
                {steps[currentStep].title}
              </h3>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                backgroundColor: 'var(--surface-color)',
                borderRadius: 'var(--border-radius-medium)',
                fontSize: 'var(--font-size-small)'
              }}>
                <span>{currentStep + 1}</span>
                <span className="text-secondary">/</span>
                <span>{steps.length}</span>
              </div>
            </div>
          </Card>
          
          <Card>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              {steps[currentStep].questions.map((question) => (
                <div key={question.id}>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: 'var(--spacing-lg)',
              borderTop: '1px solid var(--border-color)'
            }}>
              <div>
                <Button
                  variant="secondary"
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)' 
                  }}
                >
                  <Save size={16} />
                  {isSaving ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                </Button>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Button
                  variant="secondary"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)' 
                  }}
                >
                  <ChevronLeft size={16} />
                  Geri
                </Button>
                
                {currentStep === steps.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--spacing-sm)' 
                    }}
                  >
                    {isSubmitting ? 'Təqdim edilir...' : 'Təqdim et'}
                    <Send size={16} />
                  </Button>
                ) : (
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
                    <ChevronRight size={16} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EnhancedEvaluationForm;