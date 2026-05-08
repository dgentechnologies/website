export type FeedAvailability = 'in_stock' | 'out_of_stock' | 'pre_order' | 'backorder';

export type FeedAgeGroup = 'newborn' | 'infant' | 'toddler' | 'kids' | 'adult';

export type FeedPickupMethod = 'in_store' | 'ship_to_store' | 'curbside';

export type FeedRelationshipType =
  | 'part_of_set'
  | 'accessory'
  | 'replacement'
  | 'similar'
  | 'frequently_bought_together';

export type FeedQuestionAnswer = {
  question: string;
  answer: string;
};

export type FeedReviewEntry = {
  title: string;
  content: string;
  minRating: number;
  maxRating: number;
  ratingValue: number;
};

export type OpenAIProductFeedItem = {
  // OpenAI flags
  is_eligible_search: boolean;
  is_eligible_checkout: boolean;

  // Basic product data
  item_id: string;
  gtin?: string;
  mpn?: string;
  title: string;
  description: string;
  url: string;

  // Item information
  brand: string;
  condition?: string;
  product_category?: string;
  material?: string;
  dimensions?: string;
  length?: string;
  width?: string;
  height?: string;
  dimensions_unit?: string;
  weight?: string;
  item_weight_unit?: string;
  age_group?: FeedAgeGroup;

  // Media
  image_url: string;
  additional_image_urls?: string;
  video_url?: string;
  model_3d_url?: string;

  // Price and promotions
  price?: string;
  sale_price?: string;
  sale_price_start_date?: string;
  sale_price_end_date?: string;
  unit_pricing_measure?: string;
  base_measure?: string;
  pricing_trend?: string;

  // Availability and inventory
  availability: FeedAvailability;
  availability_date?: string;
  expiration_date?: string;
  pickup_method?: FeedPickupMethod;
  pickup_sla?: string;

  // Variants
  group_id?: string;
  listing_has_variations?: boolean;
  variant_dict?: Record<string, string>;
  item_group_title?: string;
  color?: string;
  size?: string;
  size_system?: string;
  gender?: string;
  offer_id?: string;
  Custom_variant1_category?: string;
  Custom_variant1_option?: string;
  Custom_variant2_category?: string;
  Custom_variant2_option?: string;
  Custom_variant3_category?: string;
  Custom_variant3_option?: string;

  // Fulfillment
  shipping?: string;
  is_digital?: boolean;

  // Merchant info
  seller_name: string;
  marketplace_seller?: string;
  seller_url: string;
  seller_privacy_policy?: string;
  seller_tos?: string;

  // Returns
  accepts_returns?: boolean;
  return_deadline_in_days?: number;
  accepts_exchanges?: boolean;
  return_policy: string;

  // Performance signals
  popularity_score?: number;
  return_rate?: number;

  // Compliance
  warning?: string;
  warning_url?: string;
  age_restriction?: number;

  // Reviews and Q&A
  review_count?: number;
  star_rating?: string;
  store_review_count?: number;
  store_star_rating?: string;
  q_and_a?: FeedQuestionAnswer[];
  reviews?: FeedReviewEntry[];

  // Related products
  related_product_id?: string;
  relationship_type?: FeedRelationshipType;

  // Geo tagging
  target_countries: string[];
  store_country: string;
  geo_price?: string;
  geo_availability?: string;
};
