//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { box } from './box.mjs'

// Create new design
const Demonstrate_alt_intersections = new Design({
  data,
  parts: [box],
})

// Named exports
export { box, i18n, Demonstrate_alt_intersections }
