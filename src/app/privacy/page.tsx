'use client'

import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <header>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-600">
            Effective date: {new Date().getFullYear()} — last updated {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">1. Introduction</h2>
          <p className="text-gray-600 leading-relaxed">
            YourThumbnailAI (“we”, “us” or “our”) respects your privacy and is committed to protecting personal
            information you may provide. This Privacy Policy explains what information we collect, how we store and
            use it, and the choices you have. If you have questions, email us at{' '}
            <Link href="mailto:hello@yourthumbnail.com" className="text-primary-600 hover:text-primary-700">
              hello@yourthumbnail.com
            </Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">2. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>
              <strong>Account Data:</strong> name, email address, profile photo, billing details, and authentication
              tokens created via Supabase.
            </li>
            <li>
              <strong>Payment Data:</strong> limited transaction details processed securely by Cashfree Payments; we
              never store full card numbers.
            </li>
            <li>
              <strong>Usage Data:</strong> thumbnails generated, prompts used, credits spent, device and browser
              metadata, and IP address for security and analytics.
            </li>
            <li>
              <strong>Support Data:</strong> messages or attachments you send to our support channels.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">3. How We Use Information</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>Provide and maintain the service, including AI thumbnail generation and account management.</li>
            <li>Process payments, credits, and refunds via Cashfree.</li>
            <li>Improve features, model quality, and product UX using aggregated analytics.</li>
            <li>Send transactional emails (account notices, receipts, password resets).</li>
            <li>Protect against fraud, abuse, and unauthorized access.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">4. Sharing & Disclosure</h2>
          <p className="text-gray-600">
            We never sell personal data. We share the minimum necessary information with trusted processors:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>
              <strong>Supabase</strong> for authentication, database, and storage.
            </li>
            <li>
              <strong>Cashfree Payments</strong> for payment processing.
            </li>
            <li>
              <strong>Analytics & Logging</strong> vendors that help monitor performance and detect abuse.
            </li>
          </ul>
          <p className="text-gray-600">
            We may disclose information if required by law or to defend our legal rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">5. Data Retention</h2>
          <p className="text-gray-600">
            Account-related data is stored while your account remains active. Generated thumbnails may be deleted at
            your request inside the dashboard. Payment records are retained to comply with accounting laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">6. Your Rights</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>Request access, correction, or deletion of personal data.</li>
            <li>Export thumbnail metadata stored in Supabase.</li>
            <li>Opt out of marketing emails (if enabled in the future).</li>
            <li>Deactivate your account at any time.</li>
          </ul>
          <p className="text-gray-600">
            To exercise any right, email{' '}
            <Link href="mailto:privacy@yourthumbnail.com" className="text-primary-600 hover:text-primary-700">
              privacy@yourthumbnail.com
            </Link>
            . We respond within 30 days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">7. Children’s Privacy</h2>
          <p className="text-gray-600">
            The service is intended for users 13 years and older. If you believe a child provided personal data, contact
            us to remove it promptly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">8. Changes to this Policy</h2>
          <p className="text-gray-600">
            We may update this policy to reflect changes in law or our practices. We will post updates on this page and
            adjust the “Last Updated” date above. Continued use after updates indicates acceptance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">9. Contact</h2>
          <p className="text-gray-600">
            Questions? Reach us at{' '}
            <Link href="mailto:privacy@yourthumbnail.com" className="text-primary-600 hover:text-primary-700">
              privacy@yourthumbnail.com
            </Link>{' '}
            or by mail: YourThumbnailAI, 123 AI Drive, Bengaluru, KA, India.
          </p>
        </section>
      </div>
    </div>
  )
}



