// SystemHealthMonitor.tsx
import React from 'react';
import Card from '../components/Card';
import { Activity, Database, Wifi, Server, AlertTriangle } from 'lucide-react';

interface SystemHealthMonitorProps {
  data: {
    metric: string;
    value: number;
    status: 'healthy' | 'warning' | 'critical';
    icon: React.ReactNode;
  }[];
}

const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({ data }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return { bg: 'rgba(40, 167, 69, 0.1)', color: 'var(--success-color)' };
      case 'warning': return { bg: 'rgba(255, 193, 7, 0.1)', color: '#FFC107' };
      case 'critical': return { bg: 'rgba(220, 53, 69, 0.1)', color: 'var(--error-color)' };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', color: 'var(--secondary-text-color)' };
    }
  };

  return (
    <Card>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <Activity size={20} style={{ color: 'var(--primary-color)' }} />
        Sistem Sağlamlığı Monitorinqi
      </h3>
      <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
        Real vaxt rejimində kritik sistem göstəricilərinin izlənməsi
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: 'var(--spacing-md)' 
      }}>
        {data.map((item, index) => {
          const statusStyle = getStatusColor(item.status);
          
          return (
            <div 
              key={index}
              style={{
                padding: 'var(--spacing-lg)',
                border: `1px solid ${statusStyle.color}`,
                borderRadius: 'var(--border-radius-medium)',
                backgroundColor: statusStyle.bg,
                textAlign: 'center'
              }}
            >
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: statusStyle.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: statusStyle.color,
                margin: '0 auto var(--spacing-md) auto'
              }}>
                {item.icon}
              </div>
              
              <h4 style={{ margin: '0 0 var(--spacing-xs) 0' }}>{item.metric}</h4>
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-size-xl)', 
                fontWeight: 'bold',
                color: statusStyle.color
              }}>
                {item.value}{item.metric.includes('CPU') || item.metric.includes('Yaddaş') ? '%' : ''}
              </p>
              
              <div style={{ 
                display: 'inline-block',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--border-radius-small)',
                backgroundColor: statusStyle.bg,
                color: statusStyle.color,
                fontSize: 'var(--font-size-small)',
                marginTop: 'var(--spacing-sm)'
              }}>
                {item.status === 'healthy' ? 'Sağlam' : 
                 item.status === 'warning' ? 'Xəbərdarlıq' : 'Kritik'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SystemHealthMonitor;