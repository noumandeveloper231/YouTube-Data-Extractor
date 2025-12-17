'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Icon components
const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Youtube = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

const Eye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Calendar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Globe = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const Check = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Copy = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const ArrowLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function ChannelExtractor() {
  const [channelUrl, setChannelUrl] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  // Improved YouTube Channel URL validation
  const isValidYouTubeChannelUrl = useCallback((url) => {
    if (!url || typeof url !== 'string') return false;
    
    const patterns = [
      // New @handle format (primary)
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_.-]+)/,
      // Legacy formats (still supported)
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
    ];
    return patterns.some(pattern => pattern.test(url.trim()));
  }, []);

  // Extract channel data function
  const extractChannelData = useCallback(async (url) => {
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setChannelData(null);

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelUrl: url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch channel data');
      }

      setChannelData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Immediate URL validation feedback
  useEffect(() => {
    const isValid = isValidYouTubeChannelUrl(channelUrl);
    setIsValidUrl(isValid);
    
    if (!isValid && channelUrl.trim()) {
      setError('');
      setChannelData(null);
    }
  }, [channelUrl, isValidYouTubeChannelUrl]);

  // Auto-extract when URL changes
  useEffect(() => {
    if (channelUrl && isValidUrl) {
      const timeoutId = setTimeout(() => {
        extractChannelData(channelUrl);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [channelUrl, isValidUrl, extractChannelData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channelUrl.trim()) return;
    extractChannelData(channelUrl);
  };

  // Copy function with visual feedback
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return parseInt(num).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Video Extractor
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <User className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                YouTube Channel Data Extractor
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Extract comprehensive channel information and statistics
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="Paste YouTube Channel URL (@handle) here - data will auto-extract!"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                    loading ? 'border-gray-300 dark:border-gray-600' :
                    channelUrl && isValidUrl ? 'border-green-500 focus:ring-green-500' :
                    channelUrl && !isValidUrl ? 'border-red-500 focus:ring-red-500' :
                    'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  ) : channelUrl && isValidUrl ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : channelUrl && !isValidUrl ? (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  {loading ? '🔄 Extracting channel data...' :
                   channelUrl && isValidUrl ? '✅ Valid YouTube Channel URL - extracting in 0.3s' :
                   channelUrl && !isValidUrl ? '❌ Invalid YouTube Channel URL format' :
                   '✨ Auto-extraction enabled - just paste and wait!'}
                </span>
                <button
                  type="submit"
                  disabled={loading || !channelUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
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

          {/* Channel Data Display */}
          {channelData && (
            <div className="space-y-6">
              {/* Channel Header Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                  {channelData.bannerExternalUrl && (
                    <img
                      src={channelData.bannerExternalUrl}
                      alt="Channel Banner"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-6 -mt-16 relative">
                  <div className="flex items-start gap-4">
                    <img
                      src={channelData.thumbnails?.high?.url || channelData.thumbnails?.medium?.url}
                      alt={channelData.title}
                      className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    />
                    <div className="flex-1 mt-8">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {channelData.title}
                        </h2>
                        <button
                          onClick={() => copyToClipboard(channelData.title, 'title')}
                          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          title="Copy channel title"
                        >
                          {copiedField === 'title' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {channelData.customUrl && (
                          <div className="flex items-center gap-1">
                            <span>@{channelData.customUrl.replace('@', '')}</span>
                            <button
                              onClick={() => copyToClipboard(channelData.customUrl, 'customUrl')}
                              className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                            >
                              {copiedField === 'customUrl' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(channelData.publishedAt).toLocaleDateString()}
                        </div>
                        {channelData.country && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            {channelData.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Subscribers</h3>
                        <p className="text-2xl font-bold text-red-600">{formatNumber(channelData.statistics?.subscriberCount)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(channelData.statistics?.subscriberCount, 'subscribers')}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copiedField === 'subscribers' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Videos</h3>
                        <p className="text-2xl font-bold text-blue-600">{formatNumber(channelData.statistics?.videoCount)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(channelData.statistics?.videoCount, 'videos')}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copiedField === 'videos' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Views</h3>
                        <p className="text-2xl font-bold text-green-600">{formatNumber(channelData.statistics?.viewCount)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(channelData.statistics?.viewCount, 'views')}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copiedField === 'views' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Channel Description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Channel Description</h3>
                  <button
                    onClick={() => copyToClipboard(channelData.description || 'No description available', 'description')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    {copiedField === 'description' ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Description
                      </>
                    )}
                  </button>
                </div>
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {channelData.description || 'No description available'}
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technical Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Channel ID:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">{channelData.id}</span>
                      <button
                        onClick={() => copyToClipboard(channelData.id, 'channelId')}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                      >
                        {copiedField === 'channelId' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  {channelData.keywords && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Keywords:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 dark:text-gray-400">{channelData.keywords.split(' ').length} keywords</span>
                        <button
                          onClick={() => copyToClipboard(channelData.keywords, 'keywords')}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                        >
                          {copiedField === 'keywords' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
