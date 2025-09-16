// AuditLogs.tsx
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileText, Download, Filter } from 'lucide-react';

interface AuditLogsProps {
  data: {
    id: number;
    user: string;
    action: string;
    resource: string;
    timestamp: string;
    ip: string;
    location: string;
  }[];
}

const AuditLogs: React.FC<AuditLogsProps> = ({ data }) => {
  const [logs, setLogs] = useState(data);
  const [filter, setFilter] = useState('all');

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.action.toLowerCase().includes(filter.toLowerCase()));

  const downloadLogs = () => {
    // In a real app, this would download the logs as a CSV file
    alert('Audit jurnalı yüklənir...');
  };

  return (
    <Card>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <FileText size={20} style={{ color: 'var(--primary-color)' }} />
          Audit Jurnalları (Audit Logs)
        </h3>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => setFilter('all')}
            style={{ 
              backgroundColor: filter === 'all' ? 'var(--primary-color)' : 'transparent',
              color: filter === 'all' ? 'white' : 'var(--primary-text-color)'
            }}
          >
            Hamısı
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => setFilter('create')}
            style={{ 
              backgroundColor: filter === 'create' ? 'var(--primary-color)' : 'transparent',
              color: filter === 'create' ? 'white' : 'var(--primary-text-color)'
            }}
          >
            Yaratma
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => setFilter('update')}
            style={{ 
              backgroundColor: filter === 'update' ? 'var(--primary-color)' : 'transparent',
              color: filter === 'update' ? 'white' : 'var(--primary-text-color)'
            }}
          >
            Yeniləmə
          </Button>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => setFilter('delete')}
            style={{ 
              backgroundColor: filter === 'delete' ? 'var(--primary-color)' : 'transparent',
              color: filter === 'delete' ? 'white' : 'var(--primary-text-color)'
            }}
          >
            Silmə
          </Button>
          <Button 
            variant="primary" 
            size="small"
            onClick={downloadLogs}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
          >
            <Download size={16} />
            Yüklə
          </Button>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)'
            }}>
              <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>İstifadəçi</th>
              <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Əməliyyat</th>
              <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Resurs</th>
              <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Tarix</th>
              <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>IP Ünvanı</th>
              <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', fontWeight: 500 }}>Yer</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr 
                key={log.id} 
                style={{ borderBottom: '1px solid var(--border-color)' }}
              >
                <td style={{ padding: 'var(--spacing-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 'var(--font-size-small)'
                    }}>
                      {log.user.charAt(0)}
                    </div>
                    {log.user}
                  </div>
                </td>
                <td style={{ padding: 'var(--spacing-md)' }}>
                  <span style={{ 
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-small)',
                    backgroundColor: log.action.toLowerCase().includes('create') 
                      ? 'rgba(40, 167, 69, 0.1)' 
                      : log.action.toLowerCase().includes('update') 
                        ? 'rgba(0, 123, 255, 0.1)' 
                        : log.action.toLowerCase().includes('delete') 
                          ? 'rgba(220, 53, 69, 0.1)' 
                          : 'rgba(108, 117, 125, 0.1)',
                    color: log.action.toLowerCase().includes('create') 
                      ? 'var(--success-color)' 
                      : log.action.toLowerCase().includes('update') 
                        ? 'var(--primary-color)' 
                        : log.action.toLowerCase().includes('delete') 
                          ? 'var(--error-color)' 
                          : 'var(--secondary-text-color)',
                    fontSize: 'var(--font-size-small)',
                    fontWeight: 500
                  }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: 'var(--spacing-md)' }}>{log.resource}</td>
                <td style={{ padding: 'var(--spacing-md)' }}>
                  {new Date(log.timestamp).toLocaleString('az-AZ')}
                </td>
                <td style={{ padding: 'var(--spacing-md)' }}>{log.ip}</td>
                <td style={{ padding: 'var(--spacing-md)' }}>{log.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredLogs.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-xl)', 
          color: 'var(--secondary-text-color)' 
        }}>
          <FileText size={48} style={{ margin: '0 auto var(--spacing-md) auto', opacity: 0.3 }} />
          <h3>Jurnal yoxdur</h3>
          <p>Hal-hazırda bu kateqoriyada audit jurnalı yoxdur</p>
        </div>
      )}
    </Card>
  );
};

export default AuditLogs;