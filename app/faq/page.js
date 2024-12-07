'use client';

import { useState, useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const { selectedMode } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const questionBg = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const answerBg = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const borderColor = selectedMode === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleAnswer = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: 'How Old Do You Have to Be to Tan?',
      answer: 'UK law states that persons under the age of 18 are prohibited from using UV tanning equipment or entering any rooms containing UV tanning equipment. If you are lucky enough to look under 21, we will ask you for proof of age in store before we allow you to use UV tanning equipment. This would need to be photo ID in the form of a passport, driving license or PASS card and include a date of birth.',
    },
    {
      question: 'Why use a Lotion / Accelerator?',
      answer: 'Moisture is key to tanning and a UV lotion is designed to replace moisture lost during the tanning session. Many lotions contain Tyrosine, an ingredient that stimulates the tanning process. Some lotions contain cosmetic bronzers or DHA (the main ingredient of fake tan). The new generation of lotions enhance the skin and push the tanning process beyond the natural plateau.',
    },
    {
      question: 'Preparing for UV Tanning',
      answer: 'Dry skin reflects light and sheds more frequently, making the tan shallow and short-lived. Moisturizing is key to developing a deeper, darker tan. Exfoliate and moisturize a week before your first session, and make sure to use UV-specific lotions during and after your session.',
    },
    {
      question: 'How long are my minutes valid for?',
      answer: 'Standard package deals are valid for 12 months from the date of purchase. Monthly Memberships are valid for one month, and weekly memberships for one week. Promotional packages may vary, and store staff can advise you upon purchase.',
    },
    {
      question: 'Can my child under 18 come in the tanning shop while I tan?',
      answer: 'We allow children in our reception area if they are able to care for themselves. However, we do not accept responsibility for any children left in the reception area. Under no circumstances can children under 18 enter individual tanning cubicles.',
    },
    {
      question: 'What is 0.3?',
      answer: 'The 0.3 process is a slower, gentler way to tan. The tanning result is deeper, darker, and lasts longer. 0.3 compliant lamps emit less UV per square meter than standard lamps, reducing the risk of over-exposure.',
    },
    {
      question: 'Can I tan whilst pregnant?',
      answer: 'While there is no research to indicate UV light has a negative effect on an unborn baby, we prohibit the use of UV tanning equipment during pregnancy. We offer the option to place tanning packages "on hold" or transfer credits to family or friends during this time.',
    },
    {
      question: 'Are sunbeds good for vitamin D?',
      answer: 'Yes! Research shows that responsible UV light exposure is an effective source of Vitamin D. Vitamin D is essential for maintaining various systems in the human body, preventing chronic illnesses, and promoting overall well-being.',
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen py-16 ${bgColor} ${textColor}`}>
        <br />
        <br />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-lg mb-8 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`border ${borderColor} rounded-lg overflow-hidden`}
            >
              <button
                className={`w-full text-left p-4 focus:outline-none ${questionBg} hover:bg-opacity-80 transition-colors duration-200 flex justify-between items-center`}
                onClick={() => toggleAnswer(index)}
              >
                <span className="font-medium">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    openFAQ === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 ${answerBg}`}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

