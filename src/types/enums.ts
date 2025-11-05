export type AccountType = "FREE" | "PLUS" | "PREMIUM";
export type TransactionKind = "PURCHASE" | "EXCHANGE" | "GIFT" | "REFERRAL" | "BONUS";
export type ShippingStage = "PREPARING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELED";
export type Badge =
  | "POPULAR"
  | "DISCOUNTED"
  | "WOMAN_OWNED"
  | "BEST_SELLER"
  | "TOP_RATED"
  | "COMMUNITY_FAVORITE"
  | "LIMITED_TIME_OFFER"
  | "FLASH_SALE"
  | "BEST_VALUE"
  | "HANDMADE"
  | "SUSTAINABLE"
  | "SUPPORTS_CAUSE"
  | "FAMILY_BUSINESS"
  | "CHARITY_SUPPORT"
  | "LIMITED_STOCK"
  | "SEASONAL"
  | "FREE_SHIPPING"
  | "FOR_REPAIR"
  | "REFURBISHED"
  | "EXCHANGEABLE"
  | "LAST_PRICE"
  | "FOR_GIFT"
  | "OPEN_TO_OFFERS"
  | "OPEN_BOX"
  | "CRUELTY_FREE"
  | "DELIVERED_TO_HOME"
  | "IN_HOUSE_PICKUP"
  | "IN_MID_POINT_PICKUP";
export type ContactMethod = "EMAIL" | "WHATSAPP" | "ALL";
export type WeightUnit = "KG" | "LB" | "OZ" | "G";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL";
export type ProductCondition = "NEW" | "OPEN_BOX" | "LIKE_NEW" | "FAIR" | "POOR" | "FOR_PARTS" | "REFURBISHED";
export type QuotationStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED" | "CANCELLED" | "EXPIRED";
export type ServicePricing = "FIXED" | "QUOTATION" | "HOURLY" | "PACKAGE";
