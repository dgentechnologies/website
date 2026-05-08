import { products, Product } from '@/lib/products-data';
import {
  OpenAIProductFeedItem,
  FeedAvailability,
  FeedRelationshipType,
} from '@/types/product-feed';

type ProductFeedOverrides = {
  item_id: string;
  availability: FeedAvailability;
  price: string;
  is_eligible_search: boolean;
  is_eligible_checkout: boolean;
  product_category?: string;
  condition?: string;
  warning?: string;
  warning_url?: string;
  age_restriction?: number;
  listing_has_variations?: boolean;
  group_id?: string;
  item_group_title?: string;
  related_product_id?: string;
  relationship_type?: FeedRelationshipType;
  video_url?: string;
  model_3d_url?: string;
  availability_date?: string;
};

const BASE_URL = 'https://dgentechnologies.com';
const BRAND_NAME = 'DGEN Technologies';
const SELLER_NAME = 'DGEN Technologies Private Limited';

const productFeedOverrides: Record<Product['slug'], ProductFeedOverrides> = {
  'auralis-ecosystem': {
    item_id: 'DGEN-AURALIS-ECOSYSTEM-001',
    availability: 'in_stock',
    price: '24999.00 INR',
    is_eligible_search: true,
    is_eligible_checkout: false,
    product_category: 'Business & Industrial > Smart City Infrastructure > Street Lighting Control',
    condition: 'new',
    related_product_id: 'DGEN-SOLAR-STREET-LIGHT-001',
    relationship_type: 'frequently_bought_together',
  },
  'solar-street-light': {
    item_id: 'DGEN-SOLAR-STREET-LIGHT-001',
    availability: 'in_stock',
    price: '17999.00 INR',
    is_eligible_search: true,
    is_eligible_checkout: false,
    product_category: 'Home & Garden > Lighting > Outdoor Lighting > Solar Lights',
    condition: 'new',
    related_product_id: 'DGEN-LED-STREET-LIGHT-001',
    relationship_type: 'similar',
  },
  'led-street-light': {
    item_id: 'DGEN-LED-STREET-LIGHT-001',
    availability: 'in_stock',
    price: '8999.00 INR',
    is_eligible_search: true,
    is_eligible_checkout: false,
    product_category: 'Home & Garden > Lighting > Outdoor Lighting > Street Lights',
    condition: 'new',
    related_product_id: 'DGEN-AURALIS-ECOSYSTEM-001',
    relationship_type: 'accessory',
  },
  adam: {
    item_id: 'DGEN-ADAM-001',
    availability: 'pre_order',
    availability_date: '2026-12-01',
    price: '9999.00 INR',
    is_eligible_search: true,
    is_eligible_checkout: false,
    product_category: 'Electronics > Artificial Intelligence Devices > Desktop AI Assistant',
    condition: 'new',
    warning: 'Prototype hardware. Features and timelines may change before full launch.',
    age_restriction: 13,
    model_3d_url: `${BASE_URL}/models/auralis-desktop.mtl`,
  },
};

function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  return `${BASE_URL}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

function stripSimpleMarkdown(text: string): string {
  return text.replace(/\*\*/g, '').trim();
}

function isIsoDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isCurrencyAmount(value: string): boolean {
  return /^\d+(\.\d{2})\s[A-Z]{3}$/.test(value);
}

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function buildFeedItem(product: Product): OpenAIProductFeedItem {
  const overrides = productFeedOverrides[product.slug];
  const imageUrl = absoluteUrl(product.images[0]?.url || '/images/logo.png');
  const additionalImages = product.images
    .slice(1)
    .map((img) => absoluteUrl(img.url));

  return {
    // OpenAI flags
    is_eligible_search: overrides.is_eligible_search,
    is_eligible_checkout: overrides.is_eligible_checkout,

    // Basic product data
    item_id: overrides.item_id,
    title: product.title,
    description: product.longDescription,
    url: absoluteUrl(`/products/${product.slug}`),

    // Item information
    brand: BRAND_NAME,
    condition: overrides.condition || 'new',
    product_category: overrides.product_category,

    // Media
    image_url: imageUrl,
    additional_image_urls: additionalImages.length > 0 ? additionalImages.join(',') : undefined,
    video_url: overrides.video_url,
    model_3d_url: overrides.model_3d_url,

    // Price and promotions
    price: overrides.price,

    // Availability and inventory
    availability: overrides.availability,
    availability_date: overrides.availability_date,

    // Variants
    listing_has_variations: overrides.listing_has_variations || false,
    group_id: overrides.group_id,
    item_group_title: overrides.item_group_title,

    // Merchant info
    seller_name: SELLER_NAME,
    seller_url: BASE_URL,
    seller_privacy_policy: absoluteUrl('/privacy-policy'),
    seller_tos: absoluteUrl('/terms-of-service'),

    // Returns
    accepts_returns: true,
    return_deadline_in_days: 30,
    accepts_exchanges: false,
    return_policy: absoluteUrl('/terms-of-service'),

    // Compliance
    warning: overrides.warning,
    warning_url: overrides.warning_url,
    age_restriction: overrides.age_restriction,

    // Reviews and Q&A
    q_and_a:
      product.qna.length > 0
        ? product.qna.map((item) => ({
            question: stripSimpleMarkdown(item.question),
            answer: stripSimpleMarkdown(item.answer),
          }))
        : undefined,

    // Related products
    related_product_id: overrides.related_product_id,
    relationship_type: overrides.relationship_type,

    // Geo tagging
    target_countries: ['IN'],
    store_country: 'IN',
  };
}

function validateFeedItem(item: OpenAIProductFeedItem): string[] {
  const errors: string[] = [];

  const requiredStringFields: Array<keyof OpenAIProductFeedItem> = [
    'item_id',
    'title',
    'description',
    'url',
    'brand',
    'image_url',
    'price',
    'availability',
    'seller_name',
    'seller_url',
    'return_policy',
    'store_country',
  ];

  requiredStringFields.forEach((field) => {
    const value = item[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      errors.push(`Missing or invalid required field: ${field}`);
    }
  });

  if (!Array.isArray(item.target_countries) || item.target_countries.length === 0) {
    errors.push('Missing required field: target_countries');
  }

  if (!isCurrencyAmount(item.price)) {
    errors.push('Invalid price format. Expected: "123.45 CUR"');
  }

  if (!isValidUrl(item.url)) {
    errors.push('Invalid url field');
  }

  if (!isValidUrl(item.image_url)) {
    errors.push('Invalid image_url field');
  }

  if (!isValidUrl(item.seller_url)) {
    errors.push('Invalid seller_url field');
  }

  if (!isValidUrl(item.return_policy)) {
    errors.push('Invalid return_policy field');
  }

  if (item.is_eligible_checkout && !item.is_eligible_search) {
    errors.push('is_eligible_checkout=true requires is_eligible_search=true');
  }

  if (item.availability === 'pre_order' && (!item.availability_date || !isIsoDate(item.availability_date))) {
    errors.push('availability=pre_order requires availability_date in YYYY-MM-DD format');
  }

  if (item.sale_price_start_date && !isIsoDate(item.sale_price_start_date)) {
    errors.push('sale_price_start_date must be YYYY-MM-DD');
  }

  if (item.sale_price_end_date && !isIsoDate(item.sale_price_end_date)) {
    errors.push('sale_price_end_date must be YYYY-MM-DD');
  }

  return errors;
}

export function getOpenAIProductFeedItems(): OpenAIProductFeedItem[] {
  return products.map(buildFeedItem);
}

export function validateOpenAIProductFeed(items: OpenAIProductFeedItem[]): string[] {
  return items.flatMap((item) => validateFeedItem(item).map((err) => `${item.item_id}: ${err}`));
}
