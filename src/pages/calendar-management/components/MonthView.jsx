import React from 'react';
import AppointmentCard from './AppointmentCard';

import Icon from '../../../components/AppIcon';

const MonthView = ({ 
  currentDate, 
  appointments = [], 
  onAppointmentEdit,
  onAppointmentCancel,
  onAppointmentNote,
  onDateClick 
}) => {
  const getDaysInMonth = () => {
    const year = currentDate?.getFullYear();
    const month = currentDate?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonth = new Date(year, month - 1, 0);
      const prevDate = new Date(year, month - 1, prevMonth.getDate() - (startingDayOfWeek - 1 - i));
      days?.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Add days from next month to complete the grid
    const remainingCells = 42 - days?.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days?.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments?.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate?.toDateString() === date?.toDateString();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const days = getDaysInMonth();
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getMonthStats = () => {
    const monthAppointments = appointments?.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate?.getMonth() === currentDate?.getMonth() && 
             aptDate?.getFullYear() === currentDate?.getFullYear();
    });

    const total = monthAppointments?.length;
    const revenue = monthAppointments?.reduce((sum, apt) => sum + (apt?.price || 0), 0);
    const avgPerDay = total > 0 ? Math.round(revenue / total) : 0;
    
    return { total, revenue, avgPerDay };
  };

  const stats = getMonthStats();

  return (
    <div className="space-y-6">
      {/* Month Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stats?.total}</div>
              <div className="text-sm text-muted-foreground">Total Appointments</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="PoundSterling" size={20} className="text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">£{stats?.revenue}</div>
              <div className="text-sm text-muted-foreground">Monthly Revenue</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">£{stats?.avgPerDay}</div>
              <div className="text-sm text-muted-foreground">Avg per Appointment</div>
            </div>
          </div>
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays?.map((day) => (
            <div key={day} className="p-4 text-center bg-muted">
              <div className="text-sm font-medium text-foreground">{day}</div>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days?.map((dayObj, index) => {
            const dayAppointments = getAppointmentsForDate(dayObj?.date);
            const hasAppointments = dayAppointments?.length > 0;
            
            return (
              <div
                key={index}
                className={`
                  min-h-[120px] border-r border-b border-border p-2 cursor-pointer transition-micro
                  ${dayObj?.isCurrentMonth ? 'bg-card hover:bg-secondary/20' : 'bg-muted/30'}
                  ${isToday(dayObj?.date) ? 'bg-primary/5 border-primary/20' : ''}
                `}
                onClick={() => onDateClick(dayObj?.date)}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`
                    text-sm font-medium
                    ${dayObj?.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}
                    ${isToday(dayObj?.date) ? 'text-primary font-bold' : ''}
                  `}>
                    {dayObj?.date?.getDate()}
                  </span>
                  
                  {hasAppointments && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                {/* Appointments */}
                <div className="space-y-1">
                  {dayAppointments?.slice(0, 3)?.map((appointment) => (
                    <div
                      key={appointment?.id}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onAppointmentEdit(appointment);
                      }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onEdit={onAppointmentEdit}
                        onCancel={onAppointmentCancel}
                        onAddNote={onAppointmentNote}
                        viewMode="month"
                      />
                    </div>
                  ))}
                  
                  {dayAppointments?.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayAppointments?.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
