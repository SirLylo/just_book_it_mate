import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CustomizationPanel = ({
  selectedSize,
  onSizeChange,
  selectedColor,
  onColorChange,
  logoOverlay,
  onLogoOverlayChange,
  businessProfile
}) => {
  const sizeOptions = [
    { id: 'business-card', label: 'Business Card', dimensions: '200×200px', icon: 'CreditCard' },
    { id: 'flyer', label: 'Flyer', dimensions: '300×300px', icon: 'FileText' },
    { id: 'poster', label: 'Poster', dimensions: '400×400px', icon: 'Image' },
    { id: 'window-sticker', label: 'Window Sticker', dimensions: '250×250px', icon: 'Square' }
  ];

  const colorOptions = [
    { color: '#103948', label: 'Brand Teal' },
    { color: '#000000', label: 'Classic Black' },
    { color: '#1f2937', label: 'Dark Gray' },
    { color: '#7c3aed', label: 'Purple' },
    { color: '#dc2626', label: 'Red' },
    { color: '#059669', label: 'Green' },
    { color: '#2563eb', label: 'Blue' },
    { color: '#ea580c', label: 'Orange' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <h3 className="text-lg font-semibold text-foreground mb-6">Customization Options</h3>
      {/* Size Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          QR Code Size
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sizeOptions?.map((option) => (
            <button
              key={option?.id}
              onClick={() => onSizeChange(option?.id)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border-2 transition-micro text-left
                ${selectedSize === option?.id
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/30 text-foreground'
                }
              `}
            >
              <Icon name={option?.icon} size={20} />
              <div>
                <div className="font-medium">{option?.label}</div>
                <div className="text-xs opacity-75">{option?.dimensions}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Color Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          QR Code Color
        </label>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions?.map((option) => (
            <button
              key={option?.color}
              onClick={() => onColorChange(option?.color)}
              className={`
                relative w-full aspect-square rounded-lg border-2 transition-micro
                ${selectedColor === option?.color
                  ? 'border-primary ring-2 ring-primary/20' :'border-border hover:border-primary/30'
                }
              `}
              style={{ backgroundColor: option?.color }}
              title={option?.label}
            >
              {selectedColor === option?.color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon name="Check" size={16} className="text-white drop-shadow-md" />
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Selected: {colorOptions?.find(opt => opt?.color === selectedColor)?.label}
        </p>
      </div>
      {/* Logo Overlay */}
      <div className="mb-6">
        <Checkbox
          label="Add Business Logo Overlay"
          description="Place your business logo in the center of the QR code"
          checked={logoOverlay}
          onChange={(e) => onLogoOverlayChange(e?.target?.checked)}
          disabled={!businessProfile?.logo}
        />
        {!businessProfile?.logo && (
          <p className="text-xs text-warning mt-2 flex items-center space-x-1">
            <Icon name="AlertTriangle" size={12} />
            <span>Upload a business logo in settings to enable this feature</span>
          </p>
        )}
      </div>
      {/* Advanced Options */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Advanced Options</h4>
        <div className="space-y-3">
          <Checkbox
            label="High Resolution"
            description="Generate QR code at 300 DPI for print quality"
            checked
            onChange={() => {}}
          />
          <Checkbox
            label="Error Correction"
            description="Add redundancy to ensure QR code works even if partially damaged"
            checked
            onChange={() => {}}
          />
          <Checkbox
            label="Quiet Zone"
            description="Add white border around QR code for better scanning"
            checked
            onChange={() => {}}
          />
        </div>
      </div>
      {/* Reset Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <Button
          variant="outline"
          fullWidth
          iconName="RotateCcw"
          iconPosition="left"
          onClick={() => {
            onSizeChange('business-card');
            onColorChange('#103948');
            onLogoOverlayChange(false);
          }}
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default CustomizationPanel;
