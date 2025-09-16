// ActivityFeed.tsx
import React from 'react';
import { Activity, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ActivityItem {
  id: number;
  text: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} style={{ color: 'var(--success-color)' }} />;
      case 'warning': return <AlertCircle size={16} style={{ color: '#FFC107' }} />;
      case 'info': return <Info size={16} style={{ color: 'var(--primary-color)' }} />;
      default: return <Activity size={16} style={{ color: 'var(--primary-color)' }} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return 'rgba(40, 167, 69, 0.1)';
      case 'warning': return 'rgba(255, 193, 7, 0.1)';
      case 'info': return 'rgba(0, 123, 255, 0.1)';
      default: return 'transparent';
    }
  };

  return (
    <div style={{ 
      height: '300px', 
      display: 'flex', 
      flexDirection: 'column',
      gap: 'var(--spacing-md)',
      overflowY: 'auto'
    }}>
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          style={{ 
            padding: 'var(--spacing-sm)',
            borderRadius: 'var(--border-radius-medium)',
            backgroundColor: getBackgroundColor(activity.type),
            display: 'flex',
            gap: 'var(--spacing-md)',
            borderLeft: `3px solid ${
              activity.type === 'success' ? 'var(--success-color)' : 
              activity.type === 'warning' ? '#FFC107' : 
              'var(--primary-color)'
            }`
          }}
        >
          <div style={{ 
            width: '24px', 
            height: '24px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--surface-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {getIcon(activity.type)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 500 }}>
              {activity.text}
            </p>
            <p className="text-secondary text-small" style={{ margin: 0 }}>
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;