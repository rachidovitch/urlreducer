import { motion } from 'motion/react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Use</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing, browsing, or using the UrlReducer website and services (the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Service.</p>
          
          <h2>2. Description of Service</h2>
          <p>UrlReducer provides a URL shortening service that allows users to convert long URLs into shorter, more manageable links. We also provide basic analytics for these shortened links. We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice.</p>

          <h2>3. User Conduct and Acceptable Use</h2>
          <p>You agree to use the Service only for lawful purposes. You are strictly prohibited from using the Service to:</p>
          <ul>
            <li>Shorten URLs that link to illegal, fraudulent, malicious, or harmful content (e.g., malware, phishing sites).</li>
            <li>Distribute spam, unsolicited promotions, or engage in any form of unsolicited communication.</li>
            <li>Violate any applicable local, state, national, or international laws or regulations.</li>
            <li>Infringe upon the intellectual property rights or privacy rights of others.</li>
            <li>Attempt to interfere with or disrupt the integrity or performance of the Service.</li>
          </ul>
          <p>We reserve the right to disable or delete any shortened URL that violates these terms, at our sole discretion and without notice.</p>
          
          <h2>4. Intellectual Property</h2>
          <p>All content, features, and functionality on the UrlReducer website, including but not limited to text, graphics, logos, and software, are the exclusive property of UrlReducer and are protected by copyright, trademark, and other intellectual property laws.</p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. UrlReducer makes no representations or warranties of any kind, express or implied, regarding the operation of the Service, the accuracy of the information, or the reliability of any shortened links. We disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
          
          <h2>6. Limitation of Liability</h2>
          <p>In no event shall UrlReducer, its directors, employees, partners, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; or (iii) unauthorized access, use, or alteration of your transmissions or content.</p>
          
          <h2>7. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless UrlReducer and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the Service, or a breach of these Terms.</p>

          <h2>8. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us through our <a href="/contact">Contact page</a>.</p>
        </div>
      </motion.div>
    </div>
  );
}
