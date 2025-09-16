// RadarChart.tsx
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarChartData {
  subject: string;
  A: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarChartData[];
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: 'var(--primary-text-color)', 
              fontSize: 'var(--font-size-small)' 
            }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 150]} 
            tick={{ 
              fill: 'var(--secondary-text-color)', 
              fontSize: 'var(--font-size-small)' 
            }} 
          />
          <Radar
            name="Performans"
            dataKey="A"
            stroke="var(--primary-color)"
            fill="var(--primary-color)"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChartComponent;