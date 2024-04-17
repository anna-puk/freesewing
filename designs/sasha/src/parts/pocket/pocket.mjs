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
    .line(
      points.path194_p5
        .translate(-50, 50)
        .shift(0, options.lineEndShift * paths.pocketOpening.length())
    )
  //const pathToCut = paths.seam.translate(0.001,0.001)
  // const pathThatCuts = new Path()
  // .move(points.pocketStart.shift(0,pocketWidth/10))
  // .line(points.pocketEnd.shift(180,pocketWidth/10))
  paths.pathToCut = paths.pocketOpening
    .translate(-points.path194_p5.dx(points.pocketEnd), -points.path194_p5.dy(points.pocketEnd))
    .unhide()

  const tol = 1 // mm

  /*   points.test_intersection = utils
    .pathsIntersect(paths, points, paths.pathToCut, paths.pathThatCuts, tol)
    .addCircle(5, 'interfacing') */

  let opCurve = paths.pathToCut.ops[1]

  const test_intersection2 = utils.lineIntersectsCurveAlt(
    paths,
    paths.pathThatCuts.start(),
    paths.pathThatCuts.end(),
    paths.pathToCut.start(),
    opCurve.cp1,
    opCurve.cp2,
    opCurve.to,
    tol
  )

  if (test_intersection2) {
    console.log(test_intersection2)
    if (test_intersection2 instanceof Array) {
      for (let i of test_intersection2) {
        if (i) i.addCircle(5, 'facing')
      }
    } else {
      points.intersection = test_intersection2.addCircle(5, 'facing')
    }
  }

  /*   let point3 = new Point(36, 160)
  let point3Cp1 = new Point(44, 106)
  let point4Cp2 = new Point(53, 67)
  let point4 = new Point(49, 17)
  let dartPoint0 = new Point(63, 78)
  let dartPoint0Cp1 = new Point(63, 78)
  let dartPoint1Cp2 = new Point(32, 64)
  let dartPoint1 = new Point(18, 63)

  paths.p1 = new Path()
    .move(point3)
    .curve(point3Cp1, point4Cp2, point4)
  paths.d1 = new Path()
    .move(dartPoint0)
    .curve(dartPoint0Cp1, dartPoint1Cp2, dartPoint1)

  let i = utils.pathsIntersect(paths,points,
    paths.p1,paths.d1,tol
    )  
    
/*     console.log('i',i) */

  /*     let A = new Point(10, 10)
    let Acp = new Point(10, 30)
    let B = new Point(110, 10)
    let Bcp = new Point(110, 30)
    let E = new Point(50, 14)
    let D = new Point(55, 16)
    
    utils.lineIntersectsCurveAlt(paths, E, D, A, Acp, Bcp, B, tol) */

  /*     let hit = utils.lineIntersectsCurveAlt(E, D, A, Acp, Bcp, B, tol)
    console.log('hit:',hit) */
  /*     expect(round(hit.x)).to.equal(75.79)
    expect(round(hit.y)).to.equal(24.31) */

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
    lineEndShift: {
      pct: 0,
      min: -400,
      max: +400,
      menu: 'fit',
    },
  },
}
