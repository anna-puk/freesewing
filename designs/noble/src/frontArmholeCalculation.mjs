import { frontSideDart as bellaFront } from '@freesewing/bella'
import { backArmholeCalculation } from './backArmholeCalculation.mjs'
import { front as brianFront } from '../../brian/src/front.mjs'

export const frontArmholeCalculation = {
  name: 'frontArmholeCalculation',
  from: bellaFront,
  after: brianFront,
  draft: ({ store, options, Point, Path, points, paths, Snippet, snippets, sa, macro, part }) => {
    // NOTE: this part does not draw anything but calculates the length of the front armhole

    store.set(
      'frontArmholeLength',
      new Path()
        .move(points.armhole)
        .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
        .curve_(points.armholePitchCp2, points.shoulder)
        .length()
    )

    return part
  },
}
