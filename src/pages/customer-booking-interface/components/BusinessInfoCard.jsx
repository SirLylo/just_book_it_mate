import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const BusinessInfoCard = ({ business }) => {
  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border overflow-hidden">
      {/* Business Header Image */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <Image
          src={business?.headerImage}
          alt={`${business?.name} header`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">{business?.name}</h1>
          <p className="text-sm opacity-90">{business?.category}</p>
        </div>
      </div>
      {/* Business Details */}
      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Icon name="Calendar" size={24} />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-2">{business?.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {business?.description}
            </p>
            
            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={16}
                    className={i < Math.floor(business?.rating) ? 'text-warning fill-current' : 'text-muted'}
                  />
                ))}
                <span className="text-sm font-medium text-foreground ml-2">
                  {business?.rating} ({business?.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Phone" size={16} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium text-foreground">{business?.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Icon name="Mail" size={16} className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{business?.email}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 sm:col-span-2">
            <Icon name="MapPin" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium text-foreground">{business?.address}</p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="mt-6 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Clock" size={16} className="mr-2 text-primary" />
            Opening Hours
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {business?.openingHours?.map((hours, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-muted-foreground">{hours?.day}</span>
                <span className="font-medium text-foreground">{hours?.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoCard;
