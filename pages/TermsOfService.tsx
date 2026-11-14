import React from 'react';
import { ScrollText } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-primary-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400">
            <ScrollText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400">Last updated: May 15, 2025</p>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Introduction</h2>
            <p>Welcome to Nexus Tickets. By accessing our website and using our services, you agree to be bound by these Terms of Service. Please read them carefully.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. User Accounts</h2>
            <p>To purchase tickets, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Ticket Purchases and Refunds</h2>
            <ul className="list-disc pl-5 space-y-2">
                <li>All ticket sales are final unless otherwise stated in the specific event policy.</li>
                <li>Refunds are generally available for cancellations made at least 48 hours prior to the event start time.</li>
                <li>Nexus Tickets is not responsible for lost or stolen tickets.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Event Changes</h2>
            <p>Event organizers reserve the right to change event dates, times, and venues. Nexus Tickets will make reasonable efforts to notify ticket holders of such changes but assumes no liability for any costs incurred.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Code of Conduct</h2>
            <p>Users agree not to use the platform for any unlawful purpose or to interfere with the operation of the site. Harassment of other users or staff will result in immediate account termination.</p>
        </section>

        <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Limitation of Liability</h2>
            <p>Nexus Tickets shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of our services.</p>
        </section>
      </div>
    </div>
  );
};