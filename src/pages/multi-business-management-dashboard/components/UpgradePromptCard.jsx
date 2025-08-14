import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UpgradePromptCard = ({
  onUpgrade,
  className
}) => {
  const proFeatures = [
    "Manage multiple business locations",
    "Advanced analytics and reporting", 
    "Consolidated dashboard view",
    "QR code marketing campaigns",
    "Priority customer support"
  ];

  return (
    <div className={cn(
      "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg border border-primary/20 p-6",
      className
    )}>
      <div className="flex items-start space-x-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
          <Icon name="Crown" size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Unlock Professional Features
          </h3>
          <p className="text-muted-foreground mb-4">
            Upgrade to Professional to manage multiple businesses, access advanced analytics, and boost your revenue potential.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
            {proFeatures?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button
              variant="default"
              onClick={onUpgrade}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Upgrade to Professional
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">£29</span>
              <div className="text-sm text-muted-foreground">
                <div>/month</div>
                <div className="line-through">£39</div>
              </div>
              <div className="bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
                Save 25%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePromptCard;
