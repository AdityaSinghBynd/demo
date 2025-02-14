// Alert Category Enum
export enum AlertCategoryEnum {
  GENERIC_SEARCH = "Generic Search",
  SPECIFIC_URLS = "Specific Website Urls",
  LINKEDIN = "LinkedIn",
  STOCK = "Stock"
}

// Alert Type Enum
export enum AlertTypeEnum {
  RECURRING_ALERTS = "RecurringAlerts",
  INSTANT_ALERTS = "InstantAlerts"
}

// Stock Movement Enum
export enum StockMovement {
  PRICE = "price",
  PERCENTAGE = "percentage"
}

// Stock Movement Condition Enum
export enum StockMovementCondition {
  ABOVE = "above",
  BELOW = "below",
  NET = "net"
}

// Main CreateAlert interface

export interface Alert {
  // Required fields
  alertCategory: AlertCategoryEnum;
  alertType: AlertTypeEnum;
  query: string;
  title: string;
  
  // Optional fields
  urls?: string[];
  linkedInMaxScrollAttempts?: string;
  linkedInNumberOfPosts?: string;
  linkedInMaxDays?: string;
  linkedInCategories?: string[];
  linkedinUrl?: string;
  linkedInCustomCategories?: Array<{
    category: string;
    description: string;
  }>;
  stockPriceMovementAmount?: number;
  stockPriceMovementType?: StockMovement;
  stockSymbol?: string;
}

export interface CreateAlert {
  title: string;
  alertType: AlertTypeEnum;
  query: string;
  alertCategory: AlertCategoryEnum;
  // LinkedIn specific fields with updated naming
  linkedinUrl?: string;
  linkedinMaxScrollAttempts?: string;
  linkedinNumberOfPosts?: string;
  linkedinMaxDays?: string;
  linkedinCategories?: string[];
  linkedinCustomCategories?: Array<{
    category: string;
    description: string;
  }>;
}