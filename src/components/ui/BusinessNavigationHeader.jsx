import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BusinessNavigationHeader = ({ 
  isCollapsed = false, 
  onToggleCollapse,
  userProfile = null,
  notificationCount = 0 
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/business-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'View business overview and metrics'
    },
    {
      label: 'Calendar',
      path: '/calendar-management',
      icon: 'Calendar',
      tooltip: 'Manage appointments and scheduling'
    },
    {
      label: 'Services',
      path: '/service-pricing-management',
      icon: 'Settings',
      tooltip: 'Configure services and pricing'
    },
    {
      label: 'Marketing',
      path: '/qr-code-generator-marketing',
      icon: 'QrCode',
      tooltip: 'Generate QR codes and marketing materials'
    },
    {
      label: 'Settings',
      path: '/business-registration-setup',
      icon: 'Cog',
      tooltip: 'Business profile and system configuration'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Header */}
      <header className="fixed top-0 left-0 right-0 z-100 glass-surface border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to="/business-dashboard" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Icon name="Calendar" size={20} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">Just Book It Mate</h1>
                <p className="text-xs text-muted-foreground">Business Management</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro
                  ${isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-subtle'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            {notificationCount > 0 && (
              <Button variant="ghost" size="icon" className="relative">
                <Icon name="Bell" size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </Button>
            )}

            {/* User Profile */}
            {userProfile && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-muted">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-foreground">{userProfile?.name}</span>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>
      </header>
      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-200 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card border-l border-border shadow-floating animate-slide-in">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <Icon name="X" size={20} />
                </Button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-2">
                {navigationItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={toggleMobileMenu}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-micro
                      ${isActivePath(item?.path)
                        ? 'bg-primary text-primary-foreground shadow-subtle'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                      }
                    `}
                  >
                    <Icon name={item?.icon} size={20} />
                    <div>
                      <div>{item?.label}</div>
                      <div className="text-xs opacity-75">{item?.tooltip}</div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* User Profile Section */}
              {userProfile && (
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{userProfile?.name}</div>
                      <div className="text-xs text-muted-foreground">{userProfile?.email}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BusinessNavigationHeader;
