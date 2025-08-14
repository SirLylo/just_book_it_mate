import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ServicePricingManagement from './pages/service-pricing-management';
import CustomerBookingInterface from './pages/customer-booking-interface';
import QRCodeGeneratorMarketing from './pages/qr-code-generator-marketing';
import BusinessDashboard from './pages/business-dashboard';
import BusinessRegistrationSetup from './pages/business-registration-setup';
import CalendarManagement from './pages/calendar-management';
import UserAuthenticationRegistration from './pages/user-authentication-registration';
import SubscriptionSelectionBilling from './pages/subscription-selection-billing';
import MultiBusinessManagementDashboard from './pages/multi-business-management-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BusinessDashboard />} />
        <Route path="/service-pricing-management" element={<ServicePricingManagement />} />
        <Route path="/customer-booking-interface" element={<CustomerBookingInterface />} />
        <Route path="/qr-code-generator-marketing" element={<QRCodeGeneratorMarketing />} />
        <Route path="/business-dashboard" element={<BusinessDashboard />} />
        <Route path="/business-registration-setup" element={<BusinessRegistrationSetup />} />
        <Route path="/calendar-management" element={<CalendarManagement />} />
        <Route path="/user-authentication-registration" element={<UserAuthenticationRegistration />} />
        <Route path="/subscription-selection-billing" element={<SubscriptionSelectionBilling />} />
        <Route path="/multi-business-management-dashboard" element={<MultiBusinessManagementDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
