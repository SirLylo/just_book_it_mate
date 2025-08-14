import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';

const SubscriptionTierIndicator = ({
  tier = "Basic",
  status = "active",
  className
}) => {
  const getTierConfig = (tierName) => {
    const configs = {
      Basic: {
        icon: 'User',
        color: 'bg-secondary text-secondary-foreground',
        label: 'Basic',
        price: '£19/month'
      },
      Professional: {
        icon: 'Crown',
        color: 'bg-primary text-primary-foreground',
        label: 'Professional', 
        price: '£29/month'
      }
    };
    return configs?.[tierName] || configs?.Basic;
  };

  const config = getTierConfig(tier);
  const isActive = status === 'active';

  return (
    <div className={cn(
      "inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium",
      config?.color,
      !isActive && "opacity-60",
      className
    )}>
      <Icon name={config?.icon} size={14} />
      <span>{config?.label}</span>
      {!isActive && (
        <Icon name="AlertCircle" size={14} className="text-warning" />
      )}
    </div>
  );
};

export default SubscriptionTierIndicator;
