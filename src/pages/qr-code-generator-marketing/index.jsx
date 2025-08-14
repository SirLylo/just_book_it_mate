import React, { useState, useEffect } from 'react';
import BusinessNavigationHeader from '../../components/ui/BusinessNavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QRCodePreview from './components/QRCodePreview';
import CustomizationPanel from './components/CustomizationPanel';
import DownloadOptions from './components/DownloadOptions';
import AnalyticsPanel from './components/AnalyticsPanel';
import SocialSharingPanel from './components/SocialSharingPanel';
import PrintTemplates from './components/PrintTemplates';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const QRCodeGeneratorMarketing = () => {
  const [selectedSize, setSelectedSize] = useState('business-card');
  const [selectedColor, setSelectedColor] = useState('#103948');
  const [logoOverlay, setLogoOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState('customize');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock business profile data
  const businessProfile = {
    name: "Sarah\'s Hair Studio",
    email: "sarah@hairstudio.co.uk",
    phone: "+44 7700 900123",
    address: "123 High Street, Manchester, M1 2AB",
    category: "Beauty Services",
    logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop&crop=face",
    website: "https://sarahhairstudio.co.uk",
    services: ["Haircut & Style", "Hair Colouring", "Wedding Hair", "Hair Treatments"]
  };

  // Mock QR code data
  const qrCodeData = {
    url: "https://justbookitmate.co.uk/book/sarah-hair-studio",
    businessName: businessProfile?.name,
    businessId: "sarah-hair-studio",
    createdAt: new Date()?.toISOString(),
    lastUpdated: new Date()?.toISOString()
  };

  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah@hairstudio.co.uk"
  };

  const tabs = [
    { id: 'customize', label: 'Customize', icon: 'Palette', description: 'Design your QR code' },
    { id: 'download', label: 'Download', icon: 'Download', description: 'Get your files' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3', description: 'Track performance' },
    { id: 'social', label: 'Social Media', icon: 'Share2', description: 'Share online' },
    { id: 'print', label: 'Print Templates', icon: 'Printer', description: 'Print materials' }
  ];

  const breadcrumbs = [
    { label: 'Dashboard', path: '/business-dashboard' },
    { label: 'Marketing Tools', path: '/qr-code-generator-marketing' }
  ];

  const handleGenerateNewQR = async () => {
    setIsGenerating(true);
    
    // Simulate QR code generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Generated new QR code with settings:', {
      size: selectedSize,
      color: selectedColor,
      logoOverlay
    });
    
    setIsGenerating(false);
  };

  const handleQuickShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Book with ${businessProfile?.name}`,
        text: 'Book your appointment easily with our QR code!',
        url: qrCodeData?.url
      });
    }
  };

  useEffect(() => {
    // Set page title
    document.title = 'QR Code Generator & Marketing - Just Book It Mate';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <BusinessNavigationHeader 
        userProfile={userProfile}
        notificationCount={3}
        onToggleCollapse={() => {}}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs customBreadcrumbs={breadcrumbs} />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                QR Code Generator & Marketing
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Create professional QR codes for your booking page and track their performance. 
                Generate marketing materials and share across social media to boost your bookings.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Share"
                iconPosition="left"
                onClick={handleQuickShare}
              >
                Quick Share
              </Button>
              <Button
                variant="default"
                iconName="Sparkles"
                iconPosition="left"
                loading={isGenerating}
                onClick={handleGenerateNewQR}
              >
                Generate New QR
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Eye" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Scans</span>
              </div>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <div className="text-xs text-success">+18% this week</div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Calendar" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Bookings</span>
              </div>
              <div className="text-2xl font-bold text-foreground">89</div>
              <div className="text-xs text-success">+12% this week</div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Conversion</span>
              </div>
              <div className="text-2xl font-bold text-foreground">7.1%</div>
              <div className="text-xs text-success">+0.8% this week</div>
            </div>
            
            <div className="bg-card rounded-lg border border-border p-4 shadow-subtle">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Revenue</span>
              </div>
              <div className="text-2xl font-bold text-foreground">£2,340</div>
              <div className="text-xs text-success">+15% this week</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-muted rounded-lg p-1">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-micro
                  ${activeTab === tab?.id
                    ? 'bg-card text-foreground shadow-subtle'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  }
                `}
                title={tab?.description}
              >
                <Icon name={tab?.icon} size={16} />
                <span className="hidden sm:inline">{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - QR Code Preview (Always Visible) */}
            <div className="lg:col-span-1">
              <QRCodePreview
                qrCodeData={qrCodeData}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                logoOverlay={logoOverlay}
                businessProfile={businessProfile}
              />
            </div>

            {/* Right Column - Tab Content */}
            <div className="lg:col-span-2">
              {activeTab === 'customize' && (
                <CustomizationPanel
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                  logoOverlay={logoOverlay}
                  onLogoOverlayChange={setLogoOverlay}
                  businessProfile={businessProfile}
                />
              )}

              {activeTab === 'download' && (
                <DownloadOptions
                  qrCodeData={qrCodeData}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsPanel qrCodeData={qrCodeData} />
              )}

              {activeTab === 'social' && (
                <SocialSharingPanel
                  qrCodeData={qrCodeData}
                  businessProfile={businessProfile}
                />
              )}

              {activeTab === 'print' && (
                <PrintTemplates
                  qrCodeData={qrCodeData}
                  selectedSize={selectedSize}
                  businessProfile={businessProfile}
                />
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="mt-12 bg-card rounded-lg border border-border p-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Ready to boost your bookings?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your QR code is ready to use. Start sharing it to increase your online presence.
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  iconName="ExternalLink"
                  iconPosition="left"
                  onClick={() => window.open(qrCodeData?.url, '_blank')}
                >
                  Test Booking Page
                </Button>
                <Button
                  variant="default"
                  iconName="Rocket"
                  iconPosition="left"
                  onClick={() => setActiveTab('social')}
                >
                  Start Marketing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRCodeGeneratorMarketing;
