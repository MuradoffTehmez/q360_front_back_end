// WhiteLabeling.tsx
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Palette, Upload, Save, RotateCcw } from 'lucide-react';

interface WhiteLabelingProps {
  onSave: (settings: any) => void;
}

const WhiteLabeling: React.FC<WhiteLabelingProps> = ({ onSave }) => {
  const [brandSettings, setBrandSettings] = useState({
    companyName: 'Q360',
    primaryColor: '#007BFF',
    logo: '',
    favicon: '',
    emailSignature: 'Hörmətlə,\n{companyName} Komandası'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrandSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setBrandSettings(prev => ({ ...prev, primaryColor: color }));
  };

  const handleSave = () => {
    onSave(brandSettings);
    alert('Brend parametrləri yadda saxlanıldı!');
  };

  const handleReset = () => {
    setBrandSettings({
      companyName: 'Q360',
      primaryColor: '#007BFF',
      logo: '',
      favicon: '',
      emailSignature: 'Hörmətlə,\n{companyName} Komandası'
    });
  };

  const colorPresets = [
    '#007BFF', '#4D9FFF', '#28A745', '#33C15B', 
    '#DC3545', '#F15B6C', '#FFC107', '#FFD54F'
  ];

  return (
    <Card>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <Palette size={20} style={{ color: 'var(--primary-color)' }} />
        Brendin Fərdiləşdirilməsi (White-Labeling)
      </h3>
      <p className="text-secondary" style={{ margin: '0 0 var(--spacing-lg) 0' }}>
        Müştəri şirkətlərin platformanı öz korporativ kimliklərinə uyğunlaşdırması
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        <div>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              Şirkət Adı
            </label>
            <Input
              type="text"
              name="companyName"
              value={brandSettings.companyName}
              onChange={handleInputChange}
              placeholder="Şirkət adı"
            />
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              Əsas Rəng
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              <input
                type="color"
                value={brandSettings.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: 'none', 
                  borderRadius: 'var(--border-radius-small)',
                  cursor: 'pointer'
                }}
              />
              <Input
                type="text"
                value={brandSettings.primaryColor}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="#007BFF"
                style={{ flex: 1 }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-xs)', 
              marginTop: 'var(--spacing-sm)',
              flexWrap: 'wrap'
            }}>
              {colorPresets.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleColorChange(color)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: brandSettings.primaryColor === color ? '2px solid black' : '1px solid var(--border-color)',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              E-poçt İmzası
            </label>
            <textarea
              name="emailSignature"
              value={brandSettings.emailSignature}
              onChange={handleInputChange}
              rows={4}
              style={{
                width: '100%',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--border-radius-medium)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--primary-text-color)',
                fontFamily: 'var(--font-family)',
                fontSize: 'var(--font-size-base)',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
        
        <div>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              Loqo Yüklə
            </label>
            <div style={{ 
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--border-radius-medium)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}>
              {brandSettings.logo ? (
                <img 
                  src={brandSettings.logo} 
                  alt="Logo" 
                  style={{ maxWidth: '100%', maxHeight: '100px' }} 
                />
              ) : (
                <>
                  <Upload size={48} style={{ margin: '0 auto var(--spacing-md) auto', color: 'var(--secondary-text-color)' }} />
                  <p className="text-secondary">Loqo yükləmək üçün klikləyin və ya fayl çəkin</p>
                  <p className="text-small text-secondary">PNG, JPG və ya SVG formatında (maks. 2MB)</p>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }} 
              />
            </div>
          </div>
          
          <div>
            <label className="text-medium" style={{ display: 'block', marginBottom: 'var(--spacing-sm)' }}>
              Favicon Yüklə
            </label>
            <div style={{ 
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--border-radius-medium)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}>
              {brandSettings.favicon ? (
                <img 
                  src={brandSettings.favicon} 
                  alt="Favicon" 
                  style={{ maxWidth: '100%', maxHeight: '32px' }} 
                />
              ) : (
                <>
                  <Upload size={32} style={{ margin: '0 auto var(--spacing-md) auto', color: 'var(--secondary-text-color)' }} />
                  <p className="text-secondary">Favicon yükləmək üçün klikləyin</p>
                  <p className="text-small text-secondary">PNG və ya ICO formatında (32x32)</p>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 'var(--spacing-md)' 
      }}>
        <Button 
          variant="secondary" 
          onClick={handleReset}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
        >
          <RotateCcw size={18} />
          Sıfırla
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}
        >
          <Save size={18} />
          Yadda Saxla
        </Button>
      </div>
    </Card>
  );
};

export default WhiteLabeling;