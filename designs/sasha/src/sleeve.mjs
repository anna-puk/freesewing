import { sleevecap } from './sleevecap.mjs'
import { sleeve as brianSleeve } from '@freesewing/brian'

export const sleeve = {
  name: 'sasha.sleeve',
  options: {
    sleeveLengthBonus: { pct: 0, min: -40, max: 10, menu: 'style' },
    cuffEase: { pct: 20, min: 0, max: 200, menu: 'fit' },
  },
  measurements: ['shoulderToWrist', 'wrist'],
  from: sleevecap,
  hide: 'HIDE_TREE',
  draft: (sh) => {
    const { paths, part } = sh
    //draft
    brianSleeve.draft(sh)

    return part
  },
}
