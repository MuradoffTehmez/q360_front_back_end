// CircularProgressBar.tsx
import React from 'react';

interface CircularProgressBarProps {
  percentage: number;
  size?: number;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage, size = 100 }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--primary-color)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        <span style={{ 
          fontSize: 'var(--font-size-xl)', 
          fontWeight: 'bold', 
          color: 'var(--primary-color)' 
        }}>
          {percentage}%
        </span>
        <p className="text-secondary text-small" style={{ margin: 'var(--spacing-xs) 0 0 0' }}>
          Tamamlandı
        </p>
      </div>
    </div>
  );
};

export default CircularProgressBar;