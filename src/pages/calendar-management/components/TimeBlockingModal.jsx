import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const TimeBlockingModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onBlockCreate 
}) => {
  const [formData, setFormData] = React.useState({
    title: '',
    startTime: '12:00',
    endTime: '13:00',
    reason: 'lunch',
    isRecurring: false,
    recurringDays: [],
    notes: ''
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const blockReasons = [
    { value: 'lunch', label: 'Lunch Break' },
    { value: 'personal', label: 'Personal Time' },
    { value: 'travel', label: 'Travel Time' },
    { value: 'maintenance', label: 'Equipment Maintenance' },
    { value: 'training', label: 'Training/Education' },
    { value: 'holiday', label: 'Holiday/Vacation' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'other', label: 'Other' }
  ];

  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        startTime: '12:00',
        endTime: '13:00',
        reason: 'lunch',
        isRecurring: false,
        recurringDays: [],
        notes: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);

    try {
      const blockData = {
        id: Date.now(),
        date: selectedDate,
        title: formData?.title || blockReasons?.find(r => r?.value === formData?.reason)?.label,
        startTime: formData?.startTime,
        endTime: formData?.endTime,
        reason: formData?.reason,
        isRecurring: formData?.isRecurring,
        recurringDays: formData?.recurringDays,
        notes: formData?.notes,
        type: 'blocked'
      };

      await onBlockCreate(blockData);
      onClose();
    } catch (error) {
      console.error('Time blocking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecurringDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev?.recurringDays?.includes(day)
        ? prev?.recurringDays?.filter(d => d !== day)
        : [...prev?.recurringDays, day]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-floating w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Block Time</h2>
            <p className="text-sm text-muted-foreground">
              {selectedDate?.toLocaleDateString('en-GB')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Block Reason */}
          <Select
            label="Reason for Blocking"
            options={blockReasons}
            value={formData?.reason}
            onChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
            required
          />

          {/* Custom Title */}
          <Input
            label="Custom Title (Optional)"
            type="text"
            value={formData?.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e?.target?.value }))}
            placeholder="Enter custom title"
            description="Leave empty to use reason as title"
          />

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={formData?.startTime}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e?.target?.value }))}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formData?.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e?.target?.value }))}
              required
            />
          </div>

          {/* Recurring Option */}
          <Checkbox
            label="Make this a recurring block"
            description="Block the same time slot on multiple days"
            checked={formData?.isRecurring}
            onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e?.target?.checked }))}
          />

          {/* Recurring Days */}
          {formData?.isRecurring && (
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Select Days to Block
              </label>
              <div className="grid grid-cols-2 gap-2">
                {weekDays?.map((day) => (
                  <Checkbox
                    key={day?.value}
                    label={day?.label}
                    checked={formData?.recurringDays?.includes(day?.value)}
                    onChange={() => handleRecurringDayToggle(day?.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Notes (Optional)
            </label>
            <textarea
              value={formData?.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e?.target?.value }))}
              placeholder="Additional notes or instructions..."
              className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
          </div>

          {/* Warning for Existing Appointments */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-warning">Important</div>
                <div className="text-muted-foreground mt-1">
                  Any existing appointments during this time will need to be rescheduled manually.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              className="flex-1"
            >
              Block Time
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeBlockingModal;
