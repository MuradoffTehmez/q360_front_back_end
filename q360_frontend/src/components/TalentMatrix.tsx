// TalentMatrix.tsx
import React from 'react';
import Card from '../components/Card';

interface TalentMatrixProps {
  data: {
    name: string;
    performance: number;
    potential: number;
    quadrant: string;
  }[];
}

const TalentMatrix: React.FC<TalentMatrixProps> = ({ data }) => {
  // Define quadrants
  const quadrants = [
    { id: '1', name: 'Yüksək Potensial, Yüksək Performans', color: 'rgba(40, 167, 69, 0.1)', textColor: 'var(--success-color)' },
    { id: '2', name: 'Yüksək Potensial, Orta Performans', color: 'rgba(255, 193, 7, 0.1)', textColor: '#FFC107' },
    { id: '3', name: 'Orta Potensial, Yüksək Performans', color: 'rgba(0, 123, 255, 0.1)', textColor: 'var(--primary-color)' },
    { id: '4', name: 'Orta Potensial, Orta Performans', color: 'rgba(108, 117, 125, 0.1)', textColor: 'var(--secondary-text-color)' }
  ];

  // Group employees by quadrant
  const groupedData = quadrants.map(quadrant => ({
    ...quadrant,
    employees: data.filter(emp => emp.quadrant === quadrant.id)
  }));

  return (
    <Card>
      <h3>İstedadların Müqayisəli Analizi (Talent Matrix - 9-Box Grid)</h3>
      <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
        Komanda üzvlərinin potensialına və performansına görə yerləşməsi
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        {groupedData.map((quadrant) => (
          <div 
            key={quadrant.id}
            style={{
              border: `2px dashed ${quadrant.textColor}`,
              borderRadius: 'var(--border-radius-medium)',
              padding: 'var(--spacing-md)',
              backgroundColor: quadrant.color,
              minHeight: '150px'
            }}
          >
            <h4 style={{ 
              margin: '0 0 var(--spacing-sm) 0', 
              color: quadrant.textColor,
              fontSize: 'var(--font-size-medium)'
            }}>
              {quadrant.name}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              {quadrant.employees.length > 0 ? (
                quadrant.employees.map((employee) => (
                  <div 
                    key={employee.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 'var(--spacing-xs)',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: 'var(--border-radius-small)'
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{employee.name}</span>
                    <span>
                      P: {employee.performance}/10, Pot: {employee.potential}/10
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-secondary text-small" style={{ margin: 0, fontStyle: 'italic' }}>
                  Hələlik işçi yoxdur
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            border: '1px solid var(--success-color)'
          }} />
          <span className="text-small">Yüksək Performans</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #FFC107'
          }} />
          <span className="text-small">Orta Performans</span>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 'var(--spacing-xl)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{ 
            width: '40px', 
            height: '20px', 
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            border: '1px solid var(--primary-color)'
          }} />
          <span className="text-small">Yüksək Potensial</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{ 
            width: '40px', 
            height: '20px', 
            backgroundColor: 'rgba(108, 117, 125, 0.1)',
            border: '1px solid var(--secondary-text-color)'
          }} />
          <span className="text-small">Orta Potensial</span>
        </div>
      </div>
    </Card>
  );
};

export default TalentMatrix;