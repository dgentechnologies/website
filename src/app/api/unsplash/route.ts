import { NextResponse } from 'next/server';
import { createApi } from 'unsplash-js';

// Ensure the environment variable is being read.
if (!process.env.UNSPLASH_ACCESS_KEY) {
  throw new Error("UNSPLASH_ACCESS_KEY environment variable is not set.");
}

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export async function GET(request: Request) {
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
      return NextResponse.json({ url: photo.urls.regular });
    } else {
      return NextResponse.json({ error: 'No image found for the query' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
