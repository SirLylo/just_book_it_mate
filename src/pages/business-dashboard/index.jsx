import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BusinessNavigationHeader from '../../components/ui/BusinessNavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import StatsCard from './components/StatsCard';
import AppointmentCard from './components/AppointmentCard';
import MiniCalendar from './components/MiniCalendar';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import RevenueChart from './components/RevenueChart';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import useAuth from '../../hooks/useAuth';


const BusinessDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  // Data states
  const [userProfile, setUserProfile] = useState(null);
  const [statsData, setStatsData] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  
  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  
  // Error states
  const [error, setError] = useState(null);

  // Handle appointment actions
  const handleCallCustomer = (appointment) => {
    window.open(`tel:${appointment?.phone}`, '_self');
  };

  const handleMessageCustomer = (appointment) => {
    const message = `Hi ${appointment?.customerName}, this is regarding your ${appointment?.service} appointment at ${appointment?.time}. Please let me know if you need to make any changes.`;
    window.open(`sms:${appointment?.phone}?body=${encodeURIComponent(message)}`, '_self');
  };

  const handleRescheduleAppointment = (appointment) => {
    navigate('/calendar-management', { 
      state: { 
        action: 'reschedule', 
        appointmentId: appointment?.id,
        customerName: appointment?.customerName 
      } 
    });
  };

  const handleCancelAppointment = (appointment) => {
    if (window.confirm(`Are you sure you want to cancel ${appointment?.customerName}'s appointment?`)) {
      // Handle cancellation logic here
      console.log('Cancelling appointment:', appointment?.id);
    }
  };

  // Handle quick actions
  const handleAddAppointment = () => {
    navigate('/calendar-management', { state: { action: 'add' } });
  };

  const handleBlockTime = () => {
    navigate('/calendar-management', { state: { action: 'block' } });
  };

  const handleViewCalendar = () => {
    navigate('/calendar-management');
  };

  const handleManageServices = () => {
    navigate('/service-pricing-management');
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    navigate('/calendar-management', { state: { selectedDate: date } });
  };

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
        
      if (error) throw error;
      setUserProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  }, [user?.id]);

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's appointments count
      const { data: todayAppointments } = await supabase
        .from('appointments')
        .select('id, status')
        .eq('business_id', userProfile?.business_id)
        .gte('appointment_date', today)
        .lt('appointment_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        
      // Fetch weekly revenue
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const { data: weeklyRevenue } = await supabase
        .from('appointments')
        .select('price')
        .eq('business_id', userProfile?.business_id)
        .eq('status', 'completed')
        .gte('appointment_date', weekStart.toISOString().split('T')[0]);
        
      // Fetch customer satisfaction
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', userProfile?.business_id);
        
      const pendingCount = todayAppointments?.filter(apt => apt.status === 'pending')?.length || 0;
      const totalRevenue = weeklyRevenue?.reduce((sum, apt) => sum + (apt.price || 0), 0) || 0;
      const avgRating = reviews?.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
      
      setStatsData([
        {
          title: "Today's Appointments",
          value: todayAppointments?.length?.toString() || '0',
          subtitle: `${pendingCount} pending confirmation`,
          icon: "Calendar",
          trend: "neutral",
          trendValue: "",
          color: "primary"
        },
        {
          title: "Weekly Revenue",
          value: `£${totalRevenue}`,
          subtitle: "This week",
          icon: "Pound",
          trend: "neutral",
          trendValue: "",
          color: "success"
        },
        {
          title: "Pending Confirmations",
          value: pendingCount.toString(),
          subtitle: "Require attention",
          icon: "Clock",
          trend: "neutral",
          trendValue: "",
          color: "warning"
        },
        {
          title: "Customer Satisfaction",
          value: avgRating,
          subtitle: `Based on ${reviews?.length || 0} reviews`,
          icon: "Star",
          trend: "neutral",
          trendValue: "",
          color: "accent"
        }
      ]);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoadingStats(false);
    }
  }, [userProfile?.business_id]);

  // Fetch today's appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoadingAppointments(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers (name, phone),
          services (name, duration, price)
        `)
        .eq('business_id', userProfile?.business_id)
        .eq('appointment_date', today)
        .order('appointment_time', { ascending: true });
        
      if (error) throw error;
      
      const formattedAppointments = data?.map(apt => ({
        id: apt.id,
        customerName: apt.customers?.name || 'Unknown',
        service: apt.services?.name || 'Service',
        time: apt.appointment_time?.slice(0, 5) || '',
        duration: apt.services?.duration || '',
        price: `£${apt.services?.price || 0}`,
        status: apt.status,
        phone: apt.customers?.phone || ''
      })) || [];
      
      setUpcomingAppointments(formattedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
    } finally {
      setLoadingAppointments(false);
    }
  }, [userProfile?.business_id]);

  // Fetch recent activities
  const fetchActivities = useCallback(async () => {
    try {
      setLoadingActivities(true);
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          customers (name)
        `)
        .eq('business_id', userProfile?.business_id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      const formattedActivities = data?.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        customer: activity.customers?.name || 'Unknown',
        timestamp: new Date(activity.created_at),
        amount: activity.amount
      })) || [];
      
      setRecentActivities(formattedActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoadingActivities(false);
    }
  }, [userProfile?.business_id]);

  // Fetch revenue data
  const fetchRevenueData = useCallback(async () => {
    try {
      setLoadingRevenue(true);
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, price')
        .eq('business_id', userProfile?.business_id)
        .eq('status', 'completed')
        .gte('appointment_date', weekStart.toISOString().split('T')[0])
        .lte('appointment_date', today.toISOString().split('T')[0]);
        
      if (error) throw error;
      
      // Group by day and calculate revenue
      const revenueByDay = {};
      data?.forEach(apt => {
        const day = new Date(apt.appointment_date).toLocaleDateString('en-US', { weekday: 'short' });
        revenueByDay[day] = (revenueByDay[day] || 0) + (apt.price || 0);
      });
      
      const chartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        name: day,
        revenue: revenueByDay[day] || 0
      }));
      
      setRevenueChartData(chartData);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to load revenue data');
    } finally {
      setLoadingRevenue(false);
    }
  }, [userProfile?.business_id]);

  // Fetch booking density for calendar
  const fetchBookingData = useCallback(async () => {
    try {
      const today = new Date();
      const twoWeeksFromNow = new Date(today);
      twoWeeksFromNow.setDate(today.getDate() + 14);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date')
        .eq('business_id', userProfile?.business_id)
        .gte('appointment_date', today.toISOString().split('T')[0])
        .lte('appointment_date', twoWeeksFromNow.toISOString().split('T')[0]);
        
      if (error) throw error;
      
      const bookingDensity = {};
      data?.forEach(apt => {
        const date = apt.appointment_date;
        bookingDensity[date] = (bookingDensity[date] || 0) + 1;
      });
      
      setBookingData(bookingDensity);
    } catch (err) {
      console.error('Error fetching booking data:', err);
    }
  }, [userProfile?.business_id]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchStats(),
        fetchAppointments(),
        fetchActivities(),
        fetchRevenueData(),
        fetchBookingData()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    if (userProfile?.business_id) {
      Promise.all([
        fetchStats(),
        fetchAppointments(),
        fetchActivities(),
        fetchRevenueData(),
        fetchBookingData()
      ]);
    }
  }, [userProfile?.business_id, fetchStats, fetchAppointments, fetchActivities, fetchRevenueData, fetchBookingData]);

  // Handle navigation collapse
  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <BusinessNavigationHeader 
        userProfile={userProfile}
        notificationCount={3}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NavigationBreadcrumbs />
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {loadingProfile ? (
                  "Loading..."
                ) : (
                  `Welcome back, ${userProfile?.name || 'User'}. Here's what's happening today.`
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={handleRefresh}
                loading={refreshing}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
              <Button
                variant="default"
                onClick={handleAddAppointment}
                iconName="Plus"
                iconPosition="left"
              >
                New Appointment
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={20} className="text-destructive" />
                <p className="text-destructive font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loadingStats ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-6 shadow-subtle animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))
            ) : (
              statsData?.map((stat, index) => (
                <StatsCard 
                  key={index} 
                  title={stat.title}
                  value={stat.value}
                  subtitle={stat.subtitle}
                  icon={stat.icon}
                  trend={stat.trend}
                  trendValue={stat.trendValue}
                  color={stat.color}
                />
              ))
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Appointments */}
            <div className="lg:col-span-4">
              <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Today's Appointments</h2>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={20} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date()?.toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </span>
                  </div>
                </div>
                
                {loadingAppointments ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {upcomingAppointments?.map((appointment) => (
                        <AppointmentCard
                          key={appointment?.id}
                          appointment={appointment}
                          onCall={handleCallCustomer}
                          onMessage={handleMessageCustomer}
                          onReschedule={handleRescheduleAppointment}
                          onCancel={handleCancelAppointment}
                        />
                      ))}
                    </div>

                    {upcomingAppointments?.length === 0 && (
                      <div className="text-center py-8">
                        <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No appointments scheduled for today</p>
                        <Button
                          variant="outline"
                          onClick={handleAddAppointment}
                          className="mt-4"
                          iconName="Plus"
                          iconPosition="left"
                        >
                          Add First Appointment
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Center Column - Calendar & Chart */}
            <div className="lg:col-span-4 space-y-8">
              <MiniCalendar
                bookingData={bookingData}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
              
              {loadingRevenue ? (
                <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
                  <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="h-48 bg-muted rounded animate-pulse"></div>
                </div>
              ) : (
                <RevenueChart data={revenueChartData} period="daily" />
              )}
            </div>

            {/* Right Column - Activity & Actions */}
            <div className="lg:col-span-4 space-y-8">
              {loadingActivities ? (
                <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
                  <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-muted/50 rounded p-3 animate-pulse">
                        <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ActivityFeed activities={recentActivities} />
              )}
              
              <QuickActions
                onAddAppointment={handleAddAppointment}
                onBlockTime={handleBlockTime}
                onViewCalendar={handleViewCalendar}
                onManageServices={handleManageServices}
              />
            </div>
          </div>

          {/* Mobile Quick Actions - Only visible on mobile */}
          <div className="lg:hidden mt-8">
            <QuickActions
              onAddAppointment={handleAddAppointment}
              onBlockTime={handleBlockTime}
              onViewCalendar={handleViewCalendar}
              onManageServices={handleManageServices}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;