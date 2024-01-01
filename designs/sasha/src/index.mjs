//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { frontInside } from './frontinside.mjs'

// Create new design
const Sasha = new Design({
  data,
  parts: [frontInside],
})

// Named exports
export { frontInside, i18n, Sasha }
