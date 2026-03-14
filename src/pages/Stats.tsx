import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3, Clock, Globe, Search, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState(code || '');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(!!code);
  const [error, setError] = useState('');

  const fetchStats = async (shortCode: string) => {
    setLoading(true);
    setError('');
    setStats(null);

    try {
      const response = await fetch(`/api/stats/${shortCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Stats not found');
      }

      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchStats(code);
      setSearchCode(code);
    } else {
      setStats(null);
      setSearchCode('');
      setError('');
    }
  }, [code]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let codeToSearch = searchCode.trim();
    
    // If user pasted a full URL, extract just the code
    if (codeToSearch.includes('/')) {
      const parts = codeToSearch.split('/');
      codeToSearch = parts[parts.length - 1];
    }
    
    if (codeToSearch) {
      navigate(`/stats/${codeToSearch}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Link Statistics</h1>
        <p className="text-slate-600 text-lg">Enter your short code to view detailed analytics.</p>
        
        <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="e.g., abc123"
            className="block w-full pl-11 pr-32 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-colors shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-lg transition-colors flex items-center"
          >
            Analyze
          </button>
        </form>
      </motion.div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-700 p-6 rounded-xl text-center max-w-md mx-auto border border-red-100"
        >
          <p className="font-semibold">{error}</p>
          <p className="text-sm mt-2">Please check the short code and try again.</p>
        </motion.div>
      )}

      {stats && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <Globe className="mr-2 h-6 w-6 text-indigo-600" />
                  {stats.short_code}
                </h2>
                <a href={stats.original_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-600 truncate max-w-md inline-block mt-1 transition-colors">
                  {stats.original_url}
                </a>
              </div>
              <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Created: {new Date(stats.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-3" />
                <span className="text-4xl font-black text-slate-900">{stats.clicks}</span>
                <span className="text-slate-500 font-medium mt-1 uppercase tracking-wider text-sm">Total Clicks</span>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center md:col-span-2">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 w-full text-left">Recent Activity</h3>
                {stats.recentClicks && stats.recentClicks.length > 0 ? (
                  <div className="w-full overflow-hidden rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {stats.recentClicks.slice(0, 5).map((click: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {new Date(click.clicked_at).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                              {click.ip_address ? click.ip_address.replace(/::ffff:/g, '') : 'unknown'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-slate-500 italic p-4 bg-white rounded-lg border border-slate-200 w-full">
                    No clicks recorded yet. Share your link to get started!
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
