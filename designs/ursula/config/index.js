import { version } from '../package.json'

export default {
  version,
  name: 'ursula',
  design: 'Natalia Sayang',
  code: 'Natalia Sayang',
  department: 'underwear',
  type: 'pattern',
  difficulty: 1,
  tags: [
    'freesewing',
    'design',
    'diy',
    'fashion',
    'made to measure',
    'parametric design',
    'pattern',
    'sewing',
    'sewing pattern',
  ],
  optionGroups: {
    fit: ['fabricStretchX', 'fabricStretchY', 'adjustStretch', 'elasticStretch', 'useCrossSeam', 'gussetWidth', 'gussetLength'],
    style: ['rise', 'legOpening', 'frontDip', 'backDip', 'taperToGusset', 'backExposure'],
  },
  optionalMeasurements: ['crossSeam','crossSeamFront'],
  measurements: ['waist', 'seat', 'waistToSeat', 'waistToUpperLeg','hips','waistToHips'], 
  dependencies: {
    back: 'front',
    gusset: 'back',
  },
  inject: {},
  hide: [],
  parts: ['front', 'back', 'gusset', 'elastic'],
  //Constants
  options: {
    backToFrontLength: 1.15, // used only if useCrossSeam is not used
    backToFrontWidth: 1.1, // Maybe include this in advanced options?
    gussetRatio: 0.7, // Relationship between front and back gusset widths
	gussetShift: 0.015, // fraction of seat circumference - could be an advanced option?

    // Percentages
    gussetWidth: { pct: 7.2, min: 2, max: 12 }, // Gusset width in relation to waist-to-upperleg
    gussetLength: { pct: 12.7, min: 10, max: 16 }, // Gusset length in relation to seat
    fabricStretchX: { pct: 15, min: 0, max: 100 }, // horizontal stretch (range set wide for beta testing)
    fabricStretchY: {pct: 0, min: 0, max: 100 }, // vertical stretch (range set wide for beta testing)
    rise: { pct: 60, min: 30, max: 100 }, // extending rise beyond 100% would require adapting paths.sideLeft!
    legOpening: { pct: 45, min: 5, max: 85 },
    frontDip: { pct: 5.0, min: -5, max: 15 },
    backDip: { pct: 2.5, min: -5, max: 15 },
    taperToGusset: { pct: 70, min: 5, max: 100 },
    backExposure: { pct: 20, min: -30, max: 90 },
    elasticStretch: { pct: 8, min: 5, max: 15 }, // this is in addition to fabric stretch!
    
    // booleans
    useCrossSeam: { bool: true },
    adjustStretch: {bool: true}, // to not stretch fabric to the limits
  },
}
