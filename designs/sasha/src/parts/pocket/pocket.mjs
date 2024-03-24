import { pctBasedOn } from '@freesewing/core'
import { draft_path194 } from './paths/draft_path194.mjs'
import { frontOutside as sashaFrontOutside } from '@freesewing/sasha'

function draftPocket({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  store,
  part,
}) {
  // hide all paths inherited from frontOutside
  for (const key of Object.keys(paths)) paths[key].hide()

  draft_path194(Path, Point, paths, points, measurements, options, utils, macro, store, part)

  //paths.tempPath = paths.path194.split(points.path194_p5)
  paths.tempPath = paths.path194.join(
    paths.pocketOpening.translate(
      -points.path194_p5.dx(points.pocketEnd),
      -points.path194_p5.dy(points.pocketEnd)
    )
  )

  points.titleAnchor = points.path194_p1.shiftFractionTowards(points.path194_p4, 0.5)

  macro('title', {
    at: points.titleAnchor,
    nr: 5,
    title: 'pocket',
  })

  //paths.seam = paths.path194.split(points.path194_p5).join(paths.pocketOpening.reverse)

  // paths.path194.hide()

  return part
}

export const pocket = {
  name: 'test-sasha-pocket.pocket',
  from: sashaFrontOutside,
  draft: draftPocket,
  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    // Enter your pattern options here. Example:
    /*
        extraLength: {
            pct: 10,
            min: 5,
            max: 20,
            label: 'Extra length',
            menu: 'fit',
            ...pctBasedOn('neck')
        }
        */
  },
}
