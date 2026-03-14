import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, MousePointerClick } from 'lucide-react';

export default function AdminTraffic() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/traffic', {
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
    fetchTraffic();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Traffic Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-blue-100 p-4 rounded-lg mr-4"><Users className="h-6 w-6 text-blue-600" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Total Unique Visitors</p><p className="text-3xl font-bold text-slate-900">{data?.totalVisitors || 0}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <div className="bg-emerald-100 p-4 rounded-lg mr-4"><MousePointerClick className="h-6 w-6 text-emerald-600" /></div>
          <div><p className="text-sm text-slate-500 font-medium">Total Clicks</p><p className="text-3xl font-bold text-slate-900">{data?.totalClicks || 0}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Clicks Per Day (Last 7 Days)</h2>
          <div className="h-72">
            {data?.clicksPerDay?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.clicksPerDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">Top 10 Links</h2>
          <div className="h-72">
            {data?.topLinks?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topLinks} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" fontSize={12} />
                  <YAxis dataKey="short_code" type="category" stroke="#64748b" fontSize={12} tickMargin={10} />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="clicks" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
