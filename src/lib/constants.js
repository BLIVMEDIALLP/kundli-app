export const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

export const SIGN_LORDS = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export const NAKSHATRA_SPAN = 360 / 27;

export const DASHA_SEQUENCE = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

export const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export const PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

export const HOUSE_MEANINGS = {
  1: 'Self, personality, physical body, overall life direction',
  2: 'Wealth, family, speech, accumulated resources',
  3: 'Courage, siblings, communication, short journeys',
  4: 'Home, mother, emotional security, landed property',
  5: 'Intelligence, children, creativity, past-life merit',
  6: 'Enemies, debts, health challenges, service',
  7: 'Partnerships, marriage, business relationships',
  8: 'Transformation, longevity, hidden matters, inheritance',
  9: 'Dharma, father, higher education, fortune, spirituality',
  10: 'Career, authority, social status, public life',
  11: 'Gains, income, fulfillment of desires, elder siblings',
  12: 'Liberation, foreign lands, expenses, spiritual retreat',
};

export const SIGN_DESCRIPTIONS = {
  Aries:       { element: 'Fire',  quality: 'Cardinal', desc: 'Dynamic, pioneering, courageous. Natural leader with strong will.' },
  Taurus:      { element: 'Earth', quality: 'Fixed',    desc: 'Patient, reliable, sensual. Values stability and material comfort.' },
  Gemini:      { element: 'Air',   quality: 'Mutable',  desc: 'Curious, adaptable, communicative. Quick-witted with dual nature.' },
  Cancer:      { element: 'Water', quality: 'Cardinal', desc: 'Nurturing, intuitive, protective. Deeply connected to home and family.' },
  Leo:         { element: 'Fire',  quality: 'Fixed',    desc: 'Confident, generous, charismatic. Natural performer with regal bearing.' },
  Virgo:       { element: 'Earth', quality: 'Mutable',  desc: 'Analytical, precise, service-oriented. Excellent attention to detail.' },
  Libra:       { element: 'Air',   quality: 'Cardinal', desc: 'Balanced, diplomatic, artistic. Seeks harmony in all relationships.' },
  Scorpio:     { element: 'Water', quality: 'Fixed',    desc: 'Intense, transformative, perceptive. Deep emotional and psychic power.' },
  Sagittarius: { element: 'Fire',  quality: 'Mutable',  desc: 'Philosophical, adventurous, optimistic. Seeks truth and higher wisdom.' },
  Capricorn:   { element: 'Earth', quality: 'Cardinal', desc: 'Disciplined, ambitious, responsible. Builds lasting achievements.' },
  Aquarius:    { element: 'Air',   quality: 'Fixed',    desc: 'Innovative, humanitarian, independent. Ahead of their time.' },
  Pisces:      { element: 'Water', quality: 'Mutable',  desc: 'Compassionate, intuitive, spiritual. Deeply connected to the unseen.' },
};

export const NAKSHATRA_DESCRIPTIONS = {
  Ashwini:            'Healing energy, quick action, pioneering spirit. Governed by the Ashwini Kumars.',
  Bharani:            'Transformation, fertility, moral restraint. Governed by Yama, lord of dharma.',
  Krittika:           'Sharp intellect, purifying fire, determination. Governed by Agni.',
  Rohini:             'Creativity, beauty, material abundance. Highly favored by Brahma.',
  Mrigashirsha:       'Searching, curiosity, gentle nature. Symbol of seeking.',
  Ardra:              'Storm energy, destruction for renewal, raw power. Governed by Rudra.',
  Punarvasu:          'Return of light, purification, wisdom. Governed by Aditi.',
  Pushya:             'Nourishment, prosperity, spiritual growth. Most auspicious nakshatra.',
  Ashlesha:           'Mystical, serpentine wisdom, kundalini energy. Governed by serpent deities.',
  Magha:              'Royal ancestry, authority, deep respect for tradition.',
  'Purva Phalguni':   'Pleasure, creativity, relaxation, conjugal bliss.',
  'Uttara Phalguni':  'Service, prosperity, partnership, social connections.',
  Hasta:              'Skillful hands, craftsmanship, healing touch. Governed by Savitar.',
  Chitra:             'Brilliant, artistic, architectural ability. Star of opportunity.',
  Swati:              'Independent, restless, diplomatic. Like a tender shoot in the wind.',
  Vishakha:           'Focused ambition, patience, achieving goals. Star of purpose.',
  Anuradha:           'Friendship, devotion, organizational ability. Star of success.',
  Jyeshtha:           'Eldest, protective, mature responsibility. Chief among stars.',
  Mula:               'Deep transformation, research, uprooting. Governed by Nirriti.',
  'Purva Ashadha':    'Invincible, purifying, early victory.',
  'Uttara Ashadha':   'Final victory, universal principles, righteousness.',
  Shravana:           'Listening, learning, spreading knowledge. Star of hearing.',
  Dhanishtha:         'Wealth, musical talent, marching forward. Star of symphony.',
  Shatabhisha:        'Healing, secret knowledge, mysticism. The hundred healers.',
  'Purva Bhadrapada': 'Transformative fire, two-faced, passionate seeker.',
  'Uttara Bhadrapada':'Depth, wisdom, cosmic balance. The warrior star.',
  Revati:             'Nourishment, protection, final journey. Star of completion.',
};
