import { version } from '../package.json'

export default {
  version,
  name: 'wahid',
  design: 'Joost De Cock',
  code: 'Joost De Cock',
  department: 'tops',
  type: 'pattern',
  difficulty: 4,
  optionGroups: {
    fit: [
      'chestEase',
      'waistEase',
      'hipsEase',
      'lengthBonus',
      'armholeDepthFactor',
      'backScyeDart',
      'frontScyeDart',
      'centerBackDart',
      'draftForHighBust',
    ],
    style: [
      'pocketLocation',
      'pocketWidth',
      'weltHeight',
      'necklineDrop',
      'frontStyle',
      'hemStyle',
      'hemRadius',
      'buttons',
    ],
    advanced: ['backInset', 'frontInset', 'shoulderInset', 'neckInset', 'pocketAngle'],
  },
  measurements: [
    'biceps',
    'chest',
    'hips',
    'hpsToWaistBack',
    'waistToHips',
    'neck',
    'shoulderSlope',
    'shoulderToShoulder',
    'waist',
  ],
  optionalMeasurements: [ 'highBust' ],
  dependencies: {
    backBlock: 'base',
    frontBlock: 'backBlock',
    front: 'frontBlock',
    back: 'backBlock',
    frontFacing: 'front',
    frontLining: 'front',
    pocketBag: 'front',
  },
  inject: {
    backBlock: 'base',
    frontBlock: 'backBlock',
    front: 'frontBlock',
    back: 'backBlock',
    frontFacing: 'front',
    frontLining: 'front',
  },
  hide: ['base', 'frontBlock', 'backBlock'],
  parts: ['pocketWelt', 'pocketFacing', 'pocketInterfacing'],
  options: {
    // These are needed because Brian expects them
    brianFitSleeve: false,
    brianFitCollar: false,
    collarFactor: 4.8,
    backNeckCutout: 0.05,
    shoulderSlopeReduction: 0,
    collarEase: 0.035,
    shoulderEase: 0,
    bicepsEase: 0.15,
    acrossBackFactor: 0.97,
    frontArmholeDeeper: 0.005,
    // s3 is short for Shoulder Seam Shift
    s3Collar: 0,
    s3Armhole: 0,

    // Wahid options start here
    frontOverlap: 0.01,
    armholeDepthFactor: { pct: 70, min: 60, max: 80 },
    pocketLocation: { pct: 35, min: 25, max: 55 },
    pocketWidth: { pct: 10, max: 15, min: 8 },
    weltHeight: { pct: 12.5, max: 20, min: 10 },
    chestEase: { pct: 2, min: 1, max: 10 },
    waistEase: { pct: 8, min: 2, max: 15 },
    hipsEase: { pct: 8, min: 2, max: 15 },
    lengthBonus: { pct: 1, min: 0, max: 8 },
    backScyeDart: { deg: 2, min: 0, max: 6 },
    frontScyeDart: { deg: 6, min: 0, max: 12 },
    centerBackDart: { pct: 2, min: 0, max: 5 },
    necklineDrop: { pct: 50, min: 35, max: 85 },
    frontStyle: {
      dflt: 'classic',
      list: ['classic', 'rounded'],
    },
    hemStyle: {
      dflt: 'classic',
      list: ['classic', 'rounded', 'square'],
    },
    hemRadius: { pct: 6, min: 2, max: 12 },
    buttons: { count: 6, min: 4, max: 12 },
    backInset: { pct: 15, min: 10, max: 20 },
    frontInset: { pct: 15, min: 10, max: 20 },
    shoulderInset: { pct: 10, min: 0, max: 20 },
    neckInset: { pct: 5, min: 0, max: 10 },
    pocketAngle: { deg: 5, min: 0, max: 5 },

    // draft for high bust
    draftForHighBust: { bool: false },
  },
}
