import React, { useState, useEffect } from 'react';
import BusinessNavigationHeader from '../../components/ui/BusinessNavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import CalendarHeader from './components/CalendarHeader';
import MiniCalendar from './components/MiniCalendar';
import AvailabilityLegend from './components/AvailabilityLegend';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import MonthView from './components/MonthView';
import QuickBookingModal from './components/QuickBookingModal';
import TimeBlockingModal from './components/TimeBlockingModal';
import Button from '../../components/ui/Button';


const CalendarManagement = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState('week');
  const [showQuickBooking, setShowQuickBooking] = React.useState(false);
  const [showTimeBlocking, setShowTimeBlocking] = React.useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);
  const [appointments, setAppointments] = React.useState([]);

  // Mock user profile
  const userProfile = {
    name: "Sarah Mitchell",
    email: "sarah@justbookitmate.co.uk"
  };

  // Mock appointments data
  React.useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        date: new Date(2025, 7, 10),
        startTime: '09:00',
        endTime: '10:00',
        customerName: 'Emma Thompson',
        customerEmail: 'emma.t@email.com',
        customerPhone: '+44 7700 900123',
        service: 'Haircut & Style',
        price: 45,
        duration: 60,
        status: 'confirmed',
        notes: 'First time customer, prefers shorter styles'
      },
      {
        id: 2,
        date: new Date(2025, 7, 10),
        startTime: '10:30',
        endTime: '12:00',
        customerName: 'James Wilson',
        customerEmail: 'james.w@email.com',
        customerPhone: '+44 7700 900456',
        service: 'Hair Coloring',
        price: 85,
        duration: 90,
        status: 'confirmed',
        notes: 'Regular customer, usual brown shade'
      },
      {
        id: 3,
        date: new Date(2025, 7, 10),
        startTime: '14:00',
        endTime: '15:30',
        customerName: 'Sophie Davis',
        customerEmail: 'sophie.d@email.com',
        customerPhone: '+44 7700 900789',
        service: 'Highlights',
        price: 95,
        duration: 90,
        status: 'pending',
        notes: 'Wants blonde highlights, consultation needed'
      },
      {
        id: 4,
        date: new Date(2025, 7, 11),
        startTime: '09:30',
        endTime: '10:30',
        customerName: 'Michael Brown',
        customerEmail: 'mike.b@email.com',
        customerPhone: '+44 7700 900012',
        service: 'Hair Treatment',
        price: 35,
        duration: 60,
        status: 'confirmed',
        notes: 'Deep conditioning treatment'
      },
      {
        id: 5,
        date: new Date(2025, 7, 12),
        startTime: '11:00',
        endTime: '14:00',
        customerName: 'Charlotte Evans',
        customerEmail: 'charlotte.e@email.com',
        customerPhone: '+44 7700 900345',
        service: 'Wedding Package',
        price: 150,
        duration: 180,
        status: 'confirmed',
        notes: 'Bridal hair and makeup for 2pm ceremony'
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  const businessHours = {
    start: '09:00',
    end: '17:00'
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleTimeSlotClick = (date, time) => {
    setSelectedTimeSlot({ date, time });
    setShowQuickBooking(true);
  };

  const handleDateClick = (date) => {
    setCurrentDate(date);
    if (viewMode === 'month') {
      setViewMode('day');
    }
  };

  const handleAppointmentEdit = (appointment) => {
    console.log('Edit appointment:', appointment);
    // Handle appointment editing logic
  };

  const handleAppointmentCancel = (appointment) => {
    if (window.confirm(`Are you sure you want to cancel the appointment with ${appointment?.customerName}?`)) {
      setAppointments(prev => prev?.filter(apt => apt?.id !== appointment?.id));
    }
  };

  const handleAppointmentNote = (appointment) => {
    const newNote = window.prompt('Add a note:', appointment?.notes || '');
    if (newNote !== null) {
      setAppointments(prev => prev?.map(apt => 
        apt?.id === appointment?.id ? { ...apt, notes: newNote } : apt
      ));
    }
  };

  const handleBookingCreate = async (booking) => {
    setAppointments(prev => [...prev, booking]);
  };

  const handleBlockCreate = async (blockData) => {
    // Handle time blocking logic
    console.log('Create time block:', blockData);
  };

  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            appointments={appointments}
            onAppointmentEdit={handleAppointmentEdit}
            onAppointmentCancel={handleAppointmentCancel}
            onAppointmentNote={handleAppointmentNote}
            onTimeSlotClick={handleTimeSlotClick}
            businessHours={businessHours}
          />
        );
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            appointments={appointments}
            onAppointmentEdit={handleAppointmentEdit}
            onAppointmentCancel={handleAppointmentCancel}
            onAppointmentNote={handleAppointmentNote}
            onDateClick={handleDateClick}
          />
        );
      default:
        return (
          <WeekView
            currentDate={currentDate}
            appointments={appointments}
            onAppointmentEdit={handleAppointmentEdit}
            onAppointmentCancel={handleAppointmentCancel}
            onAppointmentNote={handleAppointmentNote}
            onTimeSlotClick={handleTimeSlotClick}
            businessHours={businessHours}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BusinessNavigationHeader 
        userProfile={userProfile}
        notificationCount={3}
        onToggleCollapse={() => {}}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Calendar Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your appointments, availability, and schedule
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowTimeBlocking(true)}
                iconName="Ban"
                iconPosition="left"
              >
                Block Time
              </Button>
              <Button
                variant="default"
                onClick={() => setShowQuickBooking(true)}
                iconName="Plus"
                iconPosition="left"
              >
                New Appointment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <MiniCalendar
                currentDate={currentDate}
                onDateSelect={setCurrentDate}
                appointments={appointments}
              />
              
              <AvailabilityLegend />
              
              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickBooking(true)}
                    className="w-full justify-start"
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Appointment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTimeBlocking(true)}
                    className="w-full justify-start"
                    iconName="Ban"
                    iconPosition="left"
                  >
                    Block Time
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    iconName="Download"
                    iconPosition="left"
                  >
                    Export Schedule
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Calendar */}
            <div className="lg:col-span-3">
              <CalendarHeader
                currentDate={currentDate}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onDateChange={setCurrentDate}
                onTodayClick={handleTodayClick}
              />
              
              {renderCalendarView()}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <QuickBookingModal
        isOpen={showQuickBooking}
        onClose={() => {
          setShowQuickBooking(false);
          setSelectedTimeSlot(null);
        }}
        selectedDate={selectedTimeSlot?.date || currentDate}
        selectedTime={selectedTimeSlot?.time || '09:00'}
        onBookingCreate={handleBookingCreate}
      />

      <TimeBlockingModal
        isOpen={showTimeBlocking}
        onClose={() => setShowTimeBlocking(false)}
        selectedDate={currentDate}
        onBlockCreate={handleBlockCreate}
      />
    </div>
  );
};

export default CalendarManagement;
