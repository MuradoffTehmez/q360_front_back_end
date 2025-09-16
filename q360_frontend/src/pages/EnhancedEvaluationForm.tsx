// EnhancedEvaluationForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, ChevronLeft, ChevronRight, Save, Send, HelpCircle, AlertCircle } from 'lucide-react';
import { EvaluationsService, Evaluation, Question, Answer } from '../services/evaluationsService';

const EnhancedEvaluationForm: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activePage, setActivePage] = useState('evaluation');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  
  // Refs for auto-save functionality
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChangesRef = useRef(false);
  const answersRef = useRef<Record<number, any>>({});

  const handleNavigate = (page: string) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Auto-save functionality
  useEffect(() => {
    // Update refs when answers change
    answersRef.current = answers;
    hasUnsavedChangesRef.current = true;
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer for auto-save (every 30 seconds)
    if (id && Object.keys(answers).length > 0) {
      autoSaveTimerRef.current = setTimeout(async () => {
        if (hasUnsavedChangesRef.current) {
          try {
            // Prepare answers data for saving
            const answersToSave = Object.entries(answersRef.current).map(([questionId, value]) => ({
              question: parseInt(questionId),
              rating: typeof value === 'object' ? value.rating : value,
              comment: typeof value === 'object' ? value.comment : ''
            }));
            
            // Save draft
            const updatedEvaluation = await EvaluationsService.saveDraft(parseInt(id), answersToSave);
            setEvaluation(updatedEvaluation);
            hasUnsavedChangesRef.current = false;
            console.log("Auto-saved at", new Date().toLocaleTimeString());
          } catch (err) {
            console.error("Auto-save failed:", err);
          }
        }
      }, 30000); // 30 seconds
    }
    
    // Cleanup function
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [answers, id]);

  // Fetch evaluation data
  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (id) {
          // Fetch evaluation details
          const evalData = await EvaluationsService.getEvaluation(parseInt(id));
          setEvaluation(evalData);
          
          // Fetch questions for this evaluation
          const questionsData = await EvaluationsService.getEvaluationQuestions(parseInt(id));
          setQuestions(questionsData);
          
          // Fetch existing answers if any
          const answersData = await EvaluationsService.getEvaluationAnswers(parseInt(id));
          const answersMap: Record<number, any> = {};
          answersData.forEach(answer => {
            answersMap[answer.question.id] = {
              rating: answer.rating,
              comment: answer.comment
            };
          });
          setAnswers(answersMap);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load evaluation data');
        console.error('Error fetching evaluation data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) {
      fetchEvaluationData();
    }
  }, [id, user]);

  // Group questions into steps (for demo purposes, we'll group them by competency)
  const steps = questions.reduce((acc: any[], question: Question) => {
    const competencyName = question.competency.name;
    const existingStep = acc.find(step => step.title === competencyName);
    
    if (existingStep) {
      existingStep.questions.push({
        id: question.id,
        text: question.text,
        type: question.text.length > 100 ? 'text' : 'rating',
        required: true,
        helpText: `Please rate ${question.text}`
      });
    } else {
      acc.push({
        title: competencyName,
        questions: [{
          id: question.id,
          text: question.text,
          type: question.text.length > 100 ? 'text' : 'rating',
          required: true,
          helpText: `Please rate ${question.text}`
        }]
      });
    }
    
    return acc;
  }, []);

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      // Prepare answers data for saving
      const answersToSave = Object.entries(answers).map(([questionId, value]) => ({
        question: parseInt(questionId),
        rating: typeof value === 'object' ? value.rating : value,
        comment: typeof value === 'object' ? value.comment : ''
      }));
      
      // Save draft
      const updatedEvaluation = await EvaluationsService.saveDraft(parseInt(id), answersToSave);
      setEvaluation(updatedEvaluation);
      
      // Reset unsaved changes flag
      hasUnsavedChangesRef.current = false;
      
      // Show success message
      alert("Qiymətləndirmə uğurla yadda saxlanıldı!");
    } catch (err: any) {
      alert("Yadda saxlama zamanı xəta baş verdi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    // Check if all required questions are answered
    const currentStepQuestions = steps[currentStep]?.questions || [];
    const requiredQuestions = currentStepQuestions.filter((q: any) => q.required);
    const unansweredRequired = requiredQuestions.some((q: any) => !answers[q.id]);
    
    if (unansweredRequired) {
      alert("Zəhmət olmasa bütün tələb olunan sualları cavablandırın!");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // First save the current answers as draft
      const answersToSave = Object.entries(answers).map(([questionId, value]) => ({
        question: parseInt(questionId),
        rating: typeof value === 'object' ? value.rating : value,
        comment: typeof value === 'object' ? value.comment : ''
      }));
      
      await EvaluationsService.saveDraft(parseInt(id), answersToSave);
      
      // Reset unsaved changes flag
      hasUnsavedChangesRef.current = false;
      
      // Then submit the evaluation
      await EvaluationsService.submitEvaluation(parseInt(id));
      
      alert("Qiymətləndirmə uğurla təqdim edildi!");
      navigate('/dashboard');
    } catch (err: any) {
      alert("Təqdim etmə zamanı xəta baş verdi: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    // Check if all required questions are answered
    const currentStepQuestions = steps[currentStep]?.questions || [];
    const requiredQuestions = currentStepQuestions.filter((q: any) => q.required);
    const unansweredRequired = requiredQuestions.some((q: any) => !answers[q.id]);
    
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
              value={answers[question.id]?.comment || answers[question.id] || ''}
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

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Qiymətləndirmə Forması" />
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Qiymətləndirmə Forması" />
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

  if (!evaluation || steps.length === 0) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Header title="Qiymətləndirmə Forması" />
          <main style={{ 
            flex: 1, 
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--background-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
              <h3 style={{ margin: '0 0 var(--spacing-md) 0' }}>Qiymətləndirmə tapılmadı</h3>
              <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
                Tələb olunan qiymətləndirmə tapılmadı və ya yüklənərkən xəta baş verdi.
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/dashboard')}
              >
                Dashboard-a qayıt
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
                <h2 style={{ margin: '0 0 var(--spacing-sm) 0' }}>{evaluation.cycle.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <User size={16} style={{ color: 'var(--secondary-text-color)' }} />
                    <span>{evaluation.evaluatee.first_name} {evaluation.evaluatee.last_name}</span>
                  </div>
                  <span className="text-secondary">•</span>
                  <span>{evaluation.evaluatee.position}</span>
                  <span className="text-secondary">•</span>
                  <span>{evaluation.evaluatee.department}</span>
                </div>
              </div>
              <div style={{ 
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderRadius: 'var(--border-radius-medium)',
                color: 'var(--primary-color)',
                fontWeight: 500
              }}>
                {new Date(evaluation.cycle.start_date).toLocaleDateString()} - {new Date(evaluation.cycle.end_date).toLocaleDateString()}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              marginBottom: 'var(--spacing-lg)',
              flexWrap: 'wrap'
            }}>
              {steps.map((step: any, index: number) => (
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
                {steps[currentStep]?.title}
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
              {steps[currentStep]?.questions.map((question: any) => (
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