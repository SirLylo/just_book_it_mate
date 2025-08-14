import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BusinessNavigationHeader from "../../components/ui/BusinessNavigationHeader";
import NavigationBreadcrumbs from "../../components/ui/NavigationBreadcrumbs";
import StatsCard from "./components/StatsCard";
import AppointmentCard from "./components/AppointmentCard";
import MiniCalendar from "./components/MiniCalendar";
import ActivityFeed from "./components/ActivityFeed";
import QuickActions from "./components/QuickActions";
import RevenueChart from "./components/RevenueChart";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { supabase } from "/src/lib/supabaseClient.js";

const BusinessDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [businesses, setBusinesses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noUser, setNoUser] = useState(false);

  useEffect(() => {
  (async () => {
    setLoading(true);

    // Get logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      setLoading(false);
      return;
    }
    if (!user) {
      setNoUser(true);
      setLoading(false);
      return;
    }

    // Fetch only businesses owned by this user
    const { data: bizData, error: bizError } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_id", user.id);

    if (bizError) {
      console.error("Supabase businesses error:", bizError);
      setLoading(false);
      return;
    }

    setBusinesses(bizData);

    // Fetch appointments for first business
    if (bizData.length > 0) {
      const { data: apptData, error: apptError } = await supabase
        .from("appointments")
        .select("*")
        .eq("business_id", bizData[0].id)
        .order("start_time", { ascending: true });

      if (apptError) {
        console.error("Supabase appointments error:", apptError);
      } else {
        setAppointments(apptData);
      }
    }

    setLoading(false);
  })();
}, []);


      // ✅ Fetch only businesses owned by this user
      const { data: bizData, error: bizError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id);

      if (bizError) {
        console.error("Supabase businesses error:", bizError);
        setLoading(false);
        return;
      }

      setBusinesses(bizData);

      // ✅ Fetch appointments for this business
      if (bizData && bizData.length > 0) {
        const { data: apptData, error: apptError } = await supabase
          .from("appointments")
          .select("*")
          .eq("business_id", bizData[0].id)
          .order("start_time", { ascending: true });

        if (!apptError) {
          setAppointments(apptData);
        } else {
          console.error("Appointments fetch error:", apptError);
        }
      }

      setLoading(false);
    })();
  }, []);

  if (noUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to view your dashboard.
        </p>
      </div>
    );
  }

  const userProfile = {
    name: businesses?.[0]?.name || "Business Owner",
    email: "",
    businessName: businesses?.[0]?.name || ""
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysAppts = appointments.filter(a => (a.start_time || "").startsWith(todayStr));
  const pendingCount = todaysAppts.filter(a => a.status === "pending").length;

  const weeklyRevenue = appointments
    .filter(a => {
      const d = new Date(a.start_time);
      const now = new Date();
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < 7 && a.status !== "cancelled";
    })
    .reduce((sum, a) => sum + Number(a.price || 0), 0);

  const revenueChartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const ymd = date.toISOString().slice(0, 10);
    const total = appointments
      .filter(a => (a.start_time || "").startsWith(ymd) && a.status !== "cancelled")
      .reduce((sum, a) => sum + Number(a.price || 0), 0);
    return { name: date.toLocaleDateString("en-GB", { weekday: "short" }), revenue: total };
  });

  const statsData = [
    {
      title: "Today's Appointments",
      value: loading ? "–" : String(todaysAppts.length),
      subtitle: loading ? "Loading..." : `${pendingCount} pending confirmation`,
      icon: "Calendar",
      trend: "up",
      trendValue: "",
      color: "primary",
    },
    {
      title: "Weekly Revenue",
      value: loading ? "–" : `£${Math.round(weeklyRevenue)}`,
      subtitle: loading ? "Loading..." : "Last 7 days",
      icon: "Pound",
      trend: "up",
      trendValue: "",
      color: "success",
    },
    {
      title: "Pending Confirmations",
      value: loading ? "–" : String(pendingCount),
      subtitle: loading ? "Loading..." : "Require attention",
      icon: "Clock",
      trend: pendingCount > 0 ? "down" : "up",
      trendValue: "",
      color: "warning",
    },
    {
      title: "Customer Satisfaction",
      value: "–",
      subtitle: "Hook up later",
      icon: "Star",
      trend: "up",
      trendValue: "",
      color: "accent",
    },
  ];

  const bookingData = appointments.reduce((acc, appt) => {
    const dateKey = (appt.start_time || "").slice(0, 10);
    acc[dateKey] = acc[dateKey] ? acc[dateKey] + 1 : 1;
    return acc;
  }, {});

  const recentActivities = loading
    ? []
    : appointments
        .slice()
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
        .map(appt => ({
          id: appt.id,
          type: "booking",
          title: "New Appointment Booked",
          description: `${appt.service} for ${appt.customer_name}`,
          customer: appt.customer_name,
          timestamp: new Date(appt.start_time),
          amount: String(appt.price || "")
        }));

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
      console.log('Cancelling appointment:', appointment?.id);
    }
  };

  const handleAddAppointment = () => navigate('/calendar-management', { state: { action: 'add' } });
  const handleBlockTime = () => navigate('/calendar-management', { state: { action: 'block' } });
  const handleViewCalendar = () => navigate('/calendar-management');
  const handleManageServices = () => navigate('/service-pricing-management');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    navigate('/calendar-management', { state: { selectedDate: date } });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleToggleCollapse = () => setCollapsed(!collapsed);

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
          <div style={{ fontWeight: 600, marginBottom: 12 }}>
            Businesses in DB: {loading ? "…" : businesses.length}
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {userProfile?.name}. Here's what's happening today.
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
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
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Appointments */}
            <div className="lg:col-span-4">
              <div className="bg-card rounded-lg border border-border p-6 shadow-subtle">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Today's Appointments</h2>
                  <div className="flex items-center space-x-2">
                    <Icon name="Calendar" size={20} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date()?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {loading ? (
                    <p className="text-muted-foreground text-center">Loading appointments…</p>
                  ) : todaysAppts.length > 0 ? (
                    todaysAppts.map((appointment) => (
                      <AppointmentCard
                        key={appointment?.id}
                        appointment={appointment}
                        onCall={handleCallCustomer}
                        onMessage={handleMessageCustomer}
                        onReschedule={handleRescheduleAppointment}
                        onCancel={handleCancelAppointment}
                      />
                    ))
                  ) : (
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
                </div>
              </div>
            </div>

            {/* Center Column */}
            <div className="lg:col-span-4 space-y-8">
              <MiniCalendar
                bookingData={bookingData}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
              <RevenueChart data={revenueChartData} period="daily" />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-8">
              {loading ? (
                <p className="text-muted-foreground text-center">Loading activity…</p>
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

          {/* Mobile Quick Actions */}
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
