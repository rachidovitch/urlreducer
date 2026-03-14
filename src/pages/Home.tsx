import { useState, useEffect } from 'react';
import { Link2, Copy, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    try {
      // Initialize AdSense ads if they haven't been already
      const ads = document.querySelectorAll('.adsbygoogle');
      if (ads.length > 0) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }

    // Fetch latest blog posts
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blog');
        const data = await res.json();
        setLatestPosts(data.slice(0, 3)); // Get top 3
      } catch (err) {
        console.error('Failed to fetch blog posts', err);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setShortCode('');
    setCopied(false);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setShortUrl(data.short_url);
      setShortCode(data.short_code);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 justify-center py-12 w-full max-w-7xl mx-auto">
      {/* Left Ad Banner - Hidden on smaller screens */}
      <div className="hidden lg:block w-[300px] shrink-0">
        <div className="sticky top-8 bg-slate-100 border border-slate-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400 text-sm overflow-hidden relative">
          <span className="absolute top-2 left-0 right-0 text-center text-xs uppercase tracking-widest z-10">Advertisement</span>
          {/* GOOGLE ADSENSE CODE (Left Banner) */}
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '300px', height: '600px' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"></ins>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-grow max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Shorten Your Links, <span className="text-indigo-600">Expand Your Reach</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10">
            Create short, memorable links in seconds. Track clicks, analyze traffic, and monetize your audience with our powerful URL shortener.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Link2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your long URL here (https://...)"
                  className="block w-full pl-11 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {loading ? 'Shortening...' : 'Shorten'}
                {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-left">
                {error}
              </div>
            )}

            {shortUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100 text-left"
              >
                <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-2">Your Short Link is Ready</h3>
                <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-indigo-200">
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-xl font-medium text-indigo-600 hover:underline truncate mr-4">
                    {shortUrl}
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center text-slate-600 hover:text-indigo-600 transition-colors p-2 bg-slate-50 hover:bg-slate-100 rounded-md"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link to={`/stats/${shortCode}`} className="text-sm text-indigo-600 hover:underline font-medium flex items-center">
                    View Statistics <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">SEO Friendly</h3>
            <p className="text-slate-600">Clean, structured URLs that are easy to share and optimized for search engines.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Monetization</h3>
            <p className="text-slate-600">Built-in ad placements on redirect pages to help you generate revenue from your links.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-slate-600">Track clicks, monitor traffic sources, and understand your audience better.</p>
          </div>
        </div>

        {/* SEO Text Content */}
        <div className="mt-24 w-full text-left prose prose-slate max-w-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Use a URL Shortener?</h2>
          <p className="text-slate-600 text-lg mb-4">
            A URL shortener is a simple tool that takes a long URL and turns it into whatever URL you would like it to be. 
            Long URLs can be cumbersome, difficult to remember, and look messy when shared on social media or in emails. 
            By using UrlReducer, you can create clean, concise links that are more appealing to your audience.
          </p>
          <p className="text-slate-600 text-lg mb-4">
            Beyond aesthetics, shortened URLs provide valuable tracking capabilities. You can monitor how many times a link was clicked, 
            when the clicks occurred, and where your traffic is coming from. This data is crucial for optimizing your marketing campaigns 
            and understanding user behavior.
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Benefits of UrlReducer</h3>
          <ul className="list-disc pl-6 text-slate-600 text-lg space-y-2">
            <li><strong>Increased Click-Through Rates (CTR):</strong> Shorter, branded links inspire more trust and generally receive higher click rates.</li>
            <li><strong>Detailed Analytics:</strong> Gain insights into your audience with our comprehensive traffic statistics.</li>
            <li><strong>SEO Optimization:</strong> Our platform is built with SEO best practices in mind, ensuring your links perform well.</li>
            <li><strong>Easy Sharing:</strong> Perfect for Twitter, SMS, and other platforms with character limits.</li>
          </ul>
        </div>

        {/* Latest Blog Posts Preview */}
        {latestPosts.length > 0 && (
          <div className="mt-24 w-full text-left">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Latest from our Blog</h2>
              <Link to="/blog" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                View all posts <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                  <div className="flex items-center text-xs text-slate-500 mb-3">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 text-sm line-clamp-3">{post.meta_description || 'Read more...'}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Ad Banner - Hidden on smaller screens */}
      <div className="hidden lg:block w-[300px] shrink-0">
        <div className="sticky top-8 bg-slate-100 border border-slate-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400 text-sm overflow-hidden relative">
          <span className="absolute top-2 left-0 right-0 text-center text-xs uppercase tracking-widest z-10">Advertisement</span>
          {/* GOOGLE ADSENSE CODE (Right Banner) */}
          <ins className="adsbygoogle"
               style={{ display: 'inline-block', width: '300px', height: '600px' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"></ins>
        </div>
      </div>
    </div>
  );
}
