import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const UpcomingAppointmentsWidget = ({
  appointments = [],
  selectedBusinessId,
  userTier = "Basic",
  onManageAppointments,
  className
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('time');

  const isProfessionalTier = userTier === "Professional";

  const filterOptions = [
    { value: 'all', label: 'All Businesses' },
    { value: 'confirmed', label: 'Confirmed Only' },
    { value: 'pending', label: 'Pending Only' },
    { value: 'today', label: 'Today Only' }
  ];

  const sortOptions = [
    { value: 'time', label: 'By Time' },
    { value: 'business', label: 'By Business' },
    { value: 'status', label: 'By Status' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      cancelled: 'text-error bg-error/10'
    };
    return colors?.[status] || 'text-muted-foreground bg-muted/10';
  };

  const filteredAndSortedAppointments = appointments
    ?.filter(appointment => {
      switch (filter) {
        case 'confirmed':
          return appointment?.status === 'confirmed';
        case 'pending':
          return appointment?.status === 'pending';
        case 'today':
          return true; // Assume all appointments shown are for today
        default:
          return true;
      }
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'business':
          return a?.businessName?.localeCompare(b?.businessName);
        case 'status':
          return a?.status?.localeCompare(b?.status);
        default:
          return a?.time?.localeCompare(b?.time);
      }
    });

  const handleAppointmentAction = (appointment, action) => {
    console.log(`${action} appointment:`, appointment?.id);
    // Handle appointment actions
  };

  return (
    <div className={cn("bg-card rounded-lg border border-border p-6 shadow-subtle", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Upcoming Appointments</h3>
          {isProfessionalTier && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-md font-medium">
              Pro
            </span>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onManageAppointments}
          iconName="Settings"
          iconPosition="left"
        >
          Manage
        </Button>
      </div>

      {/* Filters - Professional Only */}
      {isProfessionalTier && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Select
            options={filterOptions}
            value={filter}
            onChange={setFilter}
            placeholder="Filter appointments"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAndSortedAppointments?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No upcoming appointments</p>
            <Button
              variant="outline"
              onClick={onManageAppointments}
              iconName="Plus"
              iconPosition="left"
            >
              Add Appointment
            </Button>
          </div>
        ) : (
          filteredAndSortedAppointments?.map((appointment) => (
            <div
              key={appointment?.id}
              className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-foreground">{appointment?.customerName}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      getStatusColor(appointment?.status)
                    )}>
                      {appointment?.status?.charAt(0)?.toUpperCase() + appointment?.status?.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">{appointment?.service}</p>
                  
                  {isProfessionalTier && appointment?.businessName && (
                    <div className="flex items-center space-x-1 mb-2">
                      <Icon name="Building" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{appointment?.businessName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{appointment?.time} ({appointment?.duration})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Pound" size={14} />
                      <span>{appointment?.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppointmentAction(appointment, 'confirm')}
                  iconName="Check"
                  iconPosition="left"
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppointmentAction(appointment, 'reschedule')}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Reschedule
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAppointmentAction(appointment, 'contact')}
                  iconName="MessageSquare"
                  iconPosition="left"
                >
                  Contact
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {appointments?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-foreground">
                {appointments?.filter(a => a?.status === 'confirmed')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Confirmed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warning">
                {appointments?.filter(a => a?.status === 'pending')?.length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="text-lg font-bold text-success">
                £{appointments?.reduce((sum, a) => sum + parseInt(a?.price?.replace('£', '')), 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Value</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointmentsWidget;
