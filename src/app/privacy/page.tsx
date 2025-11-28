'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Lock, FileText, CheckCircle2 } from 'lucide-react'
import Script from 'next/script'
import { structuredData } from '@/lib/seo'

export default function PrivacyPolicyPage() {
  const breadcrumbData = structuredData.breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy' }
  ])

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 shadow-xl">
            <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Last Updated: November 11, 2025 | Effective Date: January 1, 2025
          </p>
        </div>

        {/* Content Card */}
        <div className="card p-6 sm:p-10 space-y-8 sm:space-y-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">1. Introduction & Commitment</h2>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed pl-9 space-y-3">
              <p>
                Welcome to YourThumbnailAI. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered thumbnail generation platform and related services (collectively, the "Service").
              </p>
              <p>
                By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            </div>
            <div className="pl-9 space-y-4">
              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Account Information:</strong> When you create an account, we collect:
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
                  <li>Full name and email address</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                  <li>Profile photo (if provided)</li>
                  <li>Authentication tokens and session data</li>
                </ul>
              </div>

              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Payment Information:</strong> For purchases and subscriptions:
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
                  <li>Billing name and address</li>
                  <li>Transaction details and order history</li>
                  <li>Payment method information (processed securely by Razorpay and Cashfree - we never store complete card details)</li>
                </ul>
              </div>

              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Usage Data:</strong> We automatically collect:
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
                  <li>Generated thumbnails and images</li>
                  <li>Prompts and input text you provide</li>
                  <li>Reference images you upload</li>
                  <li>Credits purchased and used</li>
                  <li>Feature preferences and settings</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage patterns and analytics data</li>
                </ul>
              </div>

              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Communications:</strong> When you contact us:
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
                  <li>Support messages and inquiries</li>
                  <li>Feedback and survey responses</li>
                  <li>Email correspondence</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            </div>
            <div className="pl-9 space-y-2">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our AI thumbnail generation Service</li>
                <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and maintain security</li>
                <li><strong>Payment Processing:</strong> To process transactions, manage subscriptions, and maintain billing records</li>
                <li><strong>AI Model Training:</strong> To improve our AI models and algorithms (using anonymized and aggregated data)</li>
                <li><strong>Personalization:</strong> To customize your experience and remember your preferences</li>
                <li><strong>Communications:</strong> To send transactional emails (receipts, account notifications, password resets)</li>
                <li><strong>Customer Support:</strong> To respond to your inquiries and provide technical assistance</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve Service performance</li>
                <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">4. Information Sharing & Disclosure</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-semibold">
                We never sell your personal data. We only share information with trusted third parties as described below:
              </p>
              
              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Service Providers:</strong>
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
                  <li><strong>Supabase:</strong> For authentication, database, and cloud storage</li>
                  <li><strong>Razorpay & Cashfree:</strong> For payment processing and subscription management</li>
                  <li><strong>Google (Gemini AI):</strong> For AI model inference and image generation</li>
                  <li><strong>Cloud Infrastructure Providers:</strong> For hosting and Content Delivery Networks (CDN)</li>
                </ul>
              </div>

              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Legal Requirements:</strong> We may disclose information if required by:
                </p>
                <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-1">
                  <li>Court orders or legal processes</li>
                  <li>Law enforcement agencies</li>
                  <li>Protection of our legal rights</li>
                  <li>Prevention of fraud or security threats</li>
                </ul>
              </div>

              <div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">5. Data Security</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Encryption of data in transit (SSL/TLS) and at rest</li>
                <li>Secure authentication using Supabase Auth with JWT tokens</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and employee training on data protection</li>
                <li>Secure payment processing through PCI-DSS compliant providers</li>
                <li>Regular backups and disaster recovery procedures</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">6. Data Retention</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after account deletion</li>
                <li><strong>Generated Content:</strong> Stored until you delete it or close your account</li>
                <li><strong>Payment Records:</strong> Retained for 7 years to comply with tax and accounting regulations</li>
                <li><strong>Usage Analytics:</strong> Aggregated data may be retained indefinitely for improvement purposes</li>
                <li><strong>Legal Obligations:</strong> Some data may be retained longer if required by law</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">7. Your Privacy Rights</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Data Portability:</strong> Export your generated content and account data</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications (if any)</li>
                <li><strong>Restrict Processing:</strong> Limit how we use your information</li>
                <li><strong>Withdraw Consent:</strong> Revoke consent for data processing activities</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                To exercise any of these rights, please contact us at{' '}
                <Link href="mailto:minhajraza@yourthumbnail.com" className="text-green-600 hover:text-green-700 font-semibold">
                  minhajraza@yourthumbnail.com
                </Link>. We will respond within 30 days.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">8. Cookies & Tracking Technologies</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
                <li><strong>Performance Cookies:</strong> Help us understand how you use the Service</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                You can control cookies through your browser settings. However, disabling cookies may affect Service functionality.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">9. Children's Privacy</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are between 13-17, you may only use the Service with parental or guardian consent.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                If we discover that we have collected information from a child under 13 without parental consent, we will take steps to delete that information promptly.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">10. International Data Transfers</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from your country's laws.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy, regardless of where it is processed.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">11. Changes to This Privacy Policy</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. When we make material changes, we will notify you by:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Posting a prominent notice on our website</li>
                <li>Sending an email to your registered email address</li>
                <li>Displaying an in-app notification</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                Your continued use of the Service after the effective date of the revised Privacy Policy constitutes your acceptance of the changes.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">12. Contact Us</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                <p className="text-sm sm:text-base text-gray-900 font-semibold mb-2">YourThumbnailAI - Data Protection Team</p>
                <p className="text-sm sm:text-base text-gray-700">
                  Email:{' '}
                  <Link href="mailto:minhajraza@yourthumbnail.com" className="text-green-600 hover:text-green-700 font-semibold">
                    minhajraza@yourthumbnail.com
                  </Link>
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  Support:{' '}
                  <Link href="mailto:minhajraza@yourthumbnail.com" className="text-green-600 hover:text-green-700 font-semibold">
                    minhajraza@yourthumbnail.com
                  </Link>
                </p>
                <p className="text-sm sm:text-base text-gray-700 mt-2">
                  Address: YourThumbnailAI, Bengaluru, Karnataka, India
                </p>
              </div>
            </div>
          </section>

          {/* Back to Home Button */}
          <div className="pt-8 text-center">
            <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
