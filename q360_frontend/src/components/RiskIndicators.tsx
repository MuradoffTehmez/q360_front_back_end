// RiskIndicators.tsx
import React from 'react';
import Card from '../components/Card';
import { AlertTriangle, TrendingDown, Clock, MessageSquare } from 'lucide-react';

interface RiskIndicatorsProps {
  data: {
    employee: string;
    riskLevel: 'low' | 'medium' | 'high';
    indicators: string[];
    lastUpdate: string;
  }[];
}

const RiskIndicators: React.FC<RiskIndicatorsProps> = ({ data }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--error-color)', icon: <AlertTriangle size={16} /> };
      case 'medium': return { bg: 'rgba(255, 193, 7, 0.1)', color: '#FFC107', icon: <AlertTriangle size={16} /> };
      case 'low': return { bg: 'rgba(40, 167, 69, 0.1)', color: 'var(--success-color)', icon: <AlertTriangle size={16} /> };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--secondary-text-color)', icon: <AlertTriangle size={16} /> };
    }
  };

  return (
    <Card>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <AlertTriangle size={20} style={{ color: 'var(--error-color)' }} />
        Risklərin Erkən Müəyyən Edilməsi
      </h3>
      <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
        Süni intellektə əsaslanan sentiment analizi ilə motivasiya düşüşü riskləri
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {data.length > 0 ? (
          data.map((risk, index) => {
            const riskStyle = getRiskColor(risk.riskLevel);
            
            return (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  padding: 'var(--spacing-md)',
                  border: `1px solid ${riskStyle.color}`,
                  borderRadius: 'var(--border-radius-medium)',
                  backgroundColor: riskStyle.bg
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: riskStyle.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: riskStyle.color,
                  marginRight: 'var(--spacing-md)',
                  flexShrink: 0
                }}>
                  {riskStyle.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: 'var(--spacing-xs)' 
                  }}>
                    <h4 style={{ margin: 0, fontWeight: 500 }}>{risk.employee}</h4>
                    <span style={{ 
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      borderRadius: 'var(--border-radius-small)',
                      backgroundColor: riskStyle.bg,
                      color: riskStyle.color,
                      fontSize: 'var(--font-size-small)',
                      fontWeight: 500
                    }}>
                      {risk.riskLevel === 'high' ? 'Yüksək Risk' : 
                       risk.riskLevel === 'medium' ? 'Orta Risk' : 'Aşağı Risk'}
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 'var(--spacing-xs)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {risk.indicators.map((indicator, idx) => (
                      <span 
                        key={idx}
                        style={{
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          borderRadius: 'var(--border-radius-small)',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                          fontSize: 'var(--font-size-small)'
                        }}
                      >
                        {indicator}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-secondary text-small" style={{ margin: 0 }}>
                    Son yeniləmə: {new Date(risk.lastUpdate).toLocaleDateString('az-AZ')}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-xl)', 
            color: 'var(--secondary-text-color)' 
          }}>
            <AlertTriangle size={48} style={{ margin: '0 auto var(--spacing-md) auto', opacity: 0.3 }} />
            <h3>Risk yoxdur</h3>
            <p>Hal-hazırda motivasiya düşüşü riski olan işçi yoxdur</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RiskIndicators;