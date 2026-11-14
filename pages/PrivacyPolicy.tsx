import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-green-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
            <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: May 15, 2025</p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as when you create an account, purchase tickets, or contact support. This may include your name, email address, payment information, and transaction history.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Process your transactions and send you your tickets.</li>
                <li>Provide customer support and respond to your inquiries.</li>
                <li>Send you updates about events you are attending.</li>
                <li>Improve our platform and prevent fraud.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Data Sharing</h2>
            <p>We do not sell your personal data. We may share your information with:</p>
            <ul className="list-disc pl-5 space-y-2">
                <li>Event organizers, strictly for the purpose of managing the event you purchased tickets for.</li>
                <li>Service providers who assist with payment processing and email delivery.</li>
                <li>Legal authorities if required by law.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You can manage your account settings directly on the platform or contact us for assistance.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Cookies</h2>
            <p>We use cookies to improve your experience on our site, such as keeping you logged in and remembering your preferences.</p>
        </section>
      </div>
    </div>
  );
};