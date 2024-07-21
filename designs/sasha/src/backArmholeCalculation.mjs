import { back as bellaBack } from '@freesewing/bella'
import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'

function calculate({
  options,
  Point,
  Path,
  points,
  paths,
  Snippet,
  snippets,
  sa,
  macro,
  store,
  part,
}) {
  // NOTE: this part does not draw anything but calculates the length of the back armhole

  store.set(
    'backArmholeLength',
    new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .curve_(points.armholePitchCp2, points.shoulder)
      .line(points.hps)
      .length()
  )
  // 'backArmholeToArmholePitch' determines notch placement
  store.set(
    'backArmholeToArmholePitch',
    new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .length()
  )

  return part
}

export const backArmholeCalculation = {
  name: 'backArmholeCalculation',
  from: bellaBack,
  after: frontArmholeCalculation,
  draft: calculate,
}
