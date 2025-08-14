import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DownloadOptions = ({ qrCodeData, selectedSize, selectedColor }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState('png');

  const downloadFormats = [
    { id: 'png', label: 'PNG', description: 'Best for web and digital use', icon: 'Image' },
    { id: 'svg', label: 'SVG', description: 'Vector format, scalable', icon: 'Layers' },
    { id: 'pdf', label: 'PDF', description: 'Print-ready document', icon: 'FileText' },
    { id: 'jpg', label: 'JPG', description: 'Compressed image format', icon: 'Camera' }
  ];

  const downloadSizes = [
    { id: 'small', label: 'Small', dimensions: '200×200px', size: '~5KB' },
    { id: 'medium', label: 'Medium', dimensions: '400×400px', size: '~15KB' },
    { id: 'large', label: 'Large', dimensions: '800×800px', size: '~45KB' },
    { id: 'print', label: 'Print Quality', dimensions: '1200×1200px', size: '~120KB' }
  ];

  const handleDownload = async (format, size) => {
    setIsDownloading(true);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would generate and download the actual file
    const fileName = `qr-code-${qrCodeData?.businessName?.toLowerCase()?.replace(/\s+/g, '-')}-${size}.${format}`;
    console.log(`Downloading: ${fileName}`);
    
    setIsDownloading(false);
  };

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    
    // Simulate bulk download
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Bulk download completed');
    setIsDownloading(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Download Options</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Download" size={16} />
          <span>Ready to download</span>
        </div>
      </div>
      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          File Format
        </label>
        <div className="grid grid-cols-2 gap-3">
          {downloadFormats?.map((format) => (
            <button
              key={format?.id}
              onClick={() => setDownloadFormat(format?.id)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border-2 transition-micro text-left
                ${downloadFormat === format?.id
                  ? 'border-primary bg-primary/5 text-primary' :'border-border hover:border-primary/30 text-foreground'
                }
              `}
            >
              <Icon name={format?.icon} size={20} />
              <div>
                <div className="font-medium">{format?.label}</div>
                <div className="text-xs opacity-75">{format?.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Size Options */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Download Sizes
        </label>
        <div className="space-y-2">
          {downloadSizes?.map((size) => (
            <div
              key={size?.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div>
                <div className="font-medium text-foreground">{size?.label}</div>
                <div className="text-sm text-muted-foreground">
                  {size?.dimensions} • {size?.size}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                loading={isDownloading}
                onClick={() => handleDownload(downloadFormat, size?.id)}
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Bulk Download */}
      <div className="mb-6 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-foreground">Bulk Download</h4>
            <p className="text-sm text-muted-foreground">
              Download all sizes in selected format as ZIP file
            </p>
          </div>
          <Button
            variant="secondary"
            iconName="Package"
            iconPosition="left"
            loading={isDownloading}
            onClick={handleBulkDownload}
          >
            Download All
          </Button>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          iconName="Download"
          iconPosition="left"
          loading={isDownloading}
          onClick={() => handleDownload(downloadFormat, 'medium')}
        >
          Quick Download (Medium PNG)
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            iconName="Printer"
            iconPosition="left"
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="outline"
            iconName="Share"
            iconPosition="left"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'QR Code',
                  text: 'Check out this QR code for booking appointments',
                  url: qrCodeData?.url
                });
              }
            }}
          >
            Share
          </Button>
        </div>
      </div>
      {/* Usage Tips */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-2">Usage Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use PNG for digital displays and websites</li>
          <li>• Choose SVG for scalable graphics and logos</li>
          <li>• Select PDF for professional print materials</li>
          <li>• Print Quality recommended for physical marketing</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadOptions;
