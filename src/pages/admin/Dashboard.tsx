import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link2, MousePointerClick, Users, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-lg mr-4"><Link2 className="h-6 w-6 text-indigo-600" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Total Links</p><p className="text-2xl font-bold text-slate-900">{data?.totalLinks || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-emerald-100 p-4 rounded-lg mr-4"><MousePointerClick className="h-6 w-6 text-emerald-600" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Total Clicks</p><p className="text-2xl font-bold text-slate-900">{data?.totalClicks || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg mr-4"><Users className="h-6 w-6 text-blue-600" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Visitors Today</p><p className="text-2xl font-bold text-slate-900">{data?.visitorsToday || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-purple-100 p-4 rounded-lg mr-4"><Calendar className="h-6 w-6 text-purple-600" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Visitors This Month</p><p className="text-2xl font-bold text-slate-900">{data?.visitorsMonth || 0}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Most Clicked Links</h2>
          <div className="space-y-4">
            {data?.topLinks?.map((link: any) => (
              <div key={link.short_code} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="truncate pr-4">
                  <p className="font-medium text-indigo-600 truncate">{link.short_code}</p>
                  <p className="text-sm text-slate-500 truncate">{link.original_url}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-slate-900">{link.clicks}</span> <span className="text-sm text-slate-500">clicks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Recent Links</h2>
          <div className="space-y-4">
            {data?.recentLinks?.map((link: any) => (
              <div key={link.short_code} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="truncate pr-4">
                  <p className="font-medium text-indigo-600 truncate">{link.short_code}</p>
                  <p className="text-sm text-slate-500 truncate">{link.original_url}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm text-slate-500">{new Date(link.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
