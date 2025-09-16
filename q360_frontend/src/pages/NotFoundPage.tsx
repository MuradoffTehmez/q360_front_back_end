// NotFoundPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--background-color)',
      padding: 'var(--spacing-md)',
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '500px',
        textAlign: 'center',
        padding: 'var(--spacing-xl)',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-lg) auto',
          color: 'var(--error-color)'
        }}>
          <AlertTriangle size={40} />
        </div>
        
        <h1 style={{ 
          fontSize: 'var(--font-size-xxl)',
          margin: '0 0 var(--spacing-md) 0',
          color: 'var(--error-color)',
        }}>
          404
        </h1>
        <h2 style={{ margin: '0 0 var(--spacing-lg) 0' }}>Səhifə Tapılmadı</h2>
        <p className="text-secondary" style={{ margin: '0 0 var(--spacing-xl) 0' }}>
          Axtardığınız səhifə mövcud deyil və ya silinib.
        </p>
        <Button 
          variant="primary" 
          onClick={() => navigate('/dashboard')}
          style={{ 
            padding: 'var(--spacing-md) var(--spacing-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            gap: 'var(--spacing-sm)'
          }}
        >
          <ArrowLeft size={18} />
          Dashboard-a qayıt
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundPage;