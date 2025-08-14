import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const PrintTemplates = ({ qrCodeData, selectedSize, businessProfile }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('business-card');
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      id: 'business-card',
      name: 'Business Card',
      description: 'Standard business card with QR code',
      dimensions: '85×55mm',
      icon: 'CreditCard',
      preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop'
    },
    {
      id: 'window-sticker',
      name: 'Window Sticker',
      description: 'Adhesive sticker for shop windows',
      dimensions: '150×150mm',
      icon: 'Square',
      preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
    },
    {
      id: 'flyer',
      name: 'A5 Flyer',
      description: 'Promotional flyer with QR code',
      dimensions: '148×210mm',
      icon: 'FileText',
      preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=400&fit=crop'
    },
    {
      id: 'poster',
      name: 'A4 Poster',
      description: 'Large format poster for displays',
      dimensions: '210×297mm',
      icon: 'Image',
      preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop'
    },
    {
      id: 'table-tent',
      name: 'Table Tent',
      description: 'Folded display for tables/counters',
      dimensions: '100×150mm',
      icon: 'Triangle',
      preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=250&fit=crop'
    },
    {
      id: 'door-hanger',
      name: 'Door Hanger',
      description: 'Promotional door hanger',
      dimensions: '108×279mm',
      icon: 'Tag',
      preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=350&fit=crop'
    }
  ];

  const paperSizes = [
    { id: 'a4', name: 'A4', description: '210×297mm' },
    { id: 'a5', name: 'A5', description: '148×210mm' },
    { id: 'letter', name: 'Letter', description: '216×279mm' },
    { id: 'custom', name: 'Custom', description: 'Set your own size' }
  ];

  const handleGenerateTemplate = async (templateId) => {
    setIsGenerating(true);
    
    // Simulate template generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Generated template: ${templateId}`);
    setIsGenerating(false);
  };

  const handlePrintPreview = () => {
    // In a real app, this would open a print preview
    window.print();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Print Templates</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Printer" size={16} />
          <span>Print-ready designs</span>
        </div>
      </div>
      {/* Template Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {templates?.map((template) => (
          <div
            key={template?.id}
            className={`
              relative cursor-pointer rounded-lg border-2 transition-micro overflow-hidden
              ${selectedTemplate === template?.id
                ? 'border-primary ring-2 ring-primary/20' :'border-border hover:border-primary/30'
              }
            `}
            onClick={() => setSelectedTemplate(template?.id)}
          >
            {/* Preview Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={template?.preview}
                alt={template?.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/90 rounded-lg p-2">
                  <Icon name={template?.icon} size={24} className="text-primary" />
                </div>
              </div>
            </div>
            
            {/* Template Info */}
            <div className="p-3">
              <h4 className="font-medium text-foreground">{template?.name}</h4>
              <p className="text-xs text-muted-foreground mb-1">{template?.description}</p>
              <p className="text-xs text-primary font-medium">{template?.dimensions}</p>
            </div>

            {/* Selection Indicator */}
            {selectedTemplate === template?.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} className="text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Template Customization */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-3">Template Customization</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Paper Size
            </label>
            <div className="space-y-2">
              {paperSizes?.map((size) => (
                <label key={size?.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paperSize"
                    value={size?.id}
                    defaultChecked={size?.id === 'a4'}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{size?.name}</span>
                  <span className="text-xs text-muted-foreground">({size?.description})</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Print Quality
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="quality"
                  value="draft"
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Draft (150 DPI)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="quality"
                  value="standard"
                  defaultChecked
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Standard (300 DPI)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="quality"
                  value="high"
                  className="text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">High (600 DPI)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            loading={isGenerating}
            onClick={() => handleGenerateTemplate(selectedTemplate)}
          >
            Generate Template
          </Button>
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            onClick={handlePrintPreview}
          >
            Print Preview
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="secondary"
            iconName="FileText"
            iconPosition="left"
            onClick={() => handleGenerateTemplate('pdf')}
          >
            Download PDF
          </Button>
          <Button
            variant="secondary"
            iconName="Printer"
            iconPosition="left"
            onClick={() => window.print()}
          >
            Print Now
          </Button>
          <Button
            variant="secondary"
            iconName="Package"
            iconPosition="left"
            onClick={() => handleGenerateTemplate('batch')}
          >
            Batch Print
          </Button>
        </div>
      </div>
      {/* Print Guidelines */}
      <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Print Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use high-quality paper (minimum 200gsm for business cards)</li>
              <li>• Ensure QR code contrast ratio is at least 3:1</li>
              <li>• Test QR code scanning before mass printing</li>
              <li>• Leave 4mm bleed area around edges for professional cutting</li>
              <li>• Use CMYK color mode for accurate print colors</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Template Preview */}
      <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-3">Current Template Preview</h4>
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Selected:</span>
            <span className="text-foreground font-medium ml-2">
              {templates?.find(t => t?.id === selectedTemplate)?.name}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Size:</span>
            <span className="text-foreground font-medium ml-2">
              {templates?.find(t => t?.id === selectedTemplate)?.dimensions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintTemplates;
