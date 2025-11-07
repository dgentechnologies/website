import { NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';

// Ensure the environment variable is being read.
if (!process.env.UNSPLASH_ACCESS_KEY) {
  throw new Error("UNSPLASH_ACCESS_KEY environment variable is not set.");
}

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

// --- In-memory rate limiter ---
const RATE_LIMIT_COUNT = 50;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const requestTimestamps: number[] = [];

const isRateLimited = () => {
  const now = Date.now();
  // Remove timestamps older than the time window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }
  // Check if the number of requests exceeds the limit
  if (requestTimestamps.length >= RATE_LIMIT_COUNT) {
    return true;
  }
  return false;
};
// --- End of rate limiter ---

export async function GET(request: Request) {
  if (isRateLimited()) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Only ${RATE_LIMIT_COUNT} requests are allowed per hour.` },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const result = await unsplash.search.getPhotos({
      query: query,
      page: 1,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.errors) {
      console.error('Unsplash API error:', result.errors);
      return NextResponse.json({ error: 'Failed to fetch image from Unsplash' }, { status: 500 });
    }
    
    const photo = result.response?.results[0];

    if (photo) {
      requestTimestamps.push(Date.now()); // Record successful request
      return NextResponse.json({ url: photo.urls.regular });
    } else {
      return NextResponse.json({ error: 'No image found for the query' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
