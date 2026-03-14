import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { Calendar, ArrowLeft } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Post not found');
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="py-20 text-center text-slate-500">Loading post...</div>;
  if (error) return <div className="py-20 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Helmet>
        <title>{post.meta_title || `${post.title} - UrlReducer`}</title>
        <meta name="description" content={post.meta_description || post.title} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.title} />
        <meta property="og:type" content="article" />
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/blog" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Link>

        <article className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <header className="mb-10 text-center border-b border-slate-100 pb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">{post.title}</h1>
            <div className="flex items-center justify-center text-slate-500 font-medium">
              <Calendar className="h-5 w-5 mr-2" />
              {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>

          <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </motion.div>
    </div>
  );
}
