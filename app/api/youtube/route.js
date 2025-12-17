import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { videoUrl, channelUrl } = await request.json();
    
    if (!videoUrl && !channelUrl) {
      return NextResponse.json({ error: 'Video URL or Channel URL is required' }, { status: 400 });
    }

    // Handle channel URL extraction
    if (channelUrl) {
      return await handleChannelExtraction(channelUrl);
    }

    // Extract video ID from YouTube URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    // Fetch video metadata from YouTube Data API
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
    );

    console.log('videoResponse', videoResponse)

    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video data');
    }

    const videoData = await videoResponse.json();

    console.log('videoData', videoData)
    
    if (!videoData.items || videoData.items.length === 0) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const video = videoData.items[0];
    const snippet = video.snippet;
    const statistics = video.statistics;
    const contentDetails = video.contentDetails;

    // Fetch channel statistics
    let channelData = null;
    try {
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${snippet.channelId}&key=${apiKey}`
      );
      
      if (channelResponse.ok) {
        const channelResult = await channelResponse.json();
        if (channelResult.items && channelResult.items.length > 0) {
          channelData = channelResult.items[0];
        }
      }
    } catch (error) {
      console.warn('Failed to fetch channel data:', error);
    }

    // Format the metadata
    const metadata = {
      id: video.id,
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
      channelId: snippet.channelId,
      publishedAt: snippet.publishedAt,
      thumbnails: {
        default: snippet.thumbnails.default?.url,
        medium: snippet.thumbnails.medium?.url,
        high: snippet.thumbnails.high?.url,
        standard: snippet.thumbnails.standard?.url,
        maxres: snippet.thumbnails.maxres?.url,
      },
      tags: snippet.tags || [],
      categoryId: snippet.categoryId,
      defaultLanguage: snippet.defaultLanguage,
      defaultAudioLanguage: snippet.defaultAudioLanguage,
      duration: contentDetails.duration,
      dimension: contentDetails.dimension,
      definition: contentDetails.definition,
      caption: contentDetails.caption,
      licensedContent: contentDetails.licensedContent,
      statistics: {
        viewCount: statistics.viewCount,
        likeCount: statistics.likeCount,
        commentCount: statistics.commentCount,
      },
      channel: channelData ? {
        id: channelData.id,
        title: channelData.snippet.title,
        description: channelData.snippet.description,
        customUrl: channelData.snippet.customUrl,
        publishedAt: channelData.snippet.publishedAt,
        thumbnails: {
          default: channelData.snippet.thumbnails.default?.url,
          medium: channelData.snippet.thumbnails.medium?.url,
          high: channelData.snippet.thumbnails.high?.url,
        },
        statistics: {
          viewCount: channelData.statistics.viewCount,
          subscriberCount: channelData.statistics.subscriberCount,
          videoCount: channelData.statistics.videoCount,
        },
        country: channelData.snippet.country,
      } : null,
    };

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video metadata' },
      { status: 500 }
    );
  }
}

async function handleChannelExtraction(channelUrl) {
  try {
    const channelIdentifier = extractChannelId(channelUrl);
    if (!channelIdentifier) {
      return NextResponse.json({ error: 'Invalid YouTube Channel URL' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
    }

    let channelResponse;
    
    // Try direct channel ID first (starts with UC and is 24 characters)
    if (channelIdentifier.startsWith('UC') && channelIdentifier.length === 24) {
      channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelIdentifier}&key=${apiKey}`
      );
    } else {
      // For @handles and custom URLs, try forHandle first (newer API)
      try {
        channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forHandle=${encodeURIComponent('@' + channelIdentifier)}&key=${apiKey}`
        );
      } catch (error) {
        console.log('forHandle not available, trying alternatives');
      }
      
      // If forHandle fails or not available, try forUsername
      if (!channelResponse || !channelResponse.ok) {
        channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&forUsername=${channelIdentifier}&key=${apiKey}`
        );
      }
      
      // If both fail, use search API as fallback
      if (!channelResponse.ok) {
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelIdentifier)}&key=${apiKey}&maxResults=1`
        );
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.items && searchData.items.length > 0) {
            const foundChannelId = searchData.items[0].snippet.channelId;
            channelResponse = await fetch(
              `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${foundChannelId}&key=${apiKey}`
            );
          }
        }
      }
    }

    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel data');
    }

    const channelData = await channelResponse.json();
    
    if (!channelData.items || channelData.items.length === 0) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const channel = channelData.items[0];
    const snippet = channel.snippet;
    const statistics = channel.statistics;
    const branding = channel.brandingSettings;

    // Format the channel metadata
    const metadata = {
      id: channel.id,
      title: snippet.title,
      description: snippet.description,
      customUrl: snippet.customUrl,
      publishedAt: snippet.publishedAt,
      thumbnails: {
        default: snippet.thumbnails.default?.url,
        medium: snippet.thumbnails.medium?.url,
        high: snippet.thumbnails.high?.url,
      },
      statistics: {
        viewCount: statistics.viewCount,
        subscriberCount: statistics.subscriberCount,
        videoCount: statistics.videoCount,
      },
      country: snippet.country,
      keywords: branding?.channel?.keywords,
      bannerExternalUrl: branding?.image?.bannerExternalUrl,
    };

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    console.error('Error fetching YouTube channel data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channel data' },
      { status: 500 }
    );
  }
}

function extractChannelId(url) {
  const patterns = [
    // New @handle format (primary)
    /(?:youtube\.com\/@)([a-zA-Z0-9_.-]+)/,
    // Legacy formats
    /(?:youtube\.com\/channel\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/c\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/user\/)([a-zA-Z0-9_-]+)/,
  ];

  // Extract identifier from URL
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
