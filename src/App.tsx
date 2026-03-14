import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Redirect from './pages/Redirect';
import Stats from './pages/Stats';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import CookieConsent from './components/CookieConsent';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLinks from './pages/admin/Links';
import AdminTraffic from './pages/admin/Traffic';
import AdminBlog from './pages/admin/Blog';

// Blog Pages
import BlogList from './pages/blog/BlogList';
import BlogPost from './pages/blog/BlogPost';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
          <header className="bg-white border-b border-slate-200 py-4 shadow-sm shrink-0">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                UrlReducer
              </Link>
              <nav className="space-x-6">
                <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                <Link to="/blog" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Blog</Link>
                <Link to="/stats" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Stats</Link>
              </nav>
            </div>
          </header>

          <main className="flex-1 w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/stats/:code" element={<Stats />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Blog Routes */}
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="links" element={<AdminLinks />} />
                <Route path="traffic" element={<AdminTraffic />} />
                <Route path="blog" element={<AdminBlog />} />
              </Route>

              {/* Redirect Route (Must be last) */}
              <Route path="/:code" element={<Redirect />} />
            </Routes>
          </main>

          <footer className="bg-slate-900 text-slate-400 py-8 mt-auto shrink-0">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex justify-center space-x-6 mb-4">
                <Link to="/stats" className="hover:text-white transition-colors">Stats</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
              </div>
              <p>&copy; {new Date().getFullYear()} UrlReducer. All rights reserved.</p>
              <p className="text-sm mt-2">SEO Optimized URL Shortener with Analytics</p>
            </div>
          </footer>
          
          <CookieConsent />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
