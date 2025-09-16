// DevelopmentPlans.tsx
import React from 'react';
import Card from '../components/Card';
import { Target, Calendar, CheckCircle, Circle } from 'lucide-react';

interface DevelopmentPlansProps {
  data: {
    employee: string;
    plan: string;
    goals: {
      id: number;
      title: string;
      completed: boolean;
      deadline: string;
    }[];
    progress: number;
    startDate: string;
    endDate: string;
  }[];
}

const DevelopmentPlans: React.FC<DevelopmentPlansProps> = ({ data }) => {
  return (
    <Card>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <Target size={20} style={{ color: 'var(--primary-color)' }} />
        Fərdi İnkişaf Planlarının (FİP) İzlənməsi
      </h3>
      <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
        Hər bir komanda üzvü üçün inkişaf planlarının statusunu və irəliləyişini izləmək
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {data.length > 0 ? (
          data.map((plan, index) => (
            <div 
              key={index}
              style={{
                padding: 'var(--spacing-md)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-medium)'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: 'var(--spacing-md)' 
              }}>
                <div>
                  <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{plan.employee}</h4>
                  <p className="text-secondary text-small" style={{ margin: 0 }}>
                    {plan.plan}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p className="text-secondary text-small" style={{ margin: '0 0 var(--spacing-xs) 0' }}>
                    {new Date(plan.startDate).toLocaleDateString('az-AZ')} - {new Date(plan.endDate).toLocaleDateString('az-AZ')}
                  </p>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    İrəliləyiş: {plan.progress}%
                  </p>
                </div>
              </div>
              
              <div style={{ 
                height: '8px',
                backgroundColor: 'var(--border-color)',
                borderRadius: 'var(--border-radius-small)',
                overflow: 'hidden',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div 
                  style={{ 
                    height: '100%',
                    width: `${plan.progress}%`,
                    backgroundColor: plan.progress >= 80 
                      ? 'var(--success-color)' 
                      : plan.progress >= 50 
                        ? 'var(--primary-color)' 
                        : '#FFC107',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {plan.goals.map((goal) => (
                  <div 
                    key={goal.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      padding: 'var(--spacing-xs) 0'
                    }}
                  >
                    {goal.completed ? (
                      <CheckCircle size={18} style={{ 
                        color: 'var(--success-color)', 
                        marginRight: 'var(--spacing-sm)',
                        flexShrink: 0
                      }} />
                    ) : (
                      <Circle size={18} style={{ 
                        color: 'var(--border-color)', 
                        marginRight: 'var(--spacing-sm)',
                        flexShrink: 0
                      }} />
                    )}
                    
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        margin: '0 0 var(--spacing-xs) 0',
                        textDecoration: goal.completed ? 'line-through' : 'none',
                        color: goal.completed ? 'var(--secondary-text-color)' : 'var(--primary-text-color)'
                      }}>
                        {goal.title}
                      </p>
                      <p className="text-secondary text-small" style={{ margin: 0 }}>
                        Son tarix: {new Date(goal.deadline).toLocaleDateString('az-AZ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-xl)', 
            color: 'var(--secondary-text-color)' 
          }}>
            <Target size={48} style={{ margin: '0 auto var(--spacing-md) auto', opacity: 0.3 }} />
            <h3>İnkişaf planı yoxdur</h3>
            <p>Hal-hazırda aktiv inkişaf planı olan işçi yoxdur</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DevelopmentPlans;