# Product Feed for ChatGPT

## Feed Reference

To make your products discoverable inside ChatGPT, merchants provide a structured product feed file that OpenAI ingests and indexes. This specification defines the product schema for file uploads: field names, data types, constraints, and example values needed for accurate discovery, pricing, availability, and seller context.

Each table below groups fields by schema object and indicates whether a field is Required or Optional, along with validation rules to help your engineering team build and maintain a compliant upload file.

Supplying all required fields ensures your products can be displayed correctly, while optional fields enrich relevance and user trust.

## Endpoint

- Feed URL: `/api/products/feed`
- Method: `GET`
- Content type: `application/json`

## OpenAI Flags

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `is_eligible_search` | Yes | Boolean | Controls whether the product can be surfaced in ChatGPT search results. |
| `is_eligible_checkout` | Yes | Boolean | Allows direct purchase inside ChatGPT. Requires `is_eligible_search=true`. |

## Basic Product Data

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `item_id` | Yes | String (alphanumeric) | Merchant product ID. Must be unique per variant. |
| `gtin` | No | String (numeric) | Universal product identifier. |
| `mpn` | No | String (alphanumeric) | Manufacturer part number. |
| `title` | Yes | String (UTF-8 text) | Product title. |
| `description` | Yes | String (UTF-8 text) | Full product description. |
| `url` | Yes | URL | Product detail page URL. |

## Item Information

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `brand` | Yes | String | Product brand. |
| `condition` | No | String | Condition of product (for example: `new`). |
| `product_category` | No | String | Category path. |
| `material` | No | String | Primary material(s). |
| `dimensions` | No | String | Overall dimensions. |
| `length` | No | String | Individual dimension length. |
| `width` | No | String | Individual dimension width. |
| `height` | No | String | Individual dimension height. |
| `dimensions_unit` | No | String | Unit for dimensions. |
| `weight` | No | String | Product weight value. |
| `item_weight_unit` | No | String | Product weight unit. |
| `age_group` | No | Enum | Target demographic, for example `adult`. |

## Media

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `image_url` | Yes | URL | Main product image URL. |
| `additional_image_urls` | No | String | Comma-separated extra image URLs. |
| `video_url` | No | URL | Product video URL. |
| `model_3d_url` | No | URL | 3D model URL. |

## Price and Promotions

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `price` | Yes | Number + currency | Regular price (for example: `79.99 USD`). |
| `sale_price` | No | Number + currency | Discounted price. |
| `sale_price_start_date` | No | Date (`YYYY-MM-DD`) | Sale start date. |
| `sale_price_end_date` | No | Date (`YYYY-MM-DD`) | Sale end date. |
| `unit_pricing_measure` | No | Number + unit | Unit price measure. |
| `base_measure` | No | Number + unit | Base measure for unit pricing. |
| `pricing_trend` | No | String | Price trend note. |

## Availability and Inventory

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `availability` | Yes | Enum | Product availability (`in_stock`, `out_of_stock`, `pre_order`, `backorder`). |
| `availability_date` | Conditionally | Date (`YYYY-MM-DD`) | Required when `availability=pre_order`. |
| `expiration_date` | No | Date (`YYYY-MM-DD`) | Remove product after this date. |
| `pickup_method` | No | Enum | Pickup options. |
| `pickup_sla` | No | Number + duration | Pickup SLA, for example `1 day`. |

## Variants

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `group_id` | Recommended if variants exist | String | Shared group identifier. |
| `listing_has_variations` | Recommended | Boolean | Indicates whether listing has variants. |
| `variant_dict` | Recommended if variants exist | Object | Variant option map, for example color/size. |
| `item_group_title` | No | String | Group product title. |
| `color` | No | String | Variant color. |
| `size` | Recommended for apparel | String | Variant size. |
| `size_system` | Recommended for apparel | Country code | Size system, for example `US`. |
| `gender` | No | String | Gender target. |
| `offer_id` | No | String | Offer identifier (`SKU+seller+price`). |
| `Custom_variant1_category` | No | String | Custom variant dimension 1 name. |
| `Custom_variant1_option` | No | String | Custom variant dimension 1 value. |
| `Custom_variant2_category` | No | String | Custom variant dimension 2 name. |
| `Custom_variant2_option` | No | String | Custom variant dimension 2 value. |
| `Custom_variant3_category` | No | String | Custom variant dimension 3 name. |
| `Custom_variant3_option` | No | String | Custom variant dimension 3 value. |

## Fulfillment

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `shipping` | No | String | Shipping metadata string. |
| `is_digital` | No | Boolean | Whether the product is digital. |

## Merchant Info

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `seller_name` | Yes | String | Display seller name. |
| `marketplace_seller` | No | String | Marketplace seller of record. |
| `seller_url` | Yes | URL | Seller page URL. |
| `seller_privacy_policy` | Required when checkout is enabled | URL | Seller privacy policy URL. |
| `seller_tos` | Required when checkout is enabled | URL | Seller terms URL. |

## Returns

Use `return_deadline_in_days` as the canonical return-window field.

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `accepts_returns` | No | Boolean | Whether returns are accepted. |
| `return_deadline_in_days` | No | Integer | Days allowed for return. |
| `accepts_exchanges` | No | Boolean | Whether exchanges are accepted. |
| `return_policy` | Yes | URL | Return policy URL. |

## Performance Signals

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `popularity_score` | No | Number | Popularity indicator. |
| `return_rate` | No | Number | Return-rate indicator. |

## Compliance

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `warning` | Recommended for checkout | String | Product disclaimer text. |
| `warning_url` | Recommended for checkout | URL | Product disclaimer URL. |
| `age_restriction` | Recommended | Number | Minimum purchase age. |

## Reviews and Q&A

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `review_count` | No | Integer | Number of product reviews. |
| `star_rating` | No | String | Average review score. |
| `store_review_count` | No | Integer | Number of brand/store reviews. |
| `store_star_rating` | No | String | Average store rating. |
| `q_and_a` | Recommended | List | FAQ list of question/answer objects. |
| `reviews` | Recommended | List | Review objects with title/content/rating fields. |

## Related Products

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `related_product_id` | Recommended | String | Associated product ID. |
| `relationship_type` | Recommended | Enum | Relationship type (for example `part_of_set`). |

## Geo Tagging

| Attribute | Required | Data Type | Description |
| --- | --- | --- | --- |
| `target_countries` | Yes | List | Target countries list (first entry used by OpenAI). |
| `store_country` | Yes | String | Store country of the item. |
| `geo_price` | No | Number + currency | Region-specific price. |
| `geo_availability` | No | String | Region-specific availability. |

## Validation Rules Implemented in Code

The feed endpoint enforces these checks before returning data:

- Required field presence checks for all core fields.
- URL validation for product, media, seller, and policy URLs.
- Currency format validation for `price` (`123.45 CUR`).
- Date format validation (`YYYY-MM-DD`) for sale and pre-order date fields.
- Dependency validation:
  - `is_eligible_checkout=true` requires `is_eligible_search=true`.
  - `availability=pre_order` requires `availability_date`.

If validation fails, the endpoint returns HTTP `500` with an `issues` array for debugging.