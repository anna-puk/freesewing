//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { frontInside } from './frontinside.mjs'
import { frontOutside } from './frontoutside.mjs'
import { backInside } from './backinside.mjs'
import { backOutside } from './backoutside.mjs'
import { pocket } from './parts/pocket/pocket.mjs'
// import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'
// import { backArmholeCalculation } from './backArmholeCalculation.mjs'
// import { front } from './front.mjs'
// import { sleevecap } from '../../brian/src/sleevecap.mjs'
// import { box } from './box.mjs'

// Create new design
const Sasha = new Design({
  data,
  // parts: [frontInside, frontOutside, backInside, backOutside],
  parts: [frontInside, frontOutside, backInside, backOutside, pocket],
})

// Named exports
export { frontInside, frontOutside, backInside, backOutside, pocket, i18n, Sasha }
