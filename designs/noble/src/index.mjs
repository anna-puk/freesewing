import { Design } from '@freesewing/core'
import { data } from '../data.mjs'
import { i18n } from '../i18n/index.mjs'
import { backPoints } from './backpoints.mjs'
import { backInside } from './backinside.mjs'
import { backOutside } from './backoutside.mjs'
import { frontPoints } from './frontpoints.mjs'
import { frontInside } from './frontinside.mjs'
import { frontOutside } from './frontoutside.mjs'
import { front } from './front.mjs'
import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'
import { backArmholeCalculation } from './backArmholeCalculation.mjs'
import { sleevecap } from './sleevecap.mjs'
import { sleeve } from './sleeve.mjs'
import { dummy } from './dummy.mjs'

// Setup our new design
const Noble = new Design({
  data,
  parts: [
    backPoints,
    backInside,
    backOutside,
    frontPoints,
    frontInside,
    frontOutside,
    frontArmholeCalculation,
    backArmholeCalculation,
    dummy,
    front,
    sleevecap,
  ],
})

// Named exports
export {
  backPoints,
  backInside,
  backOutside,
  frontPoints,
  frontInside,
  frontOutside,
  frontArmholeCalculation,
  backArmholeCalculation,
  dummy,
  front,
  sleevecap,
  Noble,
  i18n,
}
