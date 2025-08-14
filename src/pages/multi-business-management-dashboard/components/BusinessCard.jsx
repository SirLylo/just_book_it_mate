import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';


const BusinessCard = ({
  business,
  isSelected = false,
  userTier = "Basic",
  onClick,
  className
}) => {
  const isProfessionalTier = userTier === "Professional";

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getBusinessTypeIcon = (type) => {
    const typeMap = {
      'Hair & Beauty': 'Scissors',
      'Wellness & Spa': 'Heart',
      'Fitness & Training': 'Dumbbell',
      'Medical': 'Stethoscope',
      'Automotive': 'Car',
      'Professional': 'Briefcase'
    };
    return typeMap?.[type] || 'Building';
  };

  return (
    <div
      className={cn(
        "relative bg-card rounded-lg border border-border p-6 shadow-subtle cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-primary border-primary",
        "hover:shadow-md hover:border-primary/50",
        className
      )}
      onClick={() => onClick?.(business?.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Icon name={getBusinessTypeIcon(business?.type)} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">{business?.name}</h3>
            <p className="text-sm text-muted-foreground">{business?.type}</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center space-x-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            business?.status === 'active' ? 'bg-success' : 'bg-error'
          )} />
          {isSelected && (
            <Icon name="Check" size={16} className="text-primary" />
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="MapPin" size={14} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{business?.location}</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{business?.todayAppointments}</div>
          <div className="text-xs text-muted-foreground">Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-success">£{business?.weeklyRevenue}</div>
          <div className="text-xs text-muted-foreground">Week</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary">{business?.conversionRate}%</div>
          <div className="text-xs text-muted-foreground">Rate</div>
        </div>
      </div>

      {/* Conversion Rate Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Booking Conversion</span>
          <span className="text-xs font-medium text-foreground">{business?.conversionRate}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${business?.conversionRate}%` }}
          />
        </div>
      </div>

      {/* Last Activity */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
        <span>Last activity</span>
        <span>{formatLastActivity(business?.lastActivity)}</span>
      </div>

      {/* Professional Tier Badge */}
      {isProfessionalTier && (
        <div className="absolute top-2 right-2">
          <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md font-medium">
            Pro
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
