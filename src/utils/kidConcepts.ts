import { KidConcept, MathChallenge } from '../types';

export const KID_CONCEPTS: Record<string, KidConcept> = {
  'pi': {
    id: 'pi',
    symbol: 'π',
    title: 'Pi (The Circle Wizard)',
    category: 'Constants',
    simpleExplanation: 'Pi (approx. 3.14159) is the magic ratio of every circle in the entire universe! If you walk around the rim of any circle, it is always a bit more than 3 times as long as walking straight across the middle.',
    realWorldExample: 'Measuring the crust around your pizza or the tire of a monster truck!',
    funFact: 'Pi has infinite decimals with no repeating pattern. Supercomputers have calculated over 100 trillion digits!',
    sampleExpression: '2 * π * 5',
    sampleAnswer: '31.4159',
    badgeColor: 'from-amber-400 to-orange-500'
  },
  'e': {
    id: 'e',
    symbol: 'e',
    title: "Euler's Number (Nature's Growth Secret)",
    category: 'Constants',
    simpleExplanation: "Euler's number (approx 2.71828) is the special constant that nature uses whenever things grow continuously, like bacteria multiplying, trees growing branches, or snowflakes forming!",
    realWorldExample: 'How a tiny single yeast cell multiplies into billions to make fluffy bread rise.',
    funFact: 'Named after Swiss mathematician Leonhard Euler, who was so brilliant he did complex calculations in his head while holding his children!',
    sampleExpression: 'e ^ 2',
    sampleAnswer: '7.389',
    badgeColor: 'from-emerald-400 to-teal-500'
  },
  'sqrt': {
    id: 'sqrt',
    symbol: '√',
    title: 'Square Root (The Mystery Side Detective)',
    category: 'Powers & Roots',
    simpleExplanation: 'Square root finds the secret number that was multiplied by itself! If a square floor has an area of 16 tiles, √16 tells you each side is 4 tiles long because 4 × 4 = 16.',
    realWorldExample: 'Finding the size of a square chessboard when you know the total square area.',
    funFact: 'Square root was used by ancient Egyptian architects over 4,000 years ago to build the Great Pyramids!',
    sampleExpression: '√(81)',
    sampleAnswer: '9',
    badgeColor: 'from-sky-400 to-blue-600'
  },
  'cbrt': {
    id: 'cbrt',
    symbol: '∛',
    title: 'Cube Root (The 3D Box Finder)',
    category: 'Powers & Roots',
    simpleExplanation: 'Cube root tells you the side length of a 3D cube! If a Minecraft block contains 27 small voxels, ∛27 tells you each edge is 3 blocks long because 3 × 3 × 3 = 27.',
    realWorldExample: 'Building a perfect giant Rubik’s cube or finding box dimensions.',
    funFact: 'While square root is 2D (flat surfaces), cube root is 3D (space and volume).',
    sampleExpression: '∛(125)',
    sampleAnswer: '5',
    badgeColor: 'from-indigo-400 to-purple-600'
  },
  'pow2': {
    id: 'pow2',
    symbol: 'x²',
    title: 'Square Power (2D Booster)',
    category: 'Powers & Roots',
    simpleExplanation: 'Multiplying a number by itself! 5² means 5 × 5 = 25. It is called "square" because it creates the area of a square.',
    realWorldExample: 'Calculating how many pixels fit in an Instagram square photo grid.',
    funFact: 'Every squared real number turns positive! Even (-3)² = +9 because negative times negative is positive.',
    sampleExpression: '12²',
    sampleAnswer: '144',
    badgeColor: 'from-pink-400 to-rose-600'
  },
  'pow3': {
    id: 'pow3',
    symbol: 'x³',
    title: 'Cube Power (3D Volume Builder)',
    category: 'Powers & Roots',
    simpleExplanation: 'Multiplying a number by itself THREE times! 4³ means 4 × 4 × 4 = 64. It is called "cube" because it measures 3D space.',
    realWorldExample: 'Calculating how much water fills a cube-shaped fish tank.',
    funFact: 'Just 10³ = 1,000, and 100³ is 1,000,000 (one million)! Powers grow super fast.',
    sampleExpression: '6³',
    sampleAnswer: '216',
    badgeColor: 'from-violet-400 to-purple-700'
  },
  'powY': {
    id: 'powY',
    symbol: 'xʸ',
    title: 'Any Power (The Rocket Multiplier)',
    category: 'Powers & Roots',
    simpleExplanation: 'Repeat-multiplies a base number as many times as you choose! 2⁵ means 2 × 2 × 2 × 2 × 2 = 32.',
    realWorldExample: 'Computing doubling computer memory (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024 GB)!',
    funFact: 'If you fold a piece of paper 42 times (2⁴²), the paper thickness would reach all the way to the Moon!',
    sampleExpression: '2 ^ 10',
    sampleAnswer: '1024',
    badgeColor: 'from-fuchsia-400 to-pink-600'
  },
  'sin': {
    id: 'sin',
    symbol: 'sin',
    title: 'Sine (The Wave & Height Tracker)',
    category: 'Trigonometry',
    simpleExplanation: 'Sine measures how high up you are on a spinning wheel (like a Ferris Wheel) or on an ocean wave! At 90 degrees (the top), sin = 1. At 0 degrees (the middle), sin = 0.',
    realWorldExample: 'Animation in video games! Making a character float up and down smoothly uses sin(time).',
    funFact: 'Sound music waves and radio signals travelling to your phone are sine waves!',
    sampleExpression: 'sin(30)',
    sampleAnswer: '0.5',
    badgeColor: 'from-cyan-400 to-blue-500'
  },
  'cos': {
    id: 'cos',
    symbol: 'cos',
    title: 'Cosine (The Forward & Backward Guide)',
    category: 'Trigonometry',
    simpleExplanation: 'Cosine is the best buddy of Sine! While Sine tracks height, Cosine tracks how far left-or-right you are on the Ferris wheel. At 0 degrees, cos = 1 (all the way to the right).',
    realWorldExample: 'Making cars turn smoothly in 3D racing games.',
    funFact: 'Together, sin and cos draw perfect circles and planetary orbits around the Sun!',
    sampleExpression: 'cos(60)',
    sampleAnswer: '0.5',
    badgeColor: 'from-teal-400 to-emerald-600'
  },
  'tan': {
    id: 'tan',
    symbol: 'tan',
    title: 'Tangent (The Steep Hill Slope)',
    category: 'Trigonometry',
    simpleExplanation: 'Tangent tells you how steep a ramp or mountain is! It divides height by forward distance (sin ÷ cos). A flat road has tan = 0, a 45° hill has tan = 1.',
    realWorldExample: 'Skateboard half-pipe designers and roller-coaster engineers use tangent to measure slopes.',
    funFact: 'At 90 degrees, tangent becomes infinity because you are going straight up like a rocket!',
    sampleExpression: 'tan(45)',
    sampleAnswer: '1',
    badgeColor: 'from-lime-400 to-green-600'
  },
  'factorial': {
    id: 'factorial',
    symbol: 'n!',
    title: 'Factorial (The Combination Party)',
    category: 'Functions',
    simpleExplanation: 'Multiply a number by every whole number counting down to 1! For example, 5! = 5 × 4 × 3 × 2 × 1 = 120. It counts all the ways to arrange things.',
    realWorldExample: 'If you have 4 books, there are 4! = 24 different orders you can put them on your shelf.',
    funFact: '52! (arranging a deck of cards) is so gigantic that every time you shuffle a deck properly, that order has likely never existed in human history!',
    sampleExpression: '5!',
    sampleAnswer: '120',
    badgeColor: 'from-yellow-400 to-amber-600'
  },
  'log': {
    id: 'log',
    symbol: 'log',
    title: 'Logarithm (The Big Number Shrinker)',
    category: 'Functions',
    simpleExplanation: 'Logarithm (base 10) asks: "How many zeros are in this number?" or "How many times do I multiply 10 to get this?". log(100) = 2, log(1000) = 3, log(1,000,000) = 6.',
    realWorldExample: 'Earthquake Richter scale! A 6.0 earthquake is 10 times stronger than a 5.0, and 100 times stronger than a 4.0.',
    funFact: 'Our human ears hear sound volume logarithmically (decibels) so we can hear both a whisper and a jet airplane!',
    sampleExpression: 'log(10000)',
    sampleAnswer: '4',
    badgeColor: 'from-purple-400 to-indigo-600'
  },
  'ln': {
    id: 'ln',
    symbol: 'ln',
    title: 'Natural Log (Natural Timer)',
    category: 'Functions',
    simpleExplanation: 'Natural log is the inverse of e! It asks: "How much time does it take for something growing continuously with e to reach this size?".',
    realWorldExample: 'Archaeologists use carbon-14 dating with ln to calculate how old dinosaur bones and fossils are.',
    funFact: 'ln stands for "Logarithmus Naturalis" in Latin.',
    sampleExpression: 'ln(e)',
    sampleAnswer: '1',
    badgeColor: 'from-sky-400 to-cyan-600'
  },
  'reciprocal': {
    id: 'reciprocal',
    symbol: '1/x',
    title: 'Reciprocal (The Fraction Flip)',
    category: 'Functions',
    simpleExplanation: 'Divides 1 by your number! If 4 people share 1 pizza equally, 1/4 = 0.25 (each gets a quarter pizza).',
    realWorldExample: 'Calculating speed: if you run 1 mile in 8 minutes, your pace is 1/8 of a mile per minute.',
    funFact: 'The bigger your number, the tinier the reciprocal! 1/1,000,000 is microscopic.',
    sampleExpression: '1 / (4)',
    sampleAnswer: '0.25',
    badgeColor: 'from-emerald-400 to-teal-600'
  },
  'abs': {
    id: 'abs',
    symbol: '|x|',
    title: 'Absolute Value (Pure Distance)',
    category: 'Functions',
    simpleExplanation: 'Ignores plus or minus signs and measures straight distance from zero! |-7| = 7 and |+7| = 7.',
    realWorldExample: 'Measuring how far a submarine is from sea level, whether 50 meters above or 50 meters deep.',
    funFact: 'Distance can never be negative in physics, so speed and distance always use absolute values!',
    sampleExpression: '|-45.8|',
    sampleAnswer: '45.8',
    badgeColor: 'from-orange-400 to-red-500'
  }
};

