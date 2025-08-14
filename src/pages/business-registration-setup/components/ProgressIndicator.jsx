import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, stepLabels }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  const defaultStepLabels = [
    'Business Type',
    'Business Details', 
    'Services',
    'Availability',
    'Review & Complete'
  ];

  const labels = stepLabels || defaultStepLabels;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="absolute top-0 left-0 w-full flex justify-between transform -translate-y-1">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div
                key={stepNumber}
                className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${isCompleted 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : isCurrent
                    ? 'bg-primary border-primary text-primary-foreground animate-pulse'
                    : 'bg-background border-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <Icon name="Check" size={10} />
                ) : (
                  <span className={`text-xs font-medium ${isCurrent ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                    {stepNumber}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Step Labels */}
      <div className="flex justify-between text-xs">
        {labels?.slice(0, totalSteps)?.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`
                text-center max-w-[80px] sm:max-w-none
                ${isCurrent 
                  ? 'text-primary font-medium' 
                  : isCompleted 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
                }
              `}
            >
              <span className="block truncate sm:whitespace-normal">
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {/* Current Step Info */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}: {labels?.[currentStep - 1]}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;
