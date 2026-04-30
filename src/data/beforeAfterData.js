/**
 * Before/After and result photos for Endocrinologist and Dermatologist.
 * Use a single merged image per before/after (e.g. endo-1.jpg = before+after in one image).
 * Add images under public/before-after/
 */
const PUBLIC = process.env.PUBLIC_URL || '';

const ph = (text, bg = 'e8eaf6', fg = '3949ab') =>
  `https://placehold.co/420x320/${bg}/${fg}?text=${encodeURIComponent(text)}`;

export const endocrinologistGallery = [
  {
    type: 'single',
    image: `${PUBLIC}/before-after/endo-1.jpg`,
    title: 'Diabetes & Thyroid Care',
    subtitle: 'Before & after',
    placeholderImage: ph('Before & After', 'e8eaf6', '3949ab'),
  },
  {
    type: 'single',
    image: `${PUBLIC}/before-after/endo-2.jpg`,
    title: 'Hormone & Weight Management',
    subtitle: 'Before & after care',
    placeholderImage: ph('Before & After', 'e8eaf6', '3949ab'),
  },
  {
    type: 'single',
    image: `${PUBLIC}/before-after/endo-3.jpg`,
    title: 'Patient Care',
    subtitle: 'Ongoing treatment',
    placeholderImage: ph('Result', 'fce4ec', 'c2185b'),
  },
];

export const dermatologistGallery = [
  {
    type: 'single',
    image: `${PUBLIC}/before-after/derm-1.jpg`,
    title: 'Skin Treatment Results',
    subtitle: 'Before & after',
    placeholderImage: ph('Before & After', 'e8f5e9', '2e7d32'),
  },
  {
    type: 'single',
    image: `${PUBLIC}/before-after/derm-2.jpg`,
    title: 'Acne & Pigmentation',
    subtitle: 'Before & after care',
    placeholderImage: ph('Before & After', 'e8f5e9', '2e7d32'),
  },
  {
    type: 'single',
    image: `${PUBLIC}/before-after/derm-3.jpg`,
    title: 'Cosmetic & Skin Care',
    subtitle: 'Treatment outcome',
    placeholderImage: ph('Result', 'fce4ec', 'c2185b'),
  },
];

/** General treatment photos for full-width auto-scroll carousel */
export const generalTreatmentPhotos = [
  { image: `${PUBLIC}/before-after/general-1.jpg`, caption: 'Expert Care at Sattva Clinic', placeholder: ph('Treatment 1', '1e3a5f', 'fff') },
  { image: `${PUBLIC}/before-after/general-2.jpg`, caption: 'Diabetes & Thyroid Management', placeholder: ph('Treatment 2', '2e7d32', 'fff') },
  { image: `${PUBLIC}/before-after/general-3.jpg`, caption: 'Skin & Dermatology Care', placeholder: ph('Treatment 3', '7b1fa2', 'fff') },
  { image: `${PUBLIC}/before-after/general-4.jpg`, caption: 'Patient-Focused Outcomes', placeholder: ph('Treatment 4', '1565c0', 'fff') },
  { image: `${PUBLIC}/before-after/general-5.jpg`, caption: 'Quality Treatment Results', placeholder: ph('Treatment 5', 'c62828', 'fff') },
];
