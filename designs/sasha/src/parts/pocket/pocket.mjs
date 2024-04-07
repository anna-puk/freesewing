import { pctBasedOn } from '@freesewing/core'
import { draft_path194 } from './paths/draft_path194.mjs'
import { frontOutside as sashaFrontOutside } from '@freesewing/sasha'

// temporary while the functions aren't in utils yet
import { Path } from '@freesewing/core'
import { Point } from '@freesewing/core'
import { deg2rad } from '@freesewing/core'
import { linesIntersect } from '@freesewing/core'

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

  paths.path194.hide()

  //paths.tempPath = paths.path194.split(points.path194_p5)
  paths.tempPath = paths.path194.join(
    paths.pocketOpening.translate(
      -points.path194_p5.dx(points.pocketEnd),
      -points.path194_p5.dy(points.pocketEnd)
    )
  ) //.hide()

  // try to find an intersection
  // paths.pathThatCuts = new Path()
  // .move(points.pocketStart)
  // .line(points.pocketEnd.shiftTowards(points.pocketStart,-10))
  // .translate(
  // -points.path194_p5.dx(points.pocketEnd),
  // -points.path194_p5.dy(points.pocketEnd))
  // .translate(0,-0.0001)
  paths.pathThatCuts = new Path()
    .move(points.path194_p1.translate(15, -15))
    .line(points.path194_p5.translate(-50, 50))
  //const pathToCut = paths.seam.translate(0.001,0.001)
  // const pathThatCuts = new Path()
  // .move(points.pocketStart.shift(0,pocketWidth/10))
  // .line(points.pocketEnd.shift(180,pocketWidth/10))
  paths.pathToCut = paths.pocketOpening
    .translate(-points.path194_p5.dx(points.pocketEnd), -points.path194_p5.dy(points.pocketEnd))
    .unhide()

  const tol = 1 // mm

  points.test_intersection = utils
    .pathsIntersect(paths, points, paths.pathToCut, paths.pathThatCuts, tol)
    .addCircle(5, 'interfacing')

  /*
  // TODO: specify path sections and use utils.curvesIntersect
   const intersections = paths.pathToCut.intersects(paths.pathThatCuts)  
   
   for (const i in intersections) intersections[i].addCircle(5,'interfacing')
   
   console.log(intersections)
   console.log(intersections.length)
  
  // Notches
  if (intersections.length > 1) {
     macro('sprinkle', {
      snippet: 'notch',
      on: intersections,
    })   
  } */

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
