import React, { useState, useEffect } from 'react';
import CustomerBookingHeader from '../../components/ui/CustomerBookingHeader';
import BusinessInfoCard from './components/BusinessInfoCard';
import ServiceSelection from './components/ServiceSelection';
import CalendarWidget from './components/CalendarWidget';
import TimeSlotSelection from './components/TimeSlotSelection';
import CustomerForm from './components/CustomerForm';
import BookingSummary from './components/BookingSummary';
import BookingConfirmation from './components/BookingConfirmation';

const CustomerBookingInterface = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerData, setCustomerData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Mock business data
  const businessInfo = {
    name: "Elite Hair & Beauty Studio",
    category: "Hair & Beauty Services",
    description: `Professional hair and beauty services in the heart of London. Our experienced stylists and beauty therapists provide premium treatments using only the finest products. From cutting-edge hair styling to relaxing spa treatments, we're dedicated to helping you look and feel your absolute best.`,
    headerImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop",
    phone: "+44 20 7123 4567",
    email: "bookings@elitehairbeauty.co.uk",
    address: "123 Oxford Street, London, W1D 2HX",
    rating: 4.8,
    reviewCount: 247,
    openingHours: [
      { day: "Monday", hours: "9:00 - 18:00" },
      { day: "Tuesday", hours: "9:00 - 20:00" },
      { day: "Wednesday", hours: "9:00 - 20:00" },
      { day: "Thursday", hours: "9:00 - 21:00" },
      { day: "Friday", hours: "9:00 - 21:00" },
      { day: "Saturday", hours: "8:00 - 19:00" },
      { day: "Sunday", hours: "10:00 - 17:00" }
    ]
  };

  // Mock services data
  const services = [
    {
      id: "haircut-styling",
      name: "Cut & Blow Dry",
      description: "Professional haircut with wash and blow dry styling",
      price: 65.00,
      duration: 90,
      category: "Hair Services",
      popular: true,
      includes: ["Consultation", "Shampoo & Condition", "Cut", "Blow Dry", "Styling"]
    },
    {
      id: "hair-colour",
      name: "Full Head Colour",
      description: "Complete hair colouring service with premium products",
      price: 120.00,
      duration: 180,
      category: "Hair Services",
      includes: ["Colour consultation", "Full head application", "Wash & condition", "Blow dry"]
    },
    {
      id: "highlights",
      name: "Highlights & Lowlights",
      description: "Professional highlighting service for dimension and depth",
      price: 95.00,
      duration: 150,
      category: "Hair Services",
      includes: ["Foil highlights", "Toner application", "Wash & condition", "Blow dry"]
    },
    {
      id: "facial-treatment",
      name: "Luxury Facial Treatment",
      description: "Deep cleansing and rejuvenating facial with premium skincare",
      price: 85.00,
      duration: 75,
      category: "Beauty Services",
      popular: true,
      includes: ["Skin analysis", "Deep cleanse", "Exfoliation", "Mask treatment", "Moisturising"]
    },
    {
      id: "manicure-pedicure",
      name: "Manicure & Pedicure",
      description: "Complete nail care service for hands and feet",
      price: 55.00,
      duration: 90,
      category: "Beauty Services",
      includes: ["Nail shaping", "Cuticle care", "Polish application", "Hand & foot massage"]
    },
    {
      id: "eyebrow-threading",
      name: "Eyebrow Threading & Tinting",
      description: "Professional eyebrow shaping and tinting service",
      price: 25.00,
      duration: 30,
      category: "Beauty Services",
      includes: ["Consultation", "Threading", "Tinting", "Aftercare advice"]
    }
  ];

  // Mock available dates (next 30 days excluding Sundays)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() + i);
      
      // Skip Sundays for this mock business
      if (date?.getDay() !== 0) {
        dates?.push(date?.toISOString()?.split('T')?.[0]);
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Mock time slots based on selected date
  const generateTimeSlots = (date) => {
    if (!date) return [];

    const slots = [];
    const dayOfWeek = new Date(date + 'T00:00:00')?.getDay();
    
    // Different hours for different days
    let startHour, endHour;
    if (dayOfWeek === 6) { // Saturday
      startHour = 8;
      endHour = 19;
    } else if (dayOfWeek === 0) { // Sunday
      startHour = 10;
      endHour = 17;
    } else { // Weekdays
      startHour = 9;
      endHour = dayOfWeek >= 4 ? 21 : 20; // Thu-Fri until 21:00
    }

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour?.toString()?.padStart(2, '0')}:${minute?.toString()?.padStart(2, '0')}`;
        
        // Mock some slots as unavailable
        const isAvailable = Math.random() > 0.3;
        
        slots?.push({
          time: timeStr,
          available: isAvailable
        });
      }
    }

    return slots;
  };

  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
      setSelectedTime(''); // Reset time when date changes
    }
  }, [selectedDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!customerData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!customerData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!customerData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(customerData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!customerData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+44|0)[1-9]\d{8,9}$/?.test(customerData?.phone?.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }

    if (!customerData?.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!customerData?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!customerData?.postcode?.trim()) {
      newErrors.postcode = 'Postcode is required';
    } else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i?.test(customerData?.postcode?.replace(/\s/g, ''))) {
      newErrors.postcode = 'Please enter a valid UK postcode';
    }

    if (!customerData?.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedServiceDetails = services?.find(s => s?.id === selectedService);
    
    const booking = {
      reference: `BK${Date.now()?.toString()?.slice(-6)}`,
      service: selectedServiceDetails,
      date: selectedDate,
      time: selectedTime,
      customer: customerData,
      status: 'confirmed',
      createdAt: new Date()?.toISOString()
    };

    setBookingDetails(booking);
    setBookingConfirmed(true);
    setIsLoading(false);
  };

  const handleNewBooking = () => {
    setBookingConfirmed(false);
    setBookingDetails(null);
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setCustomerData({});
    setErrors({});
    setCurrentStep(1);
  };

  const handleDownloadConfirmation = () => {
    // Mock download functionality
    const confirmationText = `
BOOKING CONFIRMATION
Reference: ${bookingDetails?.reference}

Service: ${bookingDetails?.service?.name}
Date: ${new Date(bookingDetails.date + 'T00:00:00')?.toLocaleDateString('en-GB')}
Time: ${bookingDetails?.time}
Duration: ${bookingDetails?.service?.duration} minutes
Price: £${bookingDetails?.service?.price?.toFixed(2)}

Customer: ${bookingDetails?.customer?.firstName} ${bookingDetails?.customer?.lastName}
Email: ${bookingDetails?.customer?.email}
Phone: ${bookingDetails?.customer?.phone}

Business: ${businessInfo?.name}
Address: ${businessInfo?.address}
Phone: ${businessInfo?.phone}
    `;

    const blob = new Blob([confirmationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-confirmation-${bookingDetails?.reference}.txt`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate current step based on form completion
  useEffect(() => {
    if (selectedService && selectedDate && selectedTime && customerData?.firstName) {
      setCurrentStep(4);
    } else if (selectedService && selectedDate && selectedTime) {
      setCurrentStep(3);
    } else if (selectedService && selectedDate) {
      setCurrentStep(2);
    } else if (selectedService) {
      setCurrentStep(1);
    }
  }, [selectedService, selectedDate, selectedTime, customerData]);

  if (bookingConfirmed && bookingDetails) {
    return (
      <BookingConfirmation
        bookingDetails={bookingDetails}
        businessInfo={businessInfo}
        onNewBooking={handleNewBooking}
        onDownloadConfirmation={handleDownloadConfirmation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CustomerBookingHeader
        businessProfile={businessInfo}
        currentStep={currentStep}
        totalSteps={4}
        showProgress={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Information */}
            <BusinessInfoCard business={businessInfo} />

            {/* Service Selection */}
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />

            {/* Calendar and Time Selection */}
            {selectedService && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <CalendarWidget
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  businessHours={businessInfo?.openingHours}
                />

                <TimeSlotSelection
                  timeSlots={timeSlots}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  selectedDate={selectedDate}
                  serviceDuration={services?.find(s => s?.id === selectedService)?.duration || 60}
                />
              </div>
            )}

            {/* Customer Form */}
            {selectedService && selectedDate && selectedTime && (
              <CustomerForm
                customerData={customerData}
                onCustomerDataChange={setCustomerData}
                errors={errors}
                onValidation={setErrors}
              />
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              selectedService={selectedService}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              customerData={customerData}
              services={services}
              onConfirmBooking={handleConfirmBooking}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBookingInterface;
