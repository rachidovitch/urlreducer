import { useEffect, useState } from 'react';
import { Trash2, ExternalLink } from 'lucide-react';

export default function AdminLinks() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/links', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleDelete = async (code: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/admin/links/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900">Manage Links</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600">Short Code</th>
                <th className="p-4 font-semibold text-slate-600">Original URL</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Clicks</th>
                <th className="p-4 font-semibold text-slate-600">Created At</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.map((link) => (
                <tr key={link.short_code} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-indigo-600">{link.short_code}</td>
                  <td className="p-4 text-slate-600 max-w-xs truncate" title={link.original_url}>
                    <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                      {link.original_url} <ExternalLink className="h-3 w-3 ml-1 inline" />
                    </a>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-800">{link.clicks}</td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(link.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(link.short_code)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Link"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">No links found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
