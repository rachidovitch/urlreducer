import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchPosts();
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-500">Loading blog posts...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>Blog - UrlReducer</title>
        <meta name="description" content="Read the latest articles, tips, and news about URL shortening, SEO, and digital marketing from UrlReducer." />
        <meta property="og:title" content="Blog - UrlReducer" />
        <meta property="og:description" content="Read the latest articles, tips, and news about URL shortening, SEO, and digital marketing from UrlReducer." />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">UrlReducer Blog</h1>
        <p className="text-xl text-slate-600">Insights, tips, and updates to help you maximize your links.</p>
      </motion.div>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center text-sm text-slate-500 mb-3">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
              <Link to={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {post.meta_description || 'Read more about this topic in our detailed blog post...'}
            </p>
            <Link 
              to={`/blog/${post.slug}`}
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
            >
              Read Article <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.article>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">No blog posts published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
