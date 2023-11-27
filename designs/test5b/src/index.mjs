//

import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'
import { data } from '../data.mjs'
// Parts
import { box } from './box.mjs'
import { back } from './back.mjs'
import { front } from './front.mjs'
import { waistband } from './waistband.mjs'

// Create new design
const Test5b = new Design({
  data,
  parts: [box, back, front, waistband],
})

// Named exports
export { box, back, front, waistband, i18n, Test5b }
