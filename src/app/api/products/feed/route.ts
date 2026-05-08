import { NextResponse } from 'next/server';
import { getOpenAIProductFeedItems, validateOpenAIProductFeed } from '@/lib/openai-product-feed';

export async function GET() {
  try {
    const items = getOpenAIProductFeedItems();
    const validationErrors = validateOpenAIProductFeed(items);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Product feed validation failed',
          issues: validationErrors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        schema_version: 'openai-products-v1',
        generated_at: new Date().toISOString(),
        item_count: items.length,
        items,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error generating OpenAI product feed:', error);
    return NextResponse.json({ error: 'Failed to generate product feed' }, { status: 500 });
  }
}
