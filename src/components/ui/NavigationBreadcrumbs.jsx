import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = ({ 
  customBreadcrumbs = null,
  showHome = true 
}) => {
  const location = useLocation();

  // Route to breadcrumb mapping
  const routeBreadcrumbs = {
    '/business-dashboard': [
      { label: 'Dashboard', path: '/business-dashboard' }
    ],
    '/calendar-management': [
      { label: 'Dashboard', path: '/business-dashboard' },
      { label: 'Calendar Management', path: '/calendar-management' }
    ],
    '/service-pricing-management': [
      { label: 'Dashboard', path: '/business-dashboard' },
      { label: 'Service & Pricing', path: '/service-pricing-management' }
    ],
    '/qr-code-generator-marketing': [
      { label: 'Dashboard', path: '/business-dashboard' },
      { label: 'Marketing Tools', path: '/qr-code-generator-marketing' }
    ],
    '/business-registration-setup': [
      { label: 'Dashboard', path: '/business-dashboard' },
      { label: 'Business Setup', path: '/business-registration-setup' }
    ],
    '/customer-booking-interface': [
      { label: 'Book Appointment', path: '/customer-booking-interface' }
    ]
  };

  // Use custom breadcrumbs if provided, otherwise use route-based
  const breadcrumbs = customBreadcrumbs || routeBreadcrumbs?.[location?.pathname] || [];

  // Don't render if no breadcrumbs or only one item
  if (breadcrumbs?.length <= 1 && !showHome) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      {/* Home/Dashboard Link */}
      {showHome && location?.pathname !== '/business-dashboard' && (
        <>
          <Link 
            to="/business-dashboard"
            className="flex items-center hover:text-foreground transition-micro"
          >
            <Icon name="Home" size={16} className="mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          {breadcrumbs?.length > 0 && (
            <Icon name="ChevronRight" size={14} className="text-border" />
          )}
        </>
      )}
      {/* Breadcrumb Items */}
      {breadcrumbs?.map((crumb, index) => {
        const isLast = index === breadcrumbs?.length - 1;
        
        return (
          <React.Fragment key={crumb?.path || index}>
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-border" />
            )}
            {isLast ? (
              <span className="text-foreground font-medium" aria-current="page">
                {crumb?.label}
              </span>
            ) : (
              <Link 
                to={crumb?.path}
                className="hover:text-foreground transition-micro"
              >
                {crumb?.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default NavigationBreadcrumbs;
