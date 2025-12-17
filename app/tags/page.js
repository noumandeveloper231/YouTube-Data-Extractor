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

const Tag = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
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

const Download = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Hash = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const Filter = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

export default function TagsExtractor() {
  const [videoUrl, setVideoUrl] = useState('');
  const [tagsData, setTagsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedTag, setCopiedTag] = useState('');
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('original'); // original, alphabetical, length

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

  // Extract tags function
  const extractTags = useCallback(async (url) => {
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setTagsData(null);

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
        throw new Error(result.error || 'Failed to fetch video tags');
      }

      setTagsData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Immediate URL validation feedback
  useEffect(() => {
    const isValid = isValidYouTubeUrl(videoUrl);
    setIsValidUrl(isValid);
    
    if (!isValid && videoUrl.trim()) {
      setError('');
      setTagsData(null);
    }
  }, [videoUrl, isValidYouTubeUrl]);

  // Auto-extract when URL changes
  useEffect(() => {
    if (videoUrl && isValidUrl) {
      const timeoutId = setTimeout(() => {
        extractTags(videoUrl);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [videoUrl, isValidUrl, extractTags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    extractTags(videoUrl);
  };

  // Copy functions with visual feedback
  const copyAllTags = async (tags) => {
    try {
      const tagsText = tags.join(', ');
      await navigator.clipboard.writeText(tagsText);
      setCopiedTags(true);
      setTimeout(() => setCopiedTags(false), 2000);
    } catch (error) {
      console.error('Failed to copy tags:', error);
    }
  };

  const copyHashtagFormat = async (tags) => {
    try {
      const hashtagText = tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
      await navigator.clipboard.writeText(hashtagText);
      setCopiedTag('hashtags');
      setTimeout(() => setCopiedTag(''), 2000);
    } catch (error) {
      console.error('Failed to copy hashtags:', error);
    }
  };

  const copySingleTag = async (tag) => {
    try {
      await navigator.clipboard.writeText(tag);
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(''), 2000);
    } catch (error) {
      console.error('Failed to copy tag:', error);
    }
  };

  const downloadTagsAsFile = (tags, format = 'txt') => {
    let content = '';
    let filename = '';
    
    if (format === 'txt') {
      content = tags.join('\n');
      filename = `youtube_tags_${Date.now()}.txt`;
    } else if (format === 'csv') {
      content = 'Tag\n' + tags.map(tag => `"${tag}"`).join('\n');
      filename = `youtube_tags_${Date.now()}.csv`;
    } else if (format === 'json') {
      content = JSON.stringify({ tags, extractedAt: new Date().toISOString() }, null, 2);
      filename = `youtube_tags_${Date.now()}.json`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Filter and sort tags
  const getProcessedTags = () => {
    if (!tagsData?.tags) return [];
    
    let processed = [...tagsData.tags];
    
    // Filter
    if (filterText) {
      processed = processed.filter(tag => 
        tag.toLowerCase().includes(filterText.toLowerCase())
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'alphabetical':
        processed.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        break;
      case 'length':
        processed.sort((a, b) => a.length - b.length);
        break;
      default: // original
        break;
    }
    
    return processed;
  };

  const processedTags = getProcessedTags();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Video Extractor
            </Link>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tag className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                YouTube Tags Extractor
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Extract, filter, and export video tags in multiple formats
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube URL here - tags will auto-extract!"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                    loading ? 'border-gray-300 dark:border-gray-600' :
                    videoUrl && isValidUrl ? 'border-green-500 focus:ring-green-500' :
                    videoUrl && !isValidUrl ? 'border-red-500 focus:ring-red-500' :
                    'border-gray-300 dark:border-gray-600 focus:ring-purple-500'
                  }`}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                  ) : videoUrl && isValidUrl ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : videoUrl && !isValidUrl ? (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  {loading ? '🔄 Extracting tags...' :
                   videoUrl && isValidUrl ? '✅ Valid YouTube URL - extracting in 0.3s' :
                   videoUrl && !isValidUrl ? '❌ Invalid YouTube URL format' :
                   '✨ Auto-extraction enabled - just paste and wait!'}
                </span>
                <button
                  type="submit"
                  disabled={loading || !videoUrl.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
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

          {/* Tags Display */}
          {tagsData && tagsData.tags && tagsData.tags.length > 0 && (
            <div className="space-y-6">
              {/* Video Info Header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={tagsData.thumbnails?.medium?.url}
                    alt={tagsData.title}
                    className="w-20 h-15 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {tagsData.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Found {tagsData.tags.length} tags
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="Filter tags..."
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="original">Original Order</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="length">By Length</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyAllTags(processedTags)}
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
                          Copy All
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => copyHashtagFormat(processedTags)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      {copiedTag === 'hashtags' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Hash className="w-4 h-4" />
                          Copy as #Tags
                        </>
                      )}
                    </button>
                    
                    <div className="relative group">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                          onClick={() => downloadTagsAsFile(processedTags, 'txt')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-t-lg"
                        >
                          Export as TXT
                        </button>
                        <button
                          onClick={() => downloadTagsAsFile(processedTags, 'csv')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          Export as CSV
                        </button>
                        <button
                          onClick={() => downloadTagsAsFile(processedTags, 'json')}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-b-lg"
                        >
                          Export as JSON
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {processedTags.length} of {tagsData.tags.length} tags
                </div>
              </div>

              {/* Tags Grid */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="grid gap-3">
                  {processedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {tag}
                      </span>
                      <button
                        onClick={() => copySingleTag(tag)}
                        className="opacity-0 group-hover:opacity-100 text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                        title="Copy this tag"
                      >
                        {copiedTag === tag ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Tags Message */}
          {tagsData && (!tagsData.tags || tagsData.tags.length === 0) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Tags Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                This video doesn't have any tags or they are not publicly available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
