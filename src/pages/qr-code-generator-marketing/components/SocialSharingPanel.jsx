import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SocialSharingPanel = ({ qrCodeData, businessProfile }) => {
  const [customMessage, setCustomMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  const defaultMessages = {
    facebook: `Book your appointment easily with ${businessProfile?.name || 'our business'}! 📅\n\nScan this QR code or visit: ${qrCodeData?.url}\n\n#BookingMadeEasy #${businessProfile?.name?.replace(/\s+/g, '') || 'Business'}`,
    instagram: `Quick & easy booking! 📱✨\n\nScan the QR code in our story or bio to book your appointment instantly.\n\n#BookNow #${businessProfile?.category || 'Service'} #UK`,
    whatsapp: `Hi! 👋\n\nYou can now book appointments with us super easily! Just scan this QR code or click: ${qrCodeData?.url}\n\nLooking forward to seeing you soon! 😊`,
    twitter: `📅 Book appointments with ${businessProfile?.name || 'us'} in seconds!\n\nScan QR code → Choose service → Book instantly\n\n${qrCodeData?.url}\n\n#BookingMadeEasy #UKBusiness`,
    linkedin: `We've made booking appointments easier than ever! Our new QR code system allows customers to book instantly, 24/7.\n\nTry it out: ${qrCodeData?.url}\n\n#BusinessEfficiency #CustomerExperience #UKBusiness`
  };

  const socialPlatforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: '#1877f2',
      description: 'Share on your business page'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: 'Instagram',
      color: '#e4405f',
      description: 'Post to stories or feed'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: '#25d366',
      description: 'Send to customers directly'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'Twitter',
      color: '#1da1f2',
      description: 'Tweet to followers'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: '#0077b5',
      description: 'Professional network sharing'
    }
  ];

  const handleShare = async (platform) => {
    setIsSharing(true);
    
    const message = customMessage || defaultMessages?.[platform];
    
    // Simulate sharing process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would integrate with social media APIs
    console.log(`Sharing to ${platform}:`, message);
    
    // For web sharing API
    if (navigator.share && platform === 'native') {
      try {
        await navigator.share({
          title: `Book with ${businessProfile?.name || 'us'}`,
          text: message,
          url: qrCodeData?.url
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    }
    
    setIsSharing(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard?.writeText(text);
      // Show success feedback
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Social Media Sharing</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Share2" size={16} />
          <span>Boost your reach</span>
        </div>
      </div>
      {/* Custom Message */}
      <div className="mb-6">
        <Input
          label="Custom Message (Optional)"
          type="text"
          placeholder="Add your own promotional message..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e?.target?.value)}
          description="Leave blank to use platform-specific default messages"
        />
      </div>
      {/* Social Platforms */}
      <div className="space-y-4 mb-6">
        {socialPlatforms?.map((platform) => (
          <div
            key={platform?.id}
            className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-micro"
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: platform?.color }}
              >
                <Icon name={platform?.icon} size={20} />
              </div>
              <div>
                <div className="font-medium text-foreground">{platform?.name}</div>
                <div className="text-sm text-muted-foreground">{platform?.description}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Copy"
                onClick={() => copyToClipboard(customMessage || defaultMessages?.[platform?.id])}
                title="Copy message"
              />
              <Button
                variant="outline"
                size="sm"
                iconName="Share"
                iconPosition="left"
                loading={isSharing}
                onClick={() => handleShare(platform?.id)}
              >
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Button
          variant="secondary"
          iconName="Copy"
          iconPosition="left"
          onClick={() => copyToClipboard(qrCodeData?.url)}
        >
          Copy Booking URL
        </Button>
        <Button
          variant="secondary"
          iconName="QrCode"
          iconPosition="left"
          onClick={() => copyToClipboard(`Check out our QR code for easy booking: ${qrCodeData?.url}`)}
        >
          Copy QR Message
        </Button>
      </div>
      {/* Pre-written Templates */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Message Templates</h4>
        <div className="space-y-3">
          {Object.entries(defaultMessages)?.slice(0, 3)?.map(([platform, message]) => (
            <div key={platform} className="p-3 bg-secondary/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground capitalize">{platform}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Copy"
                  onClick={() => copyToClipboard(message)}
                />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {message?.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Sharing Tips */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Sharing Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Post during peak hours for maximum engagement</li>
              <li>• Include relevant hashtags for your industry</li>
              <li>• Add a call-to-action to encourage bookings</li>
              <li>• Share regularly to maintain visibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSharingPanel;
