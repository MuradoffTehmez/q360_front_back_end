// TaskList.tsx
import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import Button from '../Button';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--error-color)';
      case 'medium': return '#FFC107';
      case 'low': return 'var(--success-color)';
      default: return 'var(--secondary-text-color)';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {tasks.map((task) => (
        <div 
          key={task.id} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: 'var(--spacing-sm) 0',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ marginRight: 'var(--spacing-md)', flexShrink: 0 }}>
            {task.completed ? (
              <CheckCircle size={20} style={{ color: 'var(--success-color)' }} />
            ) : (
              <Circle size={20} style={{ color: 'var(--secondary-text-color)' }} />
            )}
          </div>
          
          <div style={{ flex: 1 }}>
            <p 
              style={{ 
                margin: '0 0 var(--spacing-xs) 0', 
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--secondary-text-color)' : 'var(--primary-text-color)'
              }}
            >
              {task.title}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
              <span className="text-secondary text-small" style={{ margin: 0 }}>
                {formatDate(task.dueDate)}
              </span>
              <span 
                style={{ 
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--border-radius-small)',
                  backgroundColor: `${getPriorityColor(task.priority)}20`,
                  color: getPriorityColor(task.priority),
                  fontSize: 'var(--font-size-small)'
                }}
              >
                {task.priority === 'high' ? 'Yüksək' : task.priority === 'medium' ? 'Orta' : 'Aşağı'}
              </span>
            </div>
          </div>
          
          {!task.completed && (
            <Button variant="secondary" size="small">
              Tamamla
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;