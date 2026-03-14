import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, ExternalLink } from 'lucide-react';

export default function Redirect() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const ads = document.querySelectorAll('.adsbygoogle');
      if (ads.length > 0) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await fetch(`/api/url/${code}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'URL not found');
        }

        setOriginalUrl(data.original_url);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUrl();
  }, [code]);

  useEffect(() => {
    if (!loading && originalUrl && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && originalUrl) {
      window.location.href = originalUrl;
    }
  }, [countdown, loading, originalUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading your link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-red-50 text-red-700 p-8 rounded-2xl max-w-md text-center border border-red-100">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-8">
      {/* Top Ad Banner */}
      <div className="w-full h-24 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center overflow-hidden relative group">
        <span className="absolute text-slate-400 font-mono text-sm uppercase tracking-widest z-10">Advertisement</span>
        {/* GOOGLE ADSENSE CODE (Top Banner) */}
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '96px' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          You are being redirected...
        </h1>
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-100"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * countdown) / 10}
                className="text-indigo-600 transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="text-4xl font-black text-indigo-600">{countdown}</span>
          </div>
          <p className="text-slate-500 mt-4 font-medium uppercase tracking-wide text-sm">Seconds Remaining</p>
        </div>

        {/* Middle Ad Content */}
        <div className="w-full h-64 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mb-8 relative overflow-hidden">
          <span className="absolute text-slate-400 font-mono text-sm uppercase tracking-widest z-10">Advertisement</span>
          {/* GOOGLE ADSENSE CODE (Middle Banner) */}
          <ins className="adsbygoogle"
               style={{ display: 'block', width: '100%', height: '256px' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-slate-600">Destination: <span className="font-semibold text-slate-900 truncate max-w-[200px] inline-block align-bottom">{new URL(originalUrl).hostname}</span></p>
          
          <button
            onClick={() => window.location.href = originalUrl}
            disabled={countdown > 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-colors ${
              countdown > 0 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
            }`}
          >
            Skip Ad & Continue <ExternalLink className="ml-2 h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Bottom Ad Banner */}
      <div className="w-full h-24 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center relative overflow-hidden">
        <span className="absolute text-slate-400 font-mono text-sm uppercase tracking-widest z-10">Advertisement</span>
        {/* GOOGLE ADSENSE CODE (Bottom Banner) */}
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '96px' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
