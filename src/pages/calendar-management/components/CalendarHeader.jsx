import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CalendarHeader = ({ 
  currentDate, 
  viewMode, 
  onViewModeChange, 
  onDateChange, 
  onTodayClick 
}) => {
  const formatHeaderDate = () => {
    const options = { 
      year: 'numeric', 
      month: 'long',
      ...(viewMode === 'day' && { day: 'numeric' })
    };
    return currentDate?.toLocaleDateString('en-GB', options);
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'day':
        newDate?.setDate(newDate?.getDate() + direction);
        break;
      case 'week':
        newDate?.setDate(newDate?.getDate() + (direction * 7));
        break;
      case 'month':
        newDate?.setMonth(newDate?.getMonth() + direction);
        break;
    }
    
    onDateChange(newDate);
  };

  const viewModes = [
    { key: 'day', label: 'Day', icon: 'Calendar' },
    { key: 'week', label: 'Week', icon: 'CalendarDays' },
    { key: 'month', label: 'Month', icon: 'CalendarRange' }
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Date Navigation */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate(-1)}
            className="h-9 w-9"
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          
          <h2 className="text-xl font-semibold text-foreground min-w-[200px] text-center">
            {formatHeaderDate()}
          </h2>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate(1)}
            className="h-9 w-9"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={onTodayClick}
          className="hidden sm:flex"
        >
          Today
        </Button>
      </div>
      {/* View Mode Toggle */}
      <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
        {viewModes?.map((mode) => (
          <Button
            key={mode?.key}
            variant={viewMode === mode?.key ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(mode?.key)}
            className="flex items-center space-x-2"
          >
            <Icon name={mode?.icon} size={16} />
            <span className="hidden sm:inline">{mode?.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
