import { back as bellaBack } from '@freesewing/bella'
import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'

export const backArmholeCalculation = {
  name: 'backArmholeCalculation',
  from: bellaBack,
  after: frontArmholeCalculation,
  draft: ({ store, options, Point, Path, points, paths, Snippet, snippets, sa, macro, part }) => {
    // NOTE: this part does not draw anything but calculates the length of the front armhole

    store.set(
      'backArmholeLength',
      new Path()
        .move(points.armhole)
        .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
        .curve_(points.armholePitchCp2, points.shoulder)
        .length()
    )

    return part
  },
}
