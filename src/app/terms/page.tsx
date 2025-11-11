'use client'

import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Shield, FileText, CheckCircle2 } from 'lucide-react'
import Script from 'next/script'
import { structuredData } from '@/lib/seo'

export default function TermsOfServicePage() {
  const breadcrumbData = structuredData.breadcrumb([
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms' }
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
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mb-6 shadow-xl">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Last Updated: November 11, 2025 | Effective Date: January 1, 2025
          </p>
        </div>

        {/* Content Card */}
        <div className="card p-6 sm:p-10 space-y-8 sm:space-y-12 animate-fade-in"  style={{ animationDelay: '0.2s' }}>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed pl-9">
              Welcome to YourThumbnailAI! These Terms of Service ("Terms") constitute a legally binding agreement between you and YourThumbnailAI ("we", "us", "our", "Company") regarding your access to and use of our AI-powered thumbnail generation platform and related services (collectively, the "Service"). By creating an account, making a purchase, or using any part of the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">2. Eligibility</h2>
            </div>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed pl-9 space-y-3">
              <p>
                You must be at least 18 years old to create an account and use the Service. If you are between 13-17 years old, you may use the Service only with parental or guardian consent and supervision. By using the Service, you represent and warrant that you meet these age requirements.
              </p>
              <p>
                If you are using the Service on behalf of a company, organization, or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, and the terms "you" and "your" shall refer to that entity.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">3. Account Registration & Security</h2>
            </div>
            <div className="pl-9">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                To access certain features of the Service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information to keep it accurate and current</li>
                <li>Safeguard your password and keep your login credentials confidential</li>
                <li>Immediately notify us of any unauthorized access or security breach</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Not share your account with others or allow others to access your account</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                We reserve the right to suspend or terminate accounts that violate these Terms or are inactive for extended periods.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">4. Credits, Pricing & Payment Terms</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Credits System:</strong> Our Service operates on a credit-based system. Each image generation consumes credits based on the features used. Credits are purchased through subscription plans or one-time packages.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Payment Processing:</strong> All payments are securely processed through Razorpay and Cashfree Payments, our authorized third-party payment processors. We do not store your complete payment card information on our servers.
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>All prices are listed in Indian Rupees (INR) unless otherwise specified</li>
                <li>Credits are non-transferable, non-refundable, and non-exchangeable for cash except where required by applicable law</li>
                <li>Unused credits do not expire unless your account is terminated</li>
                <li>We reserve the right to modify pricing with 30 days' advance notice posted on our website</li>
                <li>You are responsible for any applicable taxes, bank charges, or currency conversion fees</li>
                <li>All sales are final unless otherwise specified in our Refund Policy</li>
                <li>Promotional credits may have expiration dates and specific usage restrictions</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">5. Acceptable Use Policy</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Upload, generate, or distribute content that infringes on intellectual property rights, privacy rights, or publicity rights of any third party</li>
                <li>Create content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
                <li>Generate deepfakes, misleading content, or impersonations without proper authorization</li>
                <li>Use the Service to create content promoting violence, terrorism, discrimination, or hate speech</li>
                <li>Attempt to reverse engineer, decompile, or extract the source code of our AI models or platform</li>
                <li>Use automated scripts, bots, or scrapers to abuse the Service or manipulate credit usage</li>
                <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
                <li>Engage in any activity that could harm YourThumbnailAI's reputation or business</li>
                <li>Resell, redistribute, or commercialize the Service without explicit written permission</li>
                <li>Bypass any measures we may use to prevent or restrict access to the Service</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3 font-semibold">
                We reserve the right to immediately suspend or terminate accounts that violate this Acceptable Use Policy, with or without prior notice, and without refund of unused credits.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">6. Intellectual Property Rights</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Your Content:</strong> You retain all ownership rights to the AI-generated thumbnails and images you create using our Service, subject to the licenses granted in these Terms. However, you are responsible for ensuring that any input content (prompts, reference images, uploaded photos) does not infringe on third-party rights.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Our Platform:</strong> The Service, including its AI models, algorithms, software, design, trademarks, logos, and all intellectual property rights therein, are and will remain the exclusive property of YourThumbnailAI and its licensors. These Terms do not grant you any rights to use our trademarks or brand assets.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Limited License to Us:</strong> By using the Service, you grant us a worldwide, non-exclusive, royalty-free license to host, store, reproduce, and display your generated content solely for the purposes of:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Providing and improving the Service</li>
                <li>Training and enhancing our AI models (with anonymization)</li>
                <li>Marketing and promotional purposes (only with your explicit consent)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">7. Service Availability & Modifications</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We strive to provide reliable, uninterrupted access to the Service. However, we do not guarantee that the Service will be available 100% of the time. The Service may be subject to temporary interruptions due to:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Scheduled maintenance and updates</li>
                <li>Emergency repairs or security patches</li>
                <li>Third-party service provider outages</li>
                <li>Force majeure events beyond our reasonable control</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with or without notice. We will make reasonable efforts to notify you of significant changes. In case of extended service disruptions affecting your ability to use purchased credits, please contact our support team.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">8. Disclaimers & Limitation of Liability</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed uppercase font-semibold">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To the maximum extent permitted by applicable law, YourThumbnailAI disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>The Service will meet your specific requirements or expectations</li>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from the Service will be accurate or reliable</li>
                <li>AI-generated content will be free from errors or suitable for commercial use without review</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed uppercase font-semibold mt-3">
                LIMITATION OF LIABILITY:
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To the fullest extent permitted by law, YourThumbnailAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, or other intangible losses, resulting from your use or inability to use the Service. Our total aggregate liability is limited to the amount you paid for credits in the 12 months immediately preceding the claim, or ₹1,000, whichever is greater.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">9. Termination & Account Cancellation</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Your Right to Terminate:</strong> You may cancel your account at any time through your account dashboard or by contacting us at{' '}
                <Link href="mailto:support@yourthumbnailai.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  support@yourthumbnailai.com
                </Link>. Upon account cancellation, your access to the Service will be terminated, and any remaining credits will be forfeited unless otherwise required by applicable law.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Our Right to Terminate:</strong> We reserve the right to suspend or terminate your account, with or without notice, if you:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Violate these Terms or our Acceptable Use Policy</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Abuse the Service or harm other users</li>
                <li>Fail to pay for services rendered</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">10. Governing Law & Dispute Resolution</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in Bengaluru, Karnataka, India.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Before filing any formal legal action, you agree to first attempt to resolve the dispute informally by contacting our support team at{' '}
                <Link href="mailto:legal@yourthumbnailai.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                  legal@yourthumbnailai.com
                </Link>.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">11. Changes to These Terms</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. When we make material changes, we will notify you by:
              </p>
              <ul className="list-disc pl-5 text-sm sm:text-base text-gray-700 space-y-2">
                <li>Posting a notice on our website</li>
                <li>Sending an email to your registered email address</li>
                <li>Displaying an in-app notification</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must stop using the Service and may cancel your account.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">12. Miscellaneous</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and YourThumbnailAI regarding the Service.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>No Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary-600 flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">13. Contact Information</h2>
            </div>
            <div className="pl-9 space-y-3">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                If you have any questions, concerns, or feedback about these Terms of Service, please contact us:
              </p>
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-4 sm:p-6 border border-primary-200">
                <p className="text-sm sm:text-base text-gray-900 font-semibold mb-2">YourThumbnailAI</p>
                <p className="text-sm sm:text-base text-gray-700">
                  Email:{' '}
                  <Link href="mailto:legal@yourthumbnailai.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                    legal@yourthumbnailai.com
                  </Link>
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  Support:{' '}
                  <Link href="mailto:support@yourthumbnailai.com" className="text-primary-600 hover:text-primary-700 font-semibold">
                    support@yourthumbnailai.com
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


