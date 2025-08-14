import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import Button from '../../../components/ui/Button';

const PricingCard = ({ 
  tier, 
  billingCycle, 
  isSelected, 
  onSelect, 
  index 
}) => {
  const getPrice = () => {
    return billingCycle === 'annual' ? tier?.price?.annual : tier?.price?.monthly;
  };

  const getSavings = () => {
    const monthlyTotal = tier?.price?.monthly * 12;
    const annualPrice = tier?.price?.annual;
    return monthlyTotal - annualPrice;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={`relative rounded-2xl border-2 transition-all duration-300 ${
        isSelected
          ? 'border-primary shadow-moderate scale-105'
          : 'border-border hover:border-primary/50 shadow-subtle'
      } ${tier?.popular ? 'ring-2 ring-primary/20' : ''}`}
    >
      {/* Popular Badge */}
      {tier?.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center">
            <Star size={14} className="mr-1" />
            Most Popular
          </span>
        </div>
      )}
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-foreground">{tier?.name}</h3>
          <p className="text-muted-foreground mt-1">{tier?.description}</p>
          
          {/* Price */}
          <div className="mt-4">
            <span className="text-4xl font-bold text-primary">
              £{getPrice()}
            </span>
            <span className="text-muted-foreground">
              /{billingCycle === 'annual' ? 'year' : 'month'}
            </span>
            
            {billingCycle === 'annual' && (
              <div className="text-sm text-success font-medium mt-1">
                Save £{getSavings()} per year
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {tier?.features?.map((feature, featureIndex) => (
            <div
              key={featureIndex}
              className="flex items-center space-x-3"
            >
              {feature?.included ? (
                <Check size={16} className="text-success flex-shrink-0" />
              ) : (
                <X size={16} className="text-muted-foreground flex-shrink-0" />
              )}
              <span className={
                feature?.included 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              }>
                {feature?.name}
              </span>
            </div>
          ))}
        </div>

        {/* Select Button */}
        <Button
          onClick={() => onSelect(tier?.id)}
          variant={isSelected ? 'default' : 'outline'}
          className="w-full"
          size="lg"
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingCard;
