'use client';

import { useState } from 'react';
import useStore from '@/app/store/useStore';

export default function TermsAndConditionsPage() {
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
        <h1 className="text-3xl font-semibold mb-8">Terms and Conditions</h1>

        {/* Terms and Conditions Sections */}
        <div className="space-y-6">
          {[
            {
              title: 'Introduction',
              content: (
                <div>
                  <p>
                    These Terms and Conditions govern the use of the services provided by Bronze & Beauty Studio, including the purchase and use of sunbeds, products, and related services.
                  </p>
                </div>
              ),
            },
            {
              title: 'Eligibility',
              content: (
                <div>
                  <p>To use the services, you must be over the age of 18. Persons under 18 are not permitted to use UV tanning services.</p>
                  <p>We enforce a Challenge 21 policy, requiring valid identification for customers who appear under the age of 21.</p>
                </div>
              ),
            },
            {
              title: 'Booking and Appointments',
              content: (
                <div>
                  <p>
                    Clients must arrive at least 5 minutes before their scheduled appointment. Late arrivals may result in rescheduling.
                  </p>
                  <p>Failure to arrive on time may result in losing the booking, and priority will be given to walk-ins.</p>
                </div>
              ),
            },
            {
              title: 'Health and Safety',
              content: (
                <div>
                  <p>
                    All customers must adhere to safety guidelines when using UV tanning equipment. A tanning consultation is available for new clients to assess skin type and provide responsible tanning recommendations.
                  </p>
                  <p>
                    Pregnant clients, or those with medical conditions, must seek professional advice before using tanning equipment.
                  </p>
                </div>
              ),
            },
            {
              title: 'Refund Policy',
              content: (
                <div>
                  <p>
                    Refunds for online purchases can be requested within 14 days of the purchase date. If some minutes have been used, a refund will only be issued for the remaining balance.
                  </p>
                  <p>Refund requests must be made via email to admin@bronzebeautystudio.co.uk.</p>
                </div>
              ),
            },
            {
              title: 'Customer Responsibilities',
              content: (
                <div>
                  <p>
                    Customers are responsible for all personal belongings. Bronze & Beauty Studio is not liable for any loss or damage to personal property while on the premises.
                  </p>
                  <p>
                    Clients must inform the studio immediately if any changes in their health affect their ability to use tanning services.
                  </p>
                </div>
              ),
            },
            {
              title: 'Changes to Terms',
              content: (
                <div>
                  <p>
                    Bronze & Beauty Studio reserves the right to update or modify these Terms and Conditions at any time. Clients will be notified of any significant changes.
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
