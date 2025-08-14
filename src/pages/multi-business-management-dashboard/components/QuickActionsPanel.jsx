import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({
  userTier = "Basic",
  selectedBusiness,
  onAddBusinessLocation,
  onCreateQRCampaign,
  onManageAppointments,
  onViewAnalytics,
  onUpgrade,
  className
}) => {
  const isBasicTier = userTier === "Basic";
  const isProfessionalTier = userTier === "Professional";

  const handleProFeatureClick = (callback) => {
    if (isBasicTier) {
      onUpgrade?.();
    } else {
      callback?.();
    }
  };

  const quickActions = [
    {
      id: 'add-appointment',
      label: 'Add Appointment',
      description: 'Schedule new booking',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      available: true,
      onClick: onManageAppointments
    },
    {
      id: 'add-business',
      label: 'Add Business Location',
      description: 'Expand your operations',
      icon: 'Building',
      color: 'bg-success text-success-foreground',
      available: isProfessionalTier,
      onClick: () => handleProFeatureClick(onAddBusinessLocation),
      proOnly: true
    },
    {
      id: 'qr-campaign',
      label: 'Create QR Campaign',
      description: 'Marketing & promotion',
      icon: 'QrCode',
      color: 'bg-warning text-warning-foreground',
      available: isProfessionalTier,
      onClick: () => handleProFeatureClick(onCreateQRCampaign),
      proOnly: true
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      description: 'Performance insights',
      icon: 'TrendingUp',
      color: 'bg-accent text-accent-foreground',
      available: isProfessionalTier,
      onClick: () => handleProFeatureClick(onViewAnalytics),
      proOnly: true
    }
  ];

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-subtle", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        </div>
        
        {selectedBusiness && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Building" size={14} />
            <span className="hidden sm:inline">{selectedBusiness?.name}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className={cn(
              "relative group cursor-pointer rounded-lg border border-border p-4 transition-all duration-200",
              action?.available 
                ? "hover:shadow-md hover:border-primary/50" 
                : "opacity-60 cursor-not-allowed"
            )}
            onClick={action?.available ? action?.onClick : undefined}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                action?.available ? action?.color : "bg-muted text-muted-foreground"
              )}>
                <Icon name={action?.icon} size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-foreground">{action?.label}</h4>
                  {action?.proOnly && (
                    <div className="flex items-center space-x-1">
                      {isBasicTier ? (
                        <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-medium">
                          Pro
                        </div>
                      ) : (
                        <Icon name="Crown" size={12} className="text-primary" />
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
                
                {action?.proOnly && isBasicTier && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onUpgrade?.();
                      }}
                      iconName="ArrowRight"
                      iconPosition="right"
                    >
                      Upgrade
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {!action?.available && action?.proOnly && (
              <div className="absolute inset-0 bg-muted/50 rounded-lg flex items-center justify-center">
                <Icon name="Lock" size={24} className="text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upgrade CTA for Basic Users */}
      {isBasicTier && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
          <div className="flex items-center space-x-3">
            <Icon name="Crown" size={20} className="text-primary" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground">Unlock More Features</h4>
              <p className="text-sm text-muted-foreground">Upgrade to Professional for unlimited actions</p>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={onUpgrade}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Upgrade
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActionsPanel;
