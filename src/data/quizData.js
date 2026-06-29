// ─── HEIGHT OPTIONS ────────────────────────────────────────────────────────
const heights = []
const feetIn = [
  ["4'10\"", 58], ["4'11\"", 59],
  ["5'0\"", 60],  ["5'1\"", 61],  ["5'2\"", 62],  ["5'3\"", 63],
  ["5'4\"", 64],  ["5'5\"", 65],  ["5'6\"", 66],  ["5'7\"", 67],
  ["5'8\"", 68],  ["5'9\"", 69],  ["5'10\"", 70], ["5'11\"", 71],
  ["6'0\"", 72],  ["6'1\"", 73],  ["6'2\"", 74],
]
feetIn.forEach(([label]) => heights.push(label))

// ─── WAIST OPTIONS (24"–52") ───────────────────────────────────────────────
const waists = []
for (let i = 24; i <= 52; i++) waists.push(`${i}"`)

// ─── HIP OPTIONS (32"–60") ────────────────────────────────────────────────
const hips = []
for (let i = 32; i <= 60; i++) hips.push(`${i}"`)

// ─── DENIM BRANDS ─────────────────────────────────────────────────────────
export const BRANDS = [
  'Levi\'s', 'Zara', 'H&M', 'Gap', 'ASOS', 'Wrangler', 'Lee',
  'Mango', 'Topshop', 'Uniqlo', 'Diesel', 'G-Star Raw', 'Pepe Jeans',
  'Calvin Klein', 'Tommy Hilfiger', 'Guess', 'Massimo Dutti', 'Pull&Bear',
  'Bershka', 'American Eagle',
]

// ─── COMMON JEANS SIZES ───────────────────────────────────────────────────
export const SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '36', '38', '40',
]

// ─── QUIZ QUESTIONS ───────────────────────────────────────────────────────
// type: 'dropdown' | 'number' | 'single' | 'multiselect' | 'brandsize' | 'single-frustration'
export const QUESTIONS = [
  {
    id: 'height',
    number: 1,
    type: 'dropdown',
    question: 'What is your height?',
    why: 'Helps us get your inseam and length just right.',
    options: heights,
    optional: false,
  },
  {
    id: 'weight',
    number: 2,
    type: 'number',
    question: 'What is your weight?',
    why: 'Optional — helps us calibrate proportional fit. You can skip this.',
    placeholder: 'e.g. 65 kg or 145 lbs',
    optional: true,
  },
  {
    id: 'waist',
    number: 3,
    type: 'dropdown',
    question: 'What is your waist measurement?',
    why: 'Measured at your narrowest point, in inches.',
    options: waists,
    optional: false,
  },
  {
    id: 'hips',
    number: 4,
    type: 'dropdown',
    question: 'What is your hip measurement?',
    why: 'Measured at the fullest point. Most fit problems are hip-related.',
    options: hips,
    optional: false,
  },
  {
    id: 'waistFit',
    number: 5,
    type: 'single',
    question: 'How do you like jeans to fit at the waist?',
    why: 'Same size, different feel — we want yours to feel perfect.',
    options: [
      { value: 'snug',            label: 'Snug',             desc: 'No gaps, held firmly in place.' },
      { value: 'slightly-relaxed',label: 'Slightly Relaxed', desc: 'A little breathing room.' },
      { value: 'relaxed',         label: 'Relaxed',          desc: 'Easy and comfortable all day.' },
    ],
    optional: false,
  },
  {
    id: 'rise',
    number: 6,
    type: 'single',
    question: 'Where should the waistband sit?',
    why: 'This narrows your style recommendation significantly.',
    options: [
      { value: 'high',  label: 'High Rise',  desc: 'Above the navel. Flattering and on-trend.' },
      { value: 'mid',   label: 'Mid Rise',   desc: 'At the natural waist. The classic.' },
      { value: 'low',   label: 'Low Rise',   desc: 'Below the navel. Relaxed and casual.' },
    ],
    optional: false,
  },
  {
    id: 'thighFit',
    number: 7,
    type: 'single',
    question: 'How should jeans fit through the thighs?',
    why: 'The second most common fit complaint after the waist.',
    options: [
      { value: 'fitted',  label: 'Fitted',  desc: 'Close to the leg. Sleek silhouette.' },
      { value: 'relaxed', label: 'Relaxed', desc: 'Some room to move. Comfortable.' },
      { value: 'loose',   label: 'Loose',   desc: 'Roomy and relaxed. Maximum ease.' },
    ],
    optional: false,
  },
  {
    id: 'brands',
    number: 8,
    type: 'multiselect',
    question: 'Which denim brands have you bought before?',
    why: 'We\'ll use this to calibrate against known sizing.',
    options: BRANDS,
    optional: false,
  },
  {
    id: 'brandSizes',
    number: 9,
    type: 'brandsize',
    question: 'What size did you buy in those brands?',
    why: 'This is our most accurate data point for your recommendation.',
    optional: false,
  },
  {
    id: 'frustration',
    number: 10,
    type: 'single',
    question: 'Biggest fit frustration when buying jeans?',
    why: 'We\'ll personalize your recommendation explanation around this.',
    options: [
      { value: 'waist-gap',    label: 'Waist Gap',     desc: 'Gap at the back when jeans fit my hips.' },
      { value: 'hip-tight',    label: 'Hip Tightness', desc: 'Too tight around the hips.' },
      { value: 'wrong-length', label: 'Wrong Length',  desc: 'Always too long or too short.' },
      { value: 'thigh-fit',    label: 'Thigh Fit',     desc: 'Too tight or too baggy in the thighs.' },
      { value: 'rise',         label: 'Rise Issues',   desc: 'Rise never sits where I want it.' },
      { value: 'other',        label: 'Other',         desc: 'Something else entirely.' },
    ],
    optional: false,
  },
]

// ─── VOICE SCRIPT ─────────────────────────────────────────────────────────
// Natural spoken versions of each question for the AI voice flow
export const VOICE_QUESTIONS = [
  "What's your height? You can say something like five foot six, or a hundred and sixty eight centimetres.",
  "What's your weight? This is optional — totally fine to skip, just say skip if you'd prefer.",
  "What's your waist measurement in inches, at your narrowest point?",
  "And your hip measurement in inches, at the fullest part?",
  "How do you like jeans to fit at the waist — snug, slightly relaxed, or relaxed?",
  "Where do you like the waistband to sit — high rise, mid rise, or low rise?",
  "How should the jeans fit through the thighs — fitted, relaxed, or loose?",
  "Which denim brands have you bought before? You can name as many as you like — for example, Levis, Zara, Gap.",
  null, // brandSizes — handled dynamically after Q8
  "Last one — what's your biggest frustration when buying jeans? Options are: waist gap, hip tightness, wrong length, thigh fit, rise issues, or other.",
]
