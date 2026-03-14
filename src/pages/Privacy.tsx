import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200"
      >
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to UrlReducer. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our URL shortening service.</p>
          
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect via the Website includes:</p>
          <ul>
            <li><strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate the Site. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Site.</li>
            <li><strong>Link Data:</strong> When you shorten a URL, we store the original URL and generate a shortened version. We also collect analytics data when users click on the shortened links, including the IP address, timestamp, and user agent of the clicker.</li>
            <li><strong>Contact Information:</strong> If you contact us through our contact form, we may collect your name, email address, and the contents of your message.</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
          <ul>
            <li>Provide, operate, and maintain our URL shortening service.</li>
            <li>Generate analytics and statistics for the creators of shortened links.</li>
            <li>Improve, personalize, and expand our website and services.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity (e.g., blocking malicious URLs).</li>
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
          </ul>
          
          <h2>4. Cookies and Web Beacons</h2>
          <p>We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. When you access the Site, your personal information is not collected through the use of tracking technology. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.</p>
          
          <h2>5. Third-Party Advertising and Analytics</h2>
          <p>We may partner with third-party vendors, such as Google AdSense, to allow tracking technologies and remarketing services on the Site through the use of first-party cookies and third-party cookies. These vendors use cookies to serve ads based on a user's prior visits to our website or other websites.</p>
          <p><strong>Google DoubleClick DART Cookie:</strong> Google, as a third-party vendor, uses cookies to serve ads on our Site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our Site and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.</p>
          
          <h2>6. Data Security</h2>
          <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

          <h2>7. Your Data Protection Rights (GDPR & CCPA)</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right of rectification (to have your information corrected if it is inaccurate).</li>
            <li>The right to object to our processing of your personal data.</li>
            <li>The right of restriction (to request that we restrict the processing of your personal information).</li>
            <li>The right to data portability (to be provided with a copy of the information we have on you).</li>
            <li>The right to withdraw consent at any time where we relied on your consent to process your personal information.</li>
          </ul>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.</p>

          <h2>9. Contact Us</h2>
          <p>If you have questions or comments about this Privacy Policy, please contact us via our <a href="/contact">Contact page</a>.</p>
        </div>
      </motion.div>
    </div>
  );
}
