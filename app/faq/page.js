'use client';

import { useState } from 'react';
import useStore from '@/app/store/useStore';

export default function FAQPage() {
  const { selectedMode } = useStore();

  const gradientClass =
    selectedMode === 'dark'
      ? 'bg-gradient-to-r from-gray-800 to-black'
      : 'bg-gradient-to-r from-white to-gray-200';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-black';
  const questionBg =
    selectedMode === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const answerBg = selectedMode === 'dark' ? 'bg-gray-800' : 'bg-white';

  // State for toggling the visibility of the answers
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleAnswer = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className={`py-16 ${gradientClass} ${textColor}`}>
        <br />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <h1 className="text-3xl font-semibold mb-8">Frequently Asked Questions</h1>

        {/* FAQ List */}
        <div className="space-y-6">
          {[
            {
              question: 'How Old Do You Have to Be to Tan?',
              answer:
                'UK law states that persons under the age of 18 are prohibited from using UV tanning equipment or entering any rooms containing UV tanning equipment. If you are lucky enough to look under 21, we will ask you for proof of age in store before we allow you to use UV tanning equipment. This would need to be photo ID in the form of a passport, driving license or PASS card and include a date of birth.',
            },
            {
              question: 'Why use a Lotion / Accelerator?',
              answer:
                'Moisture is key to tanning and a UV lotion is designed to replace moisture lost during the tanning session. Many lotions contain Tyrosine, an ingredient that stimulates the tanning process. Some lotions contain cosmetic bronzers or DHA (the main ingredient of fake tan). The new generation of lotions enhance the skin and push the tanning process beyond the natural plateau.',
            },
            {
              question: 'Preparing for UV Tanning',
              answer:
                'Dry skin reflects light and sheds more frequently, making the tan shallow and short-lived. Moisturizing is key to developing a deeper, darker tan. Exfoliate and moisturize a week before your first session, and make sure to use UV-specific lotions during and after your session.',
            },
            {
              question: 'How long are my minutes valid for?',
              answer:
                'Standard package deals are valid for 12 months from the date of purchase. Monthly Memberships are valid for one month, and weekly memberships for one week. Promotional packages may vary, and store staff can advise you upon purchase.',
            },
            {
              question: 'Can my child under 18 come in the tanning shop while I tan?',
              answer:
                'We allow children in our reception area if they are able to care for themselves. However, we do not accept responsibility for any children left in the reception area. Under no circumstances can children under 18 enter individual tanning cubicles.',
            },
            {
              question: 'What is 0.3?',
              answer:
                'The 0.3 process is a slower, gentler way to tan. The tanning result is deeper, darker, and lasts longer. 0.3 compliant lamps emit less UV per square meter than standard lamps, reducing the risk of over-exposure.',
            },
            {
              question: 'Can I tan whilst pregnant?',
              answer:
                'While there is no research to indicate UV light has a negative effect on an unborn baby, we prohibit the use of UV tanning equipment during pregnancy. We offer the option to place tanning packages "on hold" or transfer credits to family or friends during this time.',
            },
            {
              question: 'Are sunbeds good for vitamin D?',
              answer:
                'Yes! Research shows that responsible UV light exposure is an effective source of Vitamin D. Vitamin D is essential for maintaining various systems in the human body, preventing chronic illnesses, and promoting overall well-being.',
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-300 pb-4">
              <div
                className={`cursor-pointer ${questionBg} p-4 hover:bg-gray-500 transition`}
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="font-semibold">{faq.question}</h3>
              </div>
              {openFAQ === index && (
                <div className={`p-4 mt-2 ${answerBg}`}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
