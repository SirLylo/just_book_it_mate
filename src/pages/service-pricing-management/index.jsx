import React, { useState, useEffect } from 'react';
import BusinessNavigationHeader from '../../components/ui/BusinessNavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import ServiceCard from './components/ServiceCard';
import ServiceModal from './components/ServiceModal';
import BulkPricingModal from './components/BulkPricingModal';
import ServiceAnalytics from './components/ServiceAnalytics';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const ServicePricingManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Mock user profile
  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah@beautysalon.co.uk"
  };

  // Initialize mock data
  useEffect(() => {
    const mockServices = [
      {
        id: 1,
        name: "Cut & Blow Dry",
        description: "Professional haircut with styling and blow dry finish",
        duration: 60,
        price: 45.00,
        category: "Hair",
        bufferTime: 15,
        maxDailyBookings: 8,
        isActive: true,
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: true,
        advanceBookingDays: 30,
        cancellationHours: 24,
        bookingCount: 42
      },
      {
        id: 2,
        name: "Hair Colour",
        description: "Full head colour with consultation and aftercare advice",
        duration: 120,
        price: 85.00,
        category: "Hair",
        bufferTime: 30,
        maxDailyBookings: 4,
        isActive: true,
        requiresDeposit: true,
        depositAmount: 25.00,
        allowOnlineBooking: true,
        advanceBookingDays: 30,
        cancellationHours: 48,
        bookingCount: 28
      },
      {
        id: 3,
        name: "Manicure",
        description: "Complete nail care with polish application",
        duration: 45,
        price: 25.00,
        category: "Nails",
        bufferTime: 15,
        maxDailyBookings: 6,
        isActive: true,
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: true,
        advanceBookingDays: 14,
        cancellationHours: 12,
        bookingCount: 35
      },
      {
        id: 4,
        name: "Facial Treatment",
        description: "Deep cleansing facial with moisturizing treatment",
        duration: 75,
        price: 55.00,
        category: "Skincare",
        bufferTime: 15,
        maxDailyBookings: 5,
        isActive: true,
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: true,
        advanceBookingDays: 21,
        cancellationHours: 24,
        bookingCount: 18
      },
      {
        id: 5,
        name: "Eyebrow Threading",
        description: "Precise eyebrow shaping using threading technique",
        duration: 30,
        price: 18.00,
        category: "Beauty",
        bufferTime: 10,
        maxDailyBookings: 10,
        isActive: true,
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: true,
        advanceBookingDays: 7,
        cancellationHours: 6,
        bookingCount: 52
      },
      {
        id: 6,
        name: "Massage Therapy",
        description: "Relaxing full body massage with aromatherapy oils",
        duration: 90,
        price: 70.00,
        category: "Wellness",
        bufferTime: 20,
        maxDailyBookings: 4,
        isActive: false,
        requiresDeposit: false,
        depositAmount: 0,
        allowOnlineBooking: false,
        advanceBookingDays: 14,
        cancellationHours: 24,
        bookingCount: 8
      }
    ];

    const mockCategories = ["Hair", "Nails", "Skincare", "Beauty", "Wellness"];

    setServices(mockServices);
    setCategories(mockCategories);
  }, []);

  // Filter and sort services
  const filteredServices = services?.filter(service => {
      const matchesSearch = service?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           service?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesCategory = !filterCategory || service?.category === filterCategory;
      return matchesSearch && matchesCategory;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.name?.localeCompare(b?.name);
        case 'price':
          return b?.price - a?.price;
        case 'bookings':
          return b?.bookingCount - a?.bookingCount;
        case 'revenue':
          return (b?.price * b?.bookingCount) - (a?.price * a?.bookingCount);
        default:
          return 0;
      }
    });

  const handleAddService = () => {
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (serviceId, serviceData) => {
    if (serviceData) {
      setEditingService(serviceData);
      setIsServiceModalOpen(true);
    } else {
      // Quick price edit
      const service = services?.find(s => s?.id === serviceId);
      if (service) {
        setEditingService(service);
        setIsServiceModalOpen(true);
      }
    }
  };

  const handleSaveService = (serviceData) => {
    if (serviceData?.id) {
      // Update existing service
      setServices(prev => prev?.map(service => 
        service?.id === serviceData?.id ? { ...serviceData } : service
      ));
    } else {
      // Add new service
      const newService = {
        ...serviceData,
        id: Math.max(...services?.map(s => s?.id)) + 1,
        bookingCount: 0
      };
      setServices(prev => [...prev, newService]);
    }
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      setServices(prev => prev?.filter(service => service?.id !== serviceId));
    }
  };

  const handleToggleActive = (serviceId) => {
    setServices(prev => prev?.map(service => 
      service?.id === serviceId 
        ? { ...service, isActive: !service?.isActive }
        : service
    ));
  };

  const handleDuplicateService = (serviceId) => {
    const service = services?.find(s => s?.id === serviceId);
    if (service) {
      const duplicatedService = {
        ...service,
        id: Math.max(...services?.map(s => s?.id)) + 1,
        name: `${service?.name} (Copy)`,
        bookingCount: 0
      };
      setServices(prev => [...prev, duplicatedService]);
    }
  };

  const handleBulkPricing = (updates) => {
    setServices(prev => prev?.map(service => {
      const update = updates?.find(u => u?.id === service?.id);
      return update ? { ...service, price: update?.price } : service;
    }));
  };

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price (High to Low)' },
    { value: 'bookings', label: 'Most Booked' },
    { value: 'revenue', label: 'Revenue (High to Low)' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories?.map(cat => ({ value: cat, label: cat }))
  ];

  const activeServices = services?.filter(s => s?.isActive)?.length;
  const totalRevenue = services?.reduce((sum, service) => sum + (service?.price * service?.bookingCount), 0);

  return (
    <div className="min-h-screen bg-background">
      <BusinessNavigationHeader 
        userProfile={userProfile}
        notificationCount={3}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Service & Pricing Management</h1>
              <p className="text-muted-foreground mt-2">
                Configure your services, set pricing, and manage booking parameters
              </p>
              <div className="flex items-center space-x-6 mt-4 text-sm text-muted-foreground">
                <span>{services?.length} Total Services</span>
                <span>{activeServices} Active</span>
                <span>£{totalRevenue?.toFixed(2)} Total Revenue (30d)</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-6 lg:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
                iconName={showAnalytics ? "BarChart3" : "TrendingUp"}
                iconPosition="left"
              >
                {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setIsBulkModalOpen(true)}
                iconName="DollarSign"
                iconPosition="left"
              >
                Bulk Pricing
              </Button>
              
              <Button
                onClick={handleAddService}
                iconName="Plus"
                iconPosition="left"
              >
                Add Service
              </Button>
            </div>
          </div>

          {/* Analytics Section */}
          {showAnalytics && (
            <div className="mb-8">
              <ServiceAnalytics services={services} />
            </div>
          )}

          {/* Filters and Controls */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  type="search"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full sm:w-64"
                />
                
                <Select
                  options={categoryOptions}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  placeholder="Filter by category"
                  className="w-full sm:w-48"
                />
                
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-full sm:w-48"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Icon name="Grid3X3" size={16} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <Icon name="List" size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {filteredServices?.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
            }`}>
              {filteredServices?.map((service) => (
                <ServiceCard
                  key={service?.id}
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                  onToggleActive={handleToggleActive}
                  onDuplicate={handleDuplicateService}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Search" size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || filterCategory 
                  ? 'Try adjusting your search or filter criteria' : 'Get started by adding your first service'
                }
              </p>
              {!searchTerm && !filterCategory && (
                <Button onClick={handleAddService} iconName="Plus" iconPosition="left">
                  Add Your First Service
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSave={handleSaveService}
        service={editingService}
        categories={categories}
      />

      <BulkPricingModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onApply={handleBulkPricing}
        services={services}
        categories={categories}
      />
    </div>
  );
};

export default ServicePricingManagement;
