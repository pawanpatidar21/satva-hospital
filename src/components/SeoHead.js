/**
 * SEO Head — JSON-LD structured data + full meta tags
 * Schemas: Hospital, Physician ×2, FAQPage, BreadcrumbList, WebSite
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://sattva-hospital-nmh.vercel.app';

const META = {
  title: 'सत्त्व हॉस्पिटल नीमच | Skin, Diabetes, Thyroid & Endocrinology Specialist | Dr. Diksha Patidar | Dr. Chetan Patidar',
  description:
    'सत्त्व हॉस्पिटल नीमच — डायबिटीज़, थायराइड, स्किन, हार्मोन रोग विशेषज्ञ। Dr. Diksha Patidar (AIIMS Delhi, Endocrinologist) & Dr. Chetan Patidar (Dermatologist, Safdarjung Delhi). Call: 9131960802. पुराना देवधर डायग्नोस्टिक, गुप्ता पुलिया, नीमच म.प्र.',
  keywords:
    'Sattva Hospital Neemuch, सत्त्व हॉस्पिटल नीमच, skin doctor Neemuch, dermatologist Neemuch, diabetes specialist Neemuch, डायबिटीज़ विशेषज्ञ नीमच, thyroid doctor Neemuch, थायराइड विशेषज्ञ नीमच, endocrinologist Neemuch, हार्मोन रोग विशेषज्ञ, Dr Diksha Patidar, Dr Chetan Patidar, PCOD treatment Neemuch, hair fall PRP Neemuch, laser treatment Neemuch, नीमच हॉस्पिटल, Neemuch doctor',
};

export default function SeoHead({ clinic, page = 'home' }) {
  const phone1 = clinic?.contact?.phone1 || '9131960802';
  const phone2 = clinic?.contact?.phone2 || '9340633407';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── Hospital ────────────────────────────────────────────────
      {
        '@type': 'Hospital',
        '@id': `${SITE_URL}/#hospital`,
        name: 'सत्त्व हॉस्पिटल',
        alternateName: ['Sattva Hospital', 'Sattva Hospital Neemuch', 'सत्त्व', 'Sattva Clinic Neemuch'],
        description:
          'स्किन, डायबिटीज़, थायराइड एवं हार्मोन रोग विशेषज्ञ अस्पताल, नीमच म.प्र। Expert Skin, Diabetes, Thyroid & Endocrinology care in Neemuch, Madhya Pradesh.',
        url: SITE_URL,
        telephone: [`+91${phone1}`, `+91${phone2}`],
        priceRange: '₹₹',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'पुराना देवधर डायग्नोस्टिक सेंटर, गुप्ता पुलिया के पास',
          addressLocality: 'Neemuch',
          addressRegion: 'Madhya Pradesh',
          postalCode: '458441',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 24.4757,
          longitude: 74.8699,
        },
        hasMap: 'https://maps.google.com/?q=Neemuch+Madhya+Pradesh',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '20:00',
          },
        ],
        medicalSpecialty: ['Dermatology', 'Endocrinology', 'Diabetology', 'GeneralPractice'],
        availableService: [
          { '@type': 'MedicalTherapy', name: 'Diabetes Treatment Neemuch' },
          { '@type': 'MedicalTherapy', name: 'Thyroid Treatment Neemuch' },
          { '@type': 'MedicalTherapy', name: 'Skin Disease Treatment Neemuch' },
          { '@type': 'MedicalTherapy', name: 'PCOD / PCOS Treatment' },
          { '@type': 'MedicalTherapy', name: 'PRP / GFC Hair Treatment' },
          { '@type': 'MedicalTherapy', name: 'Laser Hair Removal' },
          { '@type': 'MedicalTherapy', name: 'Laser Acne Scar & Pigmentation Treatment' },
          { '@type': 'MedicalTherapy', name: 'Chemical Peel Glow Treatment' },
          { '@type': 'MedicalTherapy', name: 'Hormone Disorder Treatment' },
          { '@type': 'MedicalTherapy', name: 'Obesity Treatment' },
          { '@type': 'MedicalTherapy', name: 'Hair Transplant' },
          { '@type': 'MedicalTherapy', name: 'Hydrafacial & Carbon Peel' },
        ],
        employee: [
          {
            '@type': 'Physician',
            '@id': `${SITE_URL}/#dr-diksha`,
            name: 'Dr. Diksha Patidar',
            alternateName: 'डॉ. दीक्षा पाटीदार',
            jobTitle: 'Endocrinologist & Hormone Specialist',
            description:
              'M.D. Medicine, AIIMS New Delhi. D.R.N.B. Endocrinology, Safdarjung Hospital Delhi. Reg. No. MP-46249. Specialist in Diabetes, Thyroid, PCOD, Obesity & Hormone Disorders.',
            medicalSpecialty: 'Endocrinology',
            telephone: `+91${phone1}`,
            image: `${SITE_URL}/doctors/dr-diksha.png`,
            worksFor: { '@id': `${SITE_URL}/#hospital` },
          },
          {
            '@type': 'Physician',
            '@id': `${SITE_URL}/#dr-chetan`,
            name: 'Dr. Chetan Kumar Patidar',
            alternateName: 'डॉ. चेतन कुमार पाटीदार',
            jobTitle: 'Dermatologist & Skin Specialist',
            description:
              'M.D. Dermatology, Venereology & Leprosy, Safdarjung Hospital Delhi. Ex. Consultant ESIC Medical College. Reg. No. MP-23109. Expert in Skin Diseases, PRP, Laser treatments.',
            medicalSpecialty: 'Dermatology',
            telephone: `+91${phone2}`,
            image: `${SITE_URL}/doctors/dr-chetan.png`,
            worksFor: { '@id': `${SITE_URL}/#hospital` },
          },
        ],
      },
      // ── WebSite ──────────────────────────────────────────────────
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Sattva Hospital Neemuch',
        description: 'Official website — Skin, Diabetes, Thyroid & Endocrinology specialists in Neemuch, MP',
        inLanguage: ['hi-IN', 'en-IN'],
      },
      // ── FAQPage ──────────────────────────────────────────────────
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'नीमच में डायबिटीज़ का इलाज कहाँ होता है?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'सत्त्व हॉस्पिटल, नीमच में डायबिटीज़ का विशेषज्ञ इलाज Dr. Diksha Patidar (AIIMS Delhi) द्वारा किया जाता है। गुप्ता पुलिया के पास, नीमच। Call: 9131960802',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is the best skin doctor in Neemuch?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Dr. Chetan Kumar Patidar at Sattva Hospital, Neemuch is an expert Dermatologist (M.D. Safdarjung Hospital, Delhi). Specialises in Skin diseases, PRP, Laser treatments. Call: 9340633407',
            },
          },
          {
            '@type': 'Question',
            name: 'नीमच में थायराइड का इलाज कहाँ होता है?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'सत्त्व हॉस्पिटल नीमच में थायराइड एवं हार्मोन रोगों का विशेषज्ञ उपचार Dr. Diksha Patidar (AIIMS Delhi, Endocrinologist) द्वारा उपलब्ध है। Call: 9131960802',
            },
          },
          {
            '@type': 'Question',
            name: 'Sattva Hospital Neemuch address and phone number?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sattva Hospital: पुराना देवधर डायग्नोस्टिक सेंटर, गुप्ता पुलिया के पास, नीमच, मध्यप्रदेश 458441. Phone: 9131960802, 9340633407',
            },
          },
          {
            '@type': 'Question',
            name: 'नीमच में PCOD / PCOS का इलाज?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'सत्त्व हॉस्पिटल नीमच में PCOD, अनियमित माहवारी एवं हार्मोन संबंधित समस्याओं का विशेषज्ञ इलाज उपलब्ध है। Call: 9131960802',
            },
          },
          {
            '@type': 'Question',
            name: 'What are Sattva Hospital OPD timings?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sattva Hospital is open Monday to Saturday, 9:00 AM – 8:00 PM. Sunday: closed. Call 9131960802 to book an appointment.',
            },
          },
          {
            '@type': 'Question',
            name: 'नीमच में बालों के झड़ने का इलाज कहाँ होता है?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'सत्त्व हॉस्पिटल नीमच में PRP, GFC एवं Hair Transplant द्वारा बालों के झड़ने का उपचार Dr. Chetan Patidar द्वारा किया जाता है। Call: 9340633407',
            },
          },
        ],
      },
      // ── BreadcrumbList ───────────────────────────────────────────
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        ],
      },
    ],
  };

  return (
    <Helmet>
      {/* Primary */}
      <html lang="hi-IN" />
      <title>{META.title}</title>
      <meta name="description" content={META.description} />
      <meta name="keywords" content={META.keywords} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <link rel="canonical" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:title" content={META.title} />
      <meta property="og:description" content={META.description} />
      <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Sattva Hospital Neemuch - Skin Diabetes Thyroid Endocrinology" />
      <meta property="og:site_name" content="Sattva Hospital Neemuch" />
      <meta property="og:locale" content="hi_IN" />
      <meta property="og:locale:alternate" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={META.title} />
      <meta name="twitter:description" content={META.description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
