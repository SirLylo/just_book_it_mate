import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarWidget = ({ 
  availableDates, 
  selectedDate, 
  onDateSelect, 
  businessHours,
  blockedDates = [] 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)?.getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)?.getDay();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth?.setMonth(currentMonth?.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isDateAvailable = (date) => {
    const dateStr = date?.toISOString()?.split('T')?.[0];
    return availableDates?.includes(dateStr) && !blockedDates?.includes(dateStr);
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    return date?.toISOString()?.split('T')?.[0] === selectedDate;
  };

  const isDatePast = (date) => {
    return date < today?.setHours(0, 0, 0, 0);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days?.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = isDateAvailable(date);
      const isSelected = isDateSelected(date);
      const isPast = isDatePast(date);

      days?.push(
        <button
          key={day}
          onClick={() => isAvailable && !isPast && onDateSelect(date?.toISOString()?.split('T')?.[0])}
          disabled={!isAvailable || isPast}
          className={`
            h-12 w-full rounded-lg text-sm font-medium transition-micro flex items-center justify-center
            ${isSelected
              ? 'bg-primary text-primary-foreground shadow-subtle'
              : isAvailable && !isPast
              ? 'bg-card hover:bg-secondary text-foreground border border-border hover:border-primary'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center">
        <Icon name="Calendar" size={20} className="mr-2 text-primary" />
        Select Date
      </h2>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(-1)}
          className="h-8 w-8"
        >
          <Icon name="ChevronLeft" size={16} />
        </Button>

        <h3 className="text-lg font-semibold text-foreground">
          {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
        </h3>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateMonth(1)}
          className="h-8 w-8"
        >
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {renderCalendarDays()}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
