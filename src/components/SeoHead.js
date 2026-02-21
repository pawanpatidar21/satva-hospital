/**
 * SEO Head component - JSON-LD structured data + optional meta overrides
 * Injects MedicalClinic schema for rich results in search
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://Sattva-hospital-nmh.vercel.app';

const defaultClinic = {
  name: 'Sattva Clinic',
  fullName: 'स्किन, डायबिटीज़ थायराइड & एंडोक्राइनोलोजी क्लिनीक, नीमच',
  location: 'Neemuch, Madhya Pradesh, India',
  phone1: '9131960802',
  phone2: '9340633407',
  specializations: ['Skin', 'Diabetes', 'Thyroid', 'Endocrinology'],
  description: 'Sattva Clinic offers expert medical care in Skin, Diabetes, Thyroid & Endocrinology. Book appointments with specialist doctors in Neemuch.',
};

export default function SeoHead({ clinic }) {
  const c = clinic ?? defaultClinic;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: c.name || defaultClinic.name,
    alternateName: c.fullName || defaultClinic.fullName,
    description: defaultClinic.description,
    url: SITE_URL,
    telephone: [`+91${c.contact?.phone1 || defaultClinic.phone1}`, `+91${c.contact?.phone2 || defaultClinic.phone2}`],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Neemuch',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 24.45,
      longitude: 74.87,
    },
    medicalSpecialty: c.specializations || defaultClinic.specializations,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <link rel="canonical" href={SITE_URL} />
      <meta property="og:url" content={SITE_URL} />
    </Helmet>
  );
}