export const KID_CHALLENGES: MathChallenge[] = [
  {
    id: 'c1',
    level: 'Explorer (Easy)',
    question: 'A magical square garden has an area of 144 square meters. What is the length of one side? (Hint: Use Square Root!)',
    hint: 'Use √(144)',
    targetAnswer: 12,
    explanation: 'Great job! √144 = 12 meters because 12 × 12 = 144.',
    suggestedKeys: ['√', '1', '4', '4', '=']
  },
  {
    id: 'c2',
    level: 'Explorer (Easy)',
    question: 'If you have 4 friends standing in a race line, how many different ways can they line up from 1st to 4th place?',
    hint: 'Use 4! (Factorial)',
    targetAnswer: 24,
    explanation: 'Awesome! 4! = 4 × 3 × 2 × 1 = 24 possible line orders.',
    suggestedKeys: ['4', 'n!', '=']
  },
  {
    id: 'c3',
    level: 'Scientist (Medium)',
    question: 'A giant circular trampoline has a radius of 7 meters. What is its circumference (distance around)? Formula: 2 × π × r',
    hint: 'Calculate 2 × π × 7',
    targetAnswer: 43.98,
    tolerance: 0.1,
    explanation: 'Super scientist! 2 × 3.14159 × 7 ≈ 43.98 meters.',
    suggestedKeys: ['2', '×', 'π', '×', '7', '=']
  },
  {
    id: 'c4',
    level: 'Scientist (Medium)',
    question: 'A robot computer doubles its memory 8 times. What is 2 to the power of 8 (2⁸)?',
    hint: 'Calculate 2 ^ 8',
    targetAnswer: 256,
    explanation: 'Spot on! 2⁸ = 256 bytes.',
    suggestedKeys: ['2', 'xʸ', '8', '=']
  },
  {
    id: 'c5',
    level: 'Cosmic Genius (Hard)',
    question: 'At a 30° angle on a Ferris Wheel, what is the sine height value? (Set mode to DEG)',
    hint: 'Calculate sin(30)',
    targetAnswer: 0.5,
    tolerance: 0.01,
    explanation: 'Cosmic Genius! sin(30°) = 0.5 (exactly halfway up to the top).',
    suggestedKeys: ['sin', '3', '0', ')', '=']
  },
  {
    id: 'c6',
    level: 'Cosmic Genius (Hard)',
    question: 'An earthquake measured 10,000 times stronger than base vibration. How many orders of magnitude is that? (Hint: log base 10)',
    hint: 'Calculate log(10000)',
    targetAnswer: 4,
    explanation: 'Incredible! log(10,000) = 4 on the Richter magnitude scale.',
    suggestedKeys: ['log', '1', '0', '0', '0', '0', ')', '=']
  }
];
