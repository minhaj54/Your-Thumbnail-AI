'use client'

import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <header>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-600">
            Effective date: {new Date().getFullYear()} — last updated {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">1. Overview</h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms of Service (“Terms”) govern your access and use of YourThumbnailAI (“the Service”), operated
            by YourThumbnailAI Pvt. Ltd. (“we”, “us”, “our”). By creating an account, purchasing credits, or otherwise
            using the Service, you agree to these Terms. If you do not agree, do not use the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">2. Eligibility</h2>
          <p className="text-gray-600">
            You must be at least 13 years old to use the Service. If you are using the Service on behalf of an
            organization, you represent that you have authority to bind that organization to these Terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">3. Accounts</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>You are responsible for safeguarding your password and account credentials.</li>
            <li>You must provide accurate and up-to-date information when creating an account.</li>
            <li>Notify us immediately if you suspect unauthorized use of your account.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">4. Credits & Payments</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>All purchases are processed securely by Cashfree Payments.</li>
            <li>Credits are non-transferable and non-refundable unless required by law.</li>
            <li>We may change pricing with prior notice on the pricing page.</li>
            <li>Taxes or bank charges may apply depending on your jurisdiction.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">5. Acceptable Use</h2>
          <p className="text-gray-600">
            You agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-3">
            <li>Upload content that infringes intellectual property rights or privacy rights.</li>
            <li>Use the Service to generate or distribute illegal, hateful, or misleading content.</li>
            <li>Attempt to reverse engineer or exploit the platform or underlying AI models.</li>
            <li>Use automated scripts or bots to abuse credits or overwhelm the Service.</li>
          </ul>
          <p className="text-gray-600">
            We reserve the right to suspend or terminate accounts violating these terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">6. Intellectual Property</h2>
          <p className="text-gray-600">
            AI-generated thumbnails are owned by you, subject to the rights of any third-party assets you provide. You
            grant us a limited license to host and display generated content for the purpose of providing the Service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">7. Service Availability</h2>
          <p className="text-gray-600">
            We strive to maintain uptime but do not guarantee uninterrupted service. Planned maintenance or unexpected
            downtime may occur. If extended downtime affects purchased credits, contact support for assistance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">8. Limitation of Liability</h2>
          <p className="text-gray-600">
            To the maximum extent permitted by law, YourThumbnailAI is not liable for indirect, incidental, or
            consequential damages arising from use of the Service. Our total liability is limited to the amount you paid
            for credits in the 12 months preceding the claim.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">9. Cancellation & Termination</h2>
          <p className="text-gray-600">
            You may cancel your account at any time in the dashboard or by emailing{' '}
            <Link href="mailto:support@yourthumbnail.com" className="text-primary-600 hover:text-primary-700">
              support@yourthumbnail.com
            </Link>. Upon cancellation, remaining credits may be forfeited unless required by law to refund.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">10. Updates to These Terms</h2>
          <p className="text-gray-600">
            We may update these Terms periodically. We will notify users via email or dashboard announcements.
            Continued use after changes take effect constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">11. Contact Us</h2>
          <p className="text-gray-600">
            For questions about these Terms, contact{' '}
            <Link href="mailto:legal@yourthumbnail.com" className="text-primary-600 hover:text-primary-700">
              legal@yourthumbnail.com
            </Link>{' '}
            or mail us at YourThumbnailAI, 123 AI Drive, Bengaluru, KA, India.
          </p>
        </section>
      </div>
    </div>
  )
}


