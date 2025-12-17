'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckIcon, SearchIcon, YoutubeIcon } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from './components/Navbar';
import Image from 'next/image';

const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ThumbsUp = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
  </svg>
);

const MessageCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Clock = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Tag = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Download = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Copy = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const Check = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Video = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedTags, setCopiedTags] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);


  // Auto-extraction function
  const extractMetadata = useCallback(async (url) => {
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setMetadata(null);

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl: url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch metadata');
      }

      setMetadata(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Improved YouTube URL validation
  const isValidYouTubeUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return false;

    const patterns = [
      // Standard youtube.com/watch?v= format
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?.*[?&]v=([a-zA-Z0-9_-]+)/,
      // Short youtu.be format
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
      // Embed format
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
      // Simple v= format
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    ];
    return patterns.some(pattern => pattern.test(url.trim()));
  }, []);

  // Immediate URL validation feedback
  useEffect(() => {
    const isValid = isValidYouTubeUrl(videoUrl);
    setIsValidUrl(isValid);

    // Clear previous error if URL becomes invalid
    if (!isValid && videoUrl.trim()) {
      setError('');
      setMetadata(null);
    }
  }, [videoUrl, isValidYouTubeUrl]);

  // Auto-extract when URL changes (with faster debounce)
  useEffect(() => {
    if (videoUrl && isValidUrl) {
      const timeoutId = setTimeout(() => {
        extractMetadata(videoUrl);
      }, 300); // Reduced to 300ms for faster response

      return () => clearTimeout(timeoutId);
    }
  }, [videoUrl, isValidUrl, extractMetadata]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    extractMetadata(videoUrl);
  };

  // Download thumbnail function
  const downloadThumbnail = async (thumbnailUrl, filename) => {
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download thumbnail:', error);
    }
  };

  // Copy tags function
  const copyTags = async (tags) => {
    try {
      const tagsText = tags.join(', ');
      await navigator.clipboard.writeText(tagsText);
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
      toast.success("Tags Copied Successfuly")
    } catch (error) {
      console.error('Failed to copy tags:', error);
    }
  };

  const formatDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    let formatted = '';
    if (hours) formatted += `${hours}:`;
    formatted += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    return formatted;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseInt(num).toLocaleString();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-from to-to">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <YoutubeIcon className='text-red-500 ' size={50} />
                <h1 className="text-4xl font-bold text-primary">
                  YouTube Metadata Extractor
                </h1>
              </div>
              <p className="text-white">
                Extract comprehensive metadata from any YouTube video
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-main rounded-xl shadow-lg p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5' />
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube URL here - metadata will auto-extract!"
                    className={`w-full pl-10 pr-12 py-3 border outline-0 rounded-lg focus:ring-2 focus:border-transparent bg-from text-white transition-colors ${loading ? 'border-white' :
                        videoUrl && isValidUrl ? 'border-green-500 focus:ring-green-500' :
                          videoUrl && !isValidUrl ? 'border-red-500 focus:ring-red-500' :
                            'border-gray-300 dark:border-gray-600 focus:ring-red-500'
                      }`}
                    disabled={loading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                    ) : videoUrl && isValidUrl ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckIcon className='w-3 h-3 text-white' />
                      </div>
                    ) : videoUrl && !isValidUrl ? (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-2">
                  <span>
                    {loading ? '🔄 Extracting metadata...' :
                      videoUrl && isValidUrl ? '✅ Valid YouTube URL - extracting in 0.3s' :
                        videoUrl && !isValidUrl ? '❌ Invalid YouTube URL format' :
                          'Auto-extraction enabled - just paste and wait!'}
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !videoUrl.trim()}
                    className="primary"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Extracting...
                      </>
                    ) : (
                      <>
                        <SearchIcon className="w-4 h-4" />
                        Extract Now
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-8">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {/* Metadata Display */}
            {metadata && (
              <div className="space-y-6">
                {/* Video Info Card */}
                <div className="bg-main rounded-xl shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative group">
                      <Image
                        src={metadata.thumbnails.high || metadata.thumbnails.medium}
                        alt={metadata.title}
                        fill
                        className="w-full h-48 md:h-full object-cover"
                      />
                      <div className="absolute inset-0 backdrop-blur-[10px] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <button
                          onClick={() => downloadThumbnail(
                            metadata.thumbnails.maxres || metadata.thumbnails.high || metadata.thumbnails.medium,
                            `${metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}_thumbnail.jpg`
                          )}
                          className="bg-black text-white hover:text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-2 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h2 className="text-2xl font-bold text-white mb-3">
                        {metadata.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-2 mb-4">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {metadata.channelTitle}
                          {metadata.channel && (
                            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                              {formatNumber(metadata.channel.statistics.subscriberCount)} subs
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(metadata.publishedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(metadata.duration)}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1 text-2">
                          <Eye className="w-4 h-4" />
                          {formatNumber(metadata.statistics.viewCount)} views
                        </div>
                        <div className="flex items-center gap-1 text-2">
                          <ThumbsUp className="w-4 h-4" />
                          {formatNumber(metadata.statistics.likeCount)} likes
                        </div>
                        <div className="flex items-center gap-1 text-2">
                          <MessageCircle className="w-4 h-4" />
                          {formatNumber(metadata.statistics.commentCount)} comments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-main rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                  <div className="text-2 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {metadata.description || 'No description available'}
                  </div>
                </div>

                {/* Tags */}
                {metadata.tags && metadata.tags.length > 0 && (
                  <div className="bg-main rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Tags ({metadata.tags.length})
                      </h3>
                      <button
                        onClick={() => copyTags(metadata.tags)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        {copiedTags ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                          onClick={() => copyTags([tag])}
                          title="Click to copy this tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Channel Details */}
                {metadata.channel && (
                  <div className="bg-main rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Channel Information
                    </h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={metadata.channel.thumbnails.high || metadata.channel.thumbnails.medium}
                        alt={metadata.channel.title}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-2 mb-2">
                          {metadata.channel.title}
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-2" />
                            <span className="text-2/90">
                              {formatNumber(metadata.channel.statistics.subscriberCount)} subscribers
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-2" />
                            <span className="text-2/90">
                              {formatNumber(metadata.channel.statistics.videoCount)} videos
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-2" />
                            <span className="text-2/90">
                              {formatNumber(metadata.channel.statistics.viewCount)} total views
                            </span>
                          </div>
                        </div>
                        {metadata.channel.description && (
                          <div className="mt-3 text-2 text-sm max-h-20 overflow-y-auto">
                            {metadata.channel.description.substring(0, 200)}
                            {metadata.channel.description.length > 200 && '...'}
                          </div>
                        )}
                        <div className="mt-3 flex items-center gap-4 text-xs text-2">
                          <span>Joined: {new Date(metadata.channel.publishedAt).toLocaleDateString()}</span>
                          {metadata.channel.country && <span>Country: {metadata.channel.country}</span>}
                          {metadata.channel.customUrl && (
                            <span>Custom URL: {metadata.channel.customUrl}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Details */}
                <div className="bg-main rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-2 mb-4">Technical Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-2">Video ID:</span>
                      <span className="ml-2 text-2/90">{metadata.id}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-2">Channel ID:</span>
                      <span className="ml-2 text-2/90">{metadata.channelId}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-2">Definition:</span>
                      <span className="ml-2 text-2/90">{metadata.definition}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-2">Dimension:</span>
                      <span className="ml-2 text-2/90">{metadata.dimension}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-2">Caption:</span>
                      <span className="ml-2 text-2/90">{metadata.caption}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-2">Licensed Content:</span>
                      <span className="ml-2 text-2/90">{metadata.licensedContent ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
}
