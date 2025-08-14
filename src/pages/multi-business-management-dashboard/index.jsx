import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessNavigationHeader from '../../components/ui/BusinessNavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

import BusinessCard from './components/BusinessCard';
import SubscriptionTierIndicator from './components/SubscriptionTierIndicator';
import UpgradePromptCard from './components/UpgradePromptCard';
import ConsolidatedAnalytics from './components/ConsolidatedAnalytics';
import NotificationCenter from './components/NotificationCenter';
import QuickActionsPanel from './components/QuickActionsPanel';
import UpcomingAppointmentsWidget from './components/UpcomingAppointmentsWidget';

const MultiBusinessManagementDashboard = () => {
  const navigate = useNavigate();
  const [selectedBusinessId, setSelectedBusinessId] = useState('1');
  const [refreshing, setRefreshing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Mock user profile with subscription tier
  const userProfile = {
    name: "Sarah Johnson",
    email: "sarah@justbookitmate.co.uk",
    subscriptionTier: "Professional", // "Basic" or "Professional"
    subscriptionStatus: "active",
    billingCycle: "monthly"
  };

  // Mock multiple businesses data
  const businesses = [
    {
      id: '1',
      name: "Sarah\'s Hair Studio",
      type: "Hair & Beauty",
      location: "London, UK",
      status: "active",
      todayAppointments: 8,
      weeklyRevenue: 1240,
      conversionRate: 85,
      lastActivity: new Date(Date.now() - 300000)
    },
    {
      id: '2',
      name: "City Centre Spa",
      type: "Wellness & Spa", 
      location: "Manchester, UK",
      status: "active",
      todayAppointments: 5,
      weeklyRevenue: 890,
      conversionRate: 78,
      lastActivity: new Date(Date.now() - 600000)
    },
    {
      id: '3',
      name: "Elite Fitness Studio",
      type: "Fitness & Training",
      location: "Birmingham, UK", 
      status: "active",
      todayAppointments: 12,
      weeklyRevenue: 2100,
      conversionRate: 92,
      lastActivity: new Date(Date.now() - 150000)
    }
  ];

  const selectedBusiness = businesses?.find(b => b?.id === selectedBusinessId) || businesses?.[0];

  // Business selector options
  const businessOptions = businesses?.map(business => ({
    value: business?.id,
    label: business?.name,
    description: business?.location
  }));

  // Mock consolidated metrics
  const consolidatedMetrics = {
    totalTodayAppointments: businesses?.reduce((sum, b) => sum + b?.todayAppointments, 0),
    totalWeeklyRevenue: businesses?.reduce((sum, b) => sum + b?.weeklyRevenue, 0),
    averageConversionRate: Math.round(businesses?.reduce((sum, b) => sum + b?.conversionRate, 0) / businesses?.length),
    activeBusinesses: businesses?.filter(b => b?.status === 'active')?.length
  };

  // Mock upcoming appointments across all businesses
  const upcomingAppointments = [
    {
      id: 1,
      businessId: '1',
      businessName: "Sarah\'s Hair Studio",
      customerName: "Emma Thompson",
      service: "Hair Cut & Blow Dry",
      time: "09:00",
      duration: "1h 30m",
      price: "£65",
      status: "confirmed"
    },
    {
      id: 2,
      businessId: '2', 
      businessName: "City Centre Spa",
      customerName: "James Wilson",
      service: "Deep Tissue Massage",
      time: "10:00",
      duration: "1h",
      price: "£80",
      status: "pending"
    },
    {
      id: 3,
      businessId: '3',
      businessName: "Elite Fitness Studio", 
      customerName: "Sophie Davis",
      service: "Personal Training",
      time: "11:00",
      duration: "45m",
      price: "£45",
      status: "confirmed"
    }
  ];

  // Mock notifications from all businesses
  const notifications = [
    {
      id: 1,
      businessId: '1',
      businessName: "Sarah\'s Hair Studio",
      type: "booking",
      title: "New Appointment Booked",
      message: "Emma Thompson booked Hair Cut & Blow Dry",
      priority: "normal",
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: 2,
      businessId: '2',
      type: "payment",
      title: "Payment Issue",
      message: "Card payment failed for James Wilson",
      priority: "high", 
      timestamp: new Date(Date.now() - 600000),
      read: false
    },
    {
      id: 3,
      businessId: '3',
      type: "review",
      title: "New 5-Star Review",
      message: "Sophie Davis left excellent feedback",
      priority: "normal",
      timestamp: new Date(Date.now() - 900000),
      read: true
    }
  ];

  // Feature availability based on tier
  const isBasicTier = userProfile?.subscriptionTier === "Basic";
  const isProfessionalTier = userProfile?.subscriptionTier === "Professional";

  // Handle business selection
  const handleBusinessSelect = (businessId) => {
    setSelectedBusinessId(businessId);
  };

  // Handle quick actions
  const handleAddBusinessLocation = () => {
    if (isBasicTier) {
      // Show upgrade prompt
      return;
    }
    navigate('/business-registration-setup', { state: { action: 'add-location' } });
  };

  const handleCreateQRCampaign = () => {
    if (isBasicTier) {
      // Show upgrade prompt  
      return;
    }
    navigate('/qr-code-generator-marketing', { state: { businessId: selectedBusinessId } });
  };

  const handleManageAppointments = () => {
    navigate('/calendar-management', { state: { businessId: selectedBusinessId } });
  };

  const handleViewAnalytics = () => {
    if (isBasicTier) {
      // Show upgrade prompt
      return;
    }
    navigate('/analytics-dashboard', { state: { businessId: selectedBusinessId } });
  };

  const handleUpgradeSubscription = () => {
    navigate('/subscription-selection-billing', { state: { action: 'upgrade' } });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Handle navigation collapse
  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <BusinessNavigationHeader 
        userProfile={userProfile}
        notificationCount={notifications?.filter(n => !n?.read)?.length}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-foreground">Multi-Business Dashboard</h1>
                <SubscriptionTierIndicator 
                  tier={userProfile?.subscriptionTier}
                  status={userProfile?.subscriptionStatus}
                  className=""
                />
              </div>
              <p className="text-muted-foreground">
                Welcome back, {userProfile?.name}. Manage all your business locations from one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
              {/* Business Selector */}
              <div className="w-full sm:w-64">
                <Select
                  options={businessOptions}
                  value={selectedBusinessId}
                  onChange={handleBusinessSelect}
                  placeholder="Select Business"
                  searchable
                />
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  loading={refreshing}
                  iconName="RefreshCw"
                  iconPosition="left"
                >
                  Refresh
                </Button>
                
                {isProfessionalTier && (
                  <Button
                    variant="default"
                    onClick={handleAddBusinessLocation}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Location
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Business Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {businesses?.map((business) => (
              <BusinessCard
                key={business?.id}
                business={business}
                isSelected={business?.id === selectedBusinessId}
                userTier={userProfile?.subscriptionTier}
                onClick={() => handleBusinessSelect(business?.id)}
              />
            ))}
          </div>

          {/* Consolidated Metrics - Professional Only */}
          {isProfessionalTier && (
            <ConsolidatedAnalytics 
              metrics={consolidatedMetrics}
              businesses={businesses}
              className="mb-8"
            />
          )}

          {/* Basic Tier Upgrade Prompt */}
          {isBasicTier && (
            <UpgradePromptCard 
              onUpgrade={handleUpgradeSubscription}
              className="mb-8"
            />
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Appointments & Notifications */}
            <div className="lg:col-span-4">
              <UpcomingAppointmentsWidget
                appointments={isProfessionalTier ? upcomingAppointments : upcomingAppointments?.filter(a => a?.businessId === selectedBusinessId)}
                selectedBusinessId={selectedBusinessId}
                userTier={userProfile?.subscriptionTier}
                onManageAppointments={handleManageAppointments}
              />
            </div>

            {/* Center Column - Quick Actions & Notifications */}
            <div className="lg:col-span-4 space-y-8">
              <QuickActionsPanel
                userTier={userProfile?.subscriptionTier}
                selectedBusiness={selectedBusiness}
                onAddBusinessLocation={handleAddBusinessLocation}
                onCreateQRCampaign={handleCreateQRCampaign}
                onManageAppointments={handleManageAppointments}
                onViewAnalytics={handleViewAnalytics}
                onUpgrade={handleUpgradeSubscription}
                className=""
              />

              <NotificationCenter
                notifications={isProfessionalTier ? notifications : notifications?.filter(n => n?.businessId === selectedBusinessId)}
                userTier={userProfile?.subscriptionTier}
              />
            </div>

            {/* Right Column - Business Details & Stats */}
            <div className="lg:col-span-4">
              {selectedBusiness && (
                <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Selected Business</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${selectedBusiness?.status === 'active' ? 'bg-success' : 'bg-error'}`} />
                      <span className="text-sm text-muted-foreground capitalize">{selectedBusiness?.status}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{selectedBusiness?.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedBusiness?.type}</p>
                      <p className="text-sm text-muted-foreground">{selectedBusiness?.location}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{selectedBusiness?.todayAppointments}</div>
                        <div className="text-xs text-muted-foreground">Today's Apps</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">£{selectedBusiness?.weeklyRevenue}</div>
                        <div className="text-xs text-muted-foreground">Weekly Revenue</div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="text-sm font-medium text-foreground">{selectedBusiness?.conversionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${selectedBusiness?.conversionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleManageAppointments}
                        iconName="Calendar"
                        iconPosition="left"
                        fullWidth
                      >
                        Manage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/service-pricing-management', { state: { businessId: selectedBusinessId } })}
                        iconName="Settings"
                        iconPosition="left"
                        fullWidth
                      >
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Quick Actions - Only visible on mobile */}
          <div className="lg:hidden mt-8">
            <QuickActionsPanel
              userTier={userProfile?.subscriptionTier}
              selectedBusiness={selectedBusiness}
              onAddBusinessLocation={handleAddBusinessLocation}
              onCreateQRCampaign={handleCreateQRCampaign}
              onManageAppointments={handleManageAppointments}
              onViewAnalytics={handleViewAnalytics}
              onUpgrade={handleUpgradeSubscription}
              className=""
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MultiBusinessManagementDashboard;
