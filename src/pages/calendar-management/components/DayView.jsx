import React from 'react';
import AppointmentCard from './AppointmentCard';
import Button from '../../../components/ui/Button';


const DayView = ({ 
  currentDate, 
  appointments = [], 
  onAppointmentEdit,
  onAppointmentCancel,
  onAppointmentNote,
  onTimeSlotClick,
  businessHours = { start: '09:00', end: '17:00' }
}) => {
  // Generate time slots (15-minute intervals for day view)
  const getTimeSlots = () => {
    const slots = [];
    const start = parseInt(businessHours?.start?.split(':')?.[0]);
    const end = parseInt(businessHours?.end?.split(':')?.[0]);
    
    for (let hour = start; hour <= end; hour++) {
      slots?.push(`${hour?.toString()?.padStart(2, '0')}:00`);
      if (hour < end) {
        slots?.push(`${hour?.toString()?.padStart(2, '0')}:15`);
        slots?.push(`${hour?.toString()?.padStart(2, '0')}:30`);
        slots?.push(`${hour?.toString()?.padStart(2, '0')}:45`);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  const getAppointmentsForDay = () => {
    return appointments?.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate?.toDateString() === currentDate?.toDateString();
    });
  };

  const getAppointmentPosition = (appointment) => {
    const startHour = parseInt(appointment?.startTime?.split(':')?.[0]);
    const startMinute = parseInt(appointment?.startTime?.split(':')?.[1]);
    const endHour = parseInt(appointment?.endTime?.split(':')?.[0]);
    const endMinute = parseInt(appointment?.endTime?.split(':')?.[1]);
    
    const businessStartHour = parseInt(businessHours?.start?.split(':')?.[0]);
    
    const startSlot = ((startHour - businessStartHour) * 4) + Math.floor(startMinute / 15);
    const duration = ((endHour - startHour) * 4) + ((endMinute - startMinute) / 15);
    
    return { top: startSlot * 40, height: duration * 40 };
  };

  const dayAppointments = getAppointmentsForDay();

  const formatDate = () => {
    return currentDate?.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getTodayStats = () => {
    const total = dayAppointments?.length;
    const completed = dayAppointments?.filter(apt => apt?.status === 'completed')?.length;
    const pending = dayAppointments?.filter(apt => apt?.status === 'pending')?.length;
    const revenue = dayAppointments?.reduce((sum, apt) => sum + (apt?.price || 0), 0);
    
    return { total, completed, pending, revenue };
  };

  const stats = getTodayStats();

  return (
    <div className="space-y-6">
      {/* Day Header with Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{formatDate()}</h2>
            <p className="text-muted-foreground mt-1">
              {stats?.total} appointments scheduled
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats?.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{stats?.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{stats?.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">£{stats?.revenue}</div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>
      </div>
      {/* Day Schedule */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Schedule</h3>
            <Button
              variant="outline"
              onClick={() => onTimeSlotClick(currentDate, '09:00')}
              iconName="Plus"
              iconPosition="left"
            >
              Add Appointment
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Time Grid */}
          <div className="flex">
            {/* Time Column */}
            <div className="w-20 bg-muted/50">
              {timeSlots?.map((time) => (
                <div key={time} className="h-[40px] p-2 border-b border-border flex items-center">
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
              ))}
            </div>

            {/* Schedule Column */}
            <div className="flex-1 relative border-l border-border">
              {/* Time Slots */}
              {timeSlots?.map((time, index) => (
                <div
                  key={time}
                  className="h-[40px] border-b border-border hover:bg-secondary/20 cursor-pointer transition-micro flex items-center px-4"
                  onClick={() => onTimeSlotClick(currentDate, time)}
                >
                  <span className="text-sm text-muted-foreground">Available</span>
                </div>
              ))}

              {/* Appointments */}
              <div className="absolute inset-0 pointer-events-none">
                {dayAppointments?.map((appointment) => {
                  const position = getAppointmentPosition(appointment);
                  return (
                    <div
                      key={appointment?.id}
                      className="absolute left-2 right-2 pointer-events-auto"
                      style={{
                        top: `${position?.top}px`,
                        height: `${Math.max(position?.height, 40)}px`
                      }}
                    >
                      <AppointmentCard
                        appointment={appointment}
                        onEdit={onAppointmentEdit}
                        onCancel={onAppointmentCancel}
                        onAddNote={onAppointmentNote}
                        viewMode="day"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Current Time Indicator */}
      <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-floating">
        <div className="text-sm font-medium">
          {new Date()?.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
