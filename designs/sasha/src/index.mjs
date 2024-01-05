//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
// import { frontInside } from './frontinside.mjs'
import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'
import { backArmholeCalculation } from './backArmholeCalculation.mjs'
import { front } from './front.mjs'
import { sleevecap } from '../../brian/src/sleevecap.mjs'

// Create new design
const Sasha = new Design({
  data,
  parts: [frontInside],
})

// Named exports
export { frontArmholeCalculation, backArmholeCalculation, front, sleevecap, i18n, Sasha }
