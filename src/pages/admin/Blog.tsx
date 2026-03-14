import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const method = currentPost.id ? 'PUT' : 'POST';
    const url = currentPost.id ? `/api/admin/blog/${currentPost.id}` : '/api/admin/blog';

    try {
      await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(currentPost)
      });
      setIsEditing(false);
      setCurrentPost(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Blog System</h1>
        <button 
          onClick={() => { setCurrentPost({ title: '', slug: '', content: '', meta_title: '', meta_description: '' }); setIsEditing(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" /> New Post
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">{currentPost.id ? 'Edit Post' : 'Create New Post'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X className="h-6 w-6" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" required value={currentPost.title} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (SEO URL)</label>
                <input type="text" required value={currentPost.slug} onChange={e => setCurrentPost({...currentPost, slug: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content (Markdown supported)</label>
              <textarea required rows={10} value={currentPost.content} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                <input type="text" value={currentPost.meta_title} onChange={e => setCurrentPost({...currentPost, meta_title: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                <input type="text" value={currentPost.meta_description} onChange={e => setCurrentPost({...currentPost, meta_description: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium mr-4 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Save Post</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600">Title</th>
                <th className="p-4 font-semibold text-slate-600">Slug</th>
                <th className="p-4 font-semibold text-slate-600">Date</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{post.title}</td>
                  <td className="p-4 text-slate-500">{post.slug}</td>
                  <td className="p-4 text-slate-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        // Fetch full post content before editing
                        fetch(`/api/blog/${post.slug}`)
                          .then(res => res.json())
                          .then(data => {
                            setCurrentPost(data);
                            setIsEditing(true);
                          });
                      }}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors mr-2"
                      title="Edit Post"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No blog posts found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
