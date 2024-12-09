"use client"
import { useState, useEffect } from 'react';
import useStore from '@/app/store/useStore';
import { motion } from 'framer-motion';

export default function TermsAndConditionsPage() {
  const { selectedMode } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const bgColor = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const textColor = selectedMode === 'dark' ? 'text-white' : 'text-gray-900';
  const sectionBg = selectedMode === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-gray-100';
  const borderColor = selectedMode === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const sections = [
    {
      title: 'Responsible Tanning',
      content: (
        <div>
          <p className="mb-4">
            We strictly adhere to the Sunbed Act (2010) and under 18’s are NOT permitted to purchase UV packages or minutes online and will NOT be permitted to use UV services in-store*. If you are lucky enough to look under 21, we will ask you for proof of age in store before we will allow you to use UV tanning equipment. Please don’t be offended if you are asked, this is for your safety. This would need to be photo ID in the form of a passport, driving license and include a date of birth.
          </p>
          <p className="mb-4">
            No person under 18 years of age are permitted to use the UV tanning equipment or enter tanning units or changing areas. There can only be one person in a tanning room when the equipment is active.
          </p>
          <p className="mb-4">
            At Bronze & Beauty Studio we take responsible tanning seriously. We provide a free tanning consultation service to all clients in store which reviews a client’s skin type and recommends responsible tanning options.
          </p>
          <p className="mb-4">
            You must leave a minimum of 24 hours between tanning session. You will be refused use of our UV tanning if there is less than 24 hours between sessions. The European Standard advises you do not exceed 60 sessions per year.
          </p>
          <p className="mb-4">
            You must use eye protection on every visit. We provide free disposable eye wear & reusable in every tanning room. Please use these to protect your eyes every time you tan.
          </p>
        </div>
      ),
    },
    {
      title: 'Who Can Use Sunbeds?',
      content: (
        <div>
          <p className="mb-4">
            If you are undergoing medical treatment or have photosensitive skin, you must consult a medical professional before using our equipment.
          </p>
          <p className="mb-4">
            If you are pregnant, we will not permit the use of our UV tanning equipment. We will not allow anyone within their first trimester to use our Spray Tanning booths under any circumstance, if you wish to use the booths in your second or third trimester, we will require you to sign a disclaimer form in store.
          </p>
          <p className="mb-4">
            If you have, or plan to have Botox or Dermal Fillers, we strongly advise speaking to a medical professional or your practitioner prior to using any UV tanning equipment.
          </p>
          <p className="mb-4">
            Sunbed tanning systems should be treated with the same caution as normal sunlight. A tan should be built gradually, particularly if you have sensitive skin.
          </p>
        </div>
      ),
    },
    {
      title: 'UV Tanning Restrictions',
      content: (
        <div>
          <p className="mb-4">
            You must not use our tanning equipment if you have already been sunbathing in natural sunlight or had another sunbed that day (or plan to).
          </p>
          <p className="mb-4">
            Never repeat tanning treatment if any signs of redness remain from previous sunbathing or tanning.
          </p>
          <p className="mb-4">
            If you have an excessive number of moles (over 50) or have anyone in your immediate family who has had skin cancer you should seek medical advice before using UV Tanning equipment.
          </p>
          <p className="mb-4">
            Do not use if you suffer from: ill effects from normal sunbathing, epilepsy, giddiness or fainting, headaches or migraine, heart condition, blood pressure, hypertension, prickly heat, cold sores, allergies, skin ulcers.
          </p>
        </div>
      ),
    },
    {
      title: 'Online Purchases',
      content: (
        <div>
          <p className="mb-4">
            The below terms and conditions in the section, are in relation to the purchase, attempted purchase and handling of minutes, packages and sessions. Terms used include ‘customer’ ‘customers’ (you, the user), ‘service provider’ (Bronze & Beauty Studio) and ‘services’ (packages, minutes and sessions).
          </p>
          <p className="mb-4">
            The customer (you, the user) will not attempt to purchase or utilise UV services if they are under the age of 18. Customers under the age of 18 are not permitted to purchase, attempt to purchase or attempt to utilise services relating to UV, the customer will also not be permitted to use any of the UV services within our salons.
          </p>
          <p className="mb-4">
            The customer (you, the user) must be over 18 to use a sunbed. Persons under 18 years will not be allowed to use sunbeds at The Tanning Shop. We enforce a Challenge 21 policy in our stores. If the customer (you, the user) is lucky enough to look under 21 they will be asked to prove they are over 18 before they can tan at The Tanning Shop.
          </p>
          <p className="mb-4">
            Accepted forms of ID must include a date of birth and are; Passport, Driving license.
          </p>
        </div>
      ),
    },
    {
      title: 'Refund Policy (Online Purchases)',
      content: (
        <div>
          <p className="mb-4">
            Customers will have 14 days cooling off period from the day of their online purchase to request a refund. If no minutes have been used then the refund will be in full, if some minutes have been used then refund will be for the remaining minutes. Please note, if all minutes have been used then no refund will be available within the cooling off period.
          </p>
          <p className="mb-4">
            Refund requests must be made within 14 days of purchasing the service online by writing to admin@bronzebeautystudio.co.uk.
          </p>
        </div>
      ),
    },
    {
      title: 'Memberships and Packages',
      content: (
        <div>
          <p className="mb-4">
            Memberships (Unlimited Weekly / Monthly Package) are only available to purchase from time to time in store and are valid for 7 or 28 days from the date of purchase.
          </p>
          <p className="mb-4">
            When using a membership, please be aware that customers must follow our responsible tanning guidelines and leave at least 24 hours between sessions.
          </p>
        </div>
      ),
    },
    {
      title: 'Refunds in store',
      content: (
        <div>
          <p className="mb-4">
            UV services: Refunds are only available for medical reasons upon receipt of a valid medical certificate.
          </p>
          <p className="mb-4">
            Lotions: Our lotion return policy allows you to return a lotion to the store in which it was purchased, within 14 days of purchase, if the product is faulty.
          </p>
        </div>
      ),
    },
    {
      title: 'Customer Property',
      content: (
        <div>
          <p className="mb-4">
            You must keep all property and belongings with you in the studio at all times. Bronze & Beauty Studio cannot accept any responsibility whatsoever for any loss or damage to clients’ property whilst on the premises.
          </p>
        </div>
      ),
    },
    {
      title: 'Changes to Customer Accounts',
      content: (
        <div>
          <p className="mb-4">
            Clients are required to inform Bronze & Beauty Studio immediately of any change in circumstances that affect their eligibility to use UV Tanning equipment.
          </p>
        </div>
      ),
    },
    {
      title: 'Complaints',
      content: (
        <div>
          <p className="mb-4">
            To make a complaint to Bronze & Beauty Studio, correspondence can be submitted in writing to complaints@bronzebeautystudio.co.uk. Please include any supporting evidence which you feel may support your complaint.
          </p>
        </div>
      ),
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
        <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`border ${borderColor} rounded-lg overflow-hidden`}
            >
              <div className={`p-6 ${sectionBg}`}>
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <div className="text-sm sm:text-base">{section.content}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
