'use client';

import { useState } from 'react';
import useStore from '@/app/store/useStore';

export default function PrivacyPolicyPage() {
  const { selectedMode } = useStore();

  const gradientClass =
    selectedMode === 'dark'
      ? 'bg-gradient-to-r from-gray-800 to-black'
      : 'bg-gradient-to-r from-white to-gray-200';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
  const sectionBg =
    selectedMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const answerBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';

  // State for toggling the visibility of sections
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className={`py-16 ${gradientClass} ${textColor}`}>
      <br />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h1 className="text-3xl font-semibold mb-8">Privacy Policy</h1>

        {/* Privacy Policy Sections */}
        <div className="space-y-6">
          {[
            {
              title: 'What is this Privacy Policy for?',
              content: (
                <div>
                  <p>
                    This privacy policy is for Bronze & Beauty Studio, this
                    website https://bronzebeautystudio.co.uk and governs the
                    privacy of its users who choose to use it.
                  </p>
                  <p>
                    The policy sets out the different areas where user privacy
                    is concerned and outlines the obligations & requirements of
                    the users, the company, website, and website owners.
                    Furthermore, the way this website processes, stores, and
                    protects user data and information will also be detailed
                    within this policy.
                  </p>
                </div>
              ),
            },
            {
              title: 'Use of Cookies',
              content: (
                <div>
                  <p>
                    This website uses cookies to better the users experience
                    while visiting the website. Where applicable, this website
                    uses a cookie control system allowing the user on their
                    first visit to the website to allow or disallow the use of
                    cookies on their computer/device.
                  </p>
                  <p>
                    Cookies are small files saved to the user’s computer’s hard
                    drive that track, save, and store information about the
                    user’s interactions and usage of the website. This allows
                    the website, through its server, to provide the users with a
                    tailored experience within this website.
                  </p>
                </div>
              ),
            },
            {
              title: 'Registration',
              content: (
                <div>
                  <p>
                    Users registering with our website and/or Bronze & Beauty
                    Studio do so at their own discretion and provide any such
                    personal details requested at their own risk.
                  </p>
                  <p>
                    Your personal information is kept private and stored
                    securely until a time it is no longer required or has no
                    use, as detailed in the Data Protection Act 1998 and GDPR
                    Legislation.
                  </p>
                </div>
              ),
            },
            {
              title: 'Contact & Communication',
              content: (
                <div>
                  <p>
                    Users contacting this website and/or its owners do so at
                    their own discretion and provide any such personal details
                    requested at their own risk.
                  </p>
                  <p>
                    This website and its owners use any information submitted
                    to provide you with further information about the products /
                    services they offer or to assist you in answering any
                    questions or queries you may have submitted.
                  </p>
                </div>
              ),
            },
            {
              title: 'GDPR Requirements',
              content: (
                <div>
                  <p>
                    Bronze & Beauty Studio is fully committed to your privacy,
                    which is why we make sure you’re always in control of what
                    we do with your personal information.
                  </p>
                  <p>
                    GDPR Legislation requires Bronze & Beauty Studio to ensure
                    the following rights for users:
                  </p>
                  <ul className="list-disc pl-6">
                    <li>Right to be informed</li>
                    <li>Right to access</li>
                    <li>Right to rectification</li>
                    <li>Right to erasure (right to be forgotten)</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object</li>
                    <li>Rights in relation to automated decision making and profiling</li>
                  </ul>
                </div>
              ),
            },
            {
              title: 'Age Restriction',
              content: (
                <div>
                  <p>
                    You must be over 18 to use a sunbed. Users under 18 years
                    will not be allowed to use sunbeds at Bronze & Beauty Studio.
                  </p>
                </div>
              ),
            },
          ].map((section, index) => (
            <div key={index} className="border-b border-gray-300 pb-4">
              <div
                className={`cursor-pointer ${sectionBg} p-4 hover:bg-gray-500 transition`}
                onClick={() => toggleSection(index)}
              >
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              {openSection === index && (
                <div className={`p-4 mt-2 ${answerBg}`}>{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
