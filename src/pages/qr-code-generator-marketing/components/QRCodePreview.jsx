import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const QRCodePreview = ({ 
  qrCodeData, 
  selectedSize, 
  selectedColor, 
  logoOverlay, 
  businessProfile 
}) => {
  const sizeOptions = {
    'business-card': { width: 200, height: 200, label: 'Business Card' },
    'flyer': { width: 300, height: 300, label: 'Flyer' },
    'poster': { width: 400, height: 400, label: 'Poster' },
    'window-sticker': { width: 250, height: 250, label: 'Window Sticker' }
  };

  const currentSize = sizeOptions?.[selectedSize] || sizeOptions?.['business-card'];

  // Mock QR code generation (in real app, this would use a QR library)
  const generateQRCodeUrl = () => {
    const baseUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    const params = new URLSearchParams({
      size: `${currentSize.width}x${currentSize.height}`,
      data: qrCodeData.url,
      color: selectedColor.replace('#', ''),
      bgcolor: 'ffffff',
      format: 'png'
    });
    return `${baseUrl}?${params?.toString()}`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">QR Code Preview</h3>
        <p className="text-sm text-muted-foreground">
          {currentSize?.label} format ({currentSize?.width}×{currentSize?.height}px)
        </p>
      </div>
      {/* QR Code Display */}
      <div className="flex justify-center mb-6">
        <div 
          className="relative bg-white p-4 rounded-lg shadow-moderate border-2 border-border"
          style={{ 
            width: currentSize?.width + 32, 
            height: currentSize?.height + 32 
          }}
        >
          <Image
            src={generateQRCodeUrl()}
            alt="Generated QR Code"
            className="w-full h-full object-contain"
            width={currentSize?.width}
            height={currentSize?.height}
          />
          
          {/* Logo Overlay */}
          {logoOverlay && businessProfile?.logo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-2 shadow-moderate">
                <Image
                  src={businessProfile?.logo}
                  alt={`${businessProfile?.name} logo`}
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* QR Code Information */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Link" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Booking URL:</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded">
              {qrCodeData?.url}
            </span>
            <button
              onClick={() => navigator.clipboard?.writeText(qrCodeData?.url)}
              className="p-1 hover:bg-secondary/20 rounded transition-micro"
              title="Copy URL"
            >
              <Icon name="Copy" size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Palette" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Color:</span>
            <div 
              className="w-4 h-4 rounded border border-border"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span className="text-foreground">{new Date()?.toLocaleDateString('en-GB')}</span>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-secondary/20 hover:bg-secondary/30 rounded-md text-sm transition-micro">
          <Icon name="Eye" size={14} />
          <span>Preview</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-secondary/20 hover:bg-secondary/30 rounded-md text-sm transition-micro">
          <Icon name="RotateCcw" size={14} />
          <span>Regenerate</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1.5 bg-secondary/20 hover:bg-secondary/30 rounded-md text-sm transition-micro">
          <Icon name="Maximize" size={14} />
          <span>Full Size</span>
        </button>
      </div>
    </div>
  );
};

export default QRCodePreview;
