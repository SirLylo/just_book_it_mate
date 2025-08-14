import React from 'react';
import Icon from '../../../components/AppIcon';

const BusinessTypeSelector = ({ selectedType, onTypeSelect, error }) => {
  const businessTypes = [
    {
      id: 'trades',
      name: 'Trades & Services',
      description: 'Plumbers, electricians, carpenters, handymen',
      icon: 'Wrench',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      id: 'beauty',
      name: 'Beauty & Wellness',
      description: 'Hairdressers, nail technicians, massage therapists',
      icon: 'Sparkles',
      color: 'bg-pink-50 border-pink-200 text-pink-700',
      iconColor: 'text-pink-600'
    },
    {
      id: 'driving',
      name: 'Driving Instruction',
      description: 'Driving instructors, theory test preparation',
      icon: 'Car',
      color: 'bg-green-50 border-green-200 text-green-700',
      iconColor: 'text-green-600'
    },
    {
      id: 'other',
      name: 'Other Services',
      description: 'Consultancy, tutoring, fitness training',
      icon: 'Briefcase',
      color: 'bg-gray-50 border-gray-200 text-gray-700',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">What type of business are you?</h3>
        <p className="text-sm text-muted-foreground">This helps us set up the right services and pricing for your industry.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => onTypeSelect(type?.id)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-moderate
              ${selectedType === type?.id 
                ? 'border-primary bg-primary/5 shadow-subtle' 
                : 'border-border bg-card hover:border-primary/30'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-lg ${selectedType === type?.id ? 'bg-primary text-primary-foreground' : type?.color}
              `}>
                <Icon 
                  name={type?.icon} 
                  size={20} 
                  className={selectedType === type?.id ? '' : type?.iconColor}
                />
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${selectedType === type?.id ? 'text-primary' : 'text-foreground'}`}>
                  {type?.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{type?.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      {error && (
        <p className="text-sm text-error mt-2">{error}</p>
      )}
    </div>
  );
};

export default BusinessTypeSelector;
