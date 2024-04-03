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

  let opToCut,
    opThatCuts,
    temp_points,
    distCp1,
    distCp2,
    distToUpper,
    distToLower,
    pathBase,
    halves,
    halves2,
    distToFirst,
    distToLast,
    potentialIntersectionThatCuts,
    potentialIntersectionToCut,
    bounds,
    angleBetween
  bounds = []
  for (let ind = 1; ind < 10; ind++) {
    console.log(ind)
    opToCut = paths.pathToCut.ops[1]
    opThatCuts = paths.pathThatCuts.ops[1]

    if (opToCut.type === 'line') {
      pathBase = new Path()
        .move(paths.pathToCut.start().shiftTowards(paths.pathToCut.end(), -tol / 2))
        .line(paths.pathToCut.end().shiftTowards(paths.pathToCut.start(), -tol / 2))
      paths.bound_a = pathBase.offset(tol / 2).addClass('lining')
      paths.bound_b = pathBase.offset(-tol / 2).addClass('lining sa')
      console.log('pathToCut is a line')

      points.A = pathBase.start()
      points.B = pathBase.end()
    } else {
      temp_points = [paths.pathToCut.start(), opToCut.cp1, opToCut.cp2, opToCut.to]

      console.log(temp_points)

      // calculate *signed* distance to the straight line between start and end
      distCp1 =
        ((temp_points[3].x - temp_points[0].x) * (temp_points[0].y - temp_points[1].y) -
          (temp_points[0].x - temp_points[1].x) * (temp_points[3].y - temp_points[0].y)) /
        Math.sqrt(
          (temp_points[3].x - temp_points[0].x) * (temp_points[3].x - temp_points[0].x) +
            (temp_points[3].y - temp_points[0].y) * (temp_points[3].y - temp_points[0].y)
        )

      distCp2 =
        ((temp_points[3].x - temp_points[0].x) * (temp_points[0].y - temp_points[2].y) -
          (temp_points[0].x - temp_points[2].x) * (temp_points[3].y - temp_points[0].y)) /
        Math.sqrt(
          (temp_points[3].x - temp_points[0].x) * (temp_points[3].x - temp_points[0].x) +
            (temp_points[3].y - temp_points[0].y) * (temp_points[3].y - temp_points[0].y)
        )

      distToUpper = Math.max(distCp1, distCp2, 0) + tol / 2
      distToLower = Math.min(distCp1, distCp2, 0) - tol / 2

      console.log([distToUpper, distToLower])

      points.upperStart = temp_points[0]
        .shiftTowards(temp_points[3], distToUpper)
        .rotate(90, temp_points[0])
      points.upperEnd = temp_points[3]
        .shiftTowards(temp_points[0], distToUpper)
        .rotate(270, temp_points[3])
      points.lowerStart = temp_points[0]
        .shiftTowards(temp_points[3], distToLower)
        .rotate(90, temp_points[0])
      points.lowerEnd = temp_points[3]
        .shiftTowards(temp_points[0], distToLower)
        .rotate(270, temp_points[3])

      paths.bound_a = new Path()
        .move(points.upperStart.shiftTowards(points.upperEnd, -tol / 2))
        .line(points.upperEnd.shiftTowards(points.upperStart, -tol / 2))
        .addClass('lining')

      paths.bound_b = new Path()
        .move(points.lowerStart.shiftTowards(points.lowerEnd, -tol / 2))
        .line(points.lowerEnd.shiftTowards(points.lowerStart, -tol / 2))
        .addClass('lining sa')

      points.A = temp_points[0].clone()
      points.B = temp_points[3].clone()
      points.Acp = temp_points[1].clone()
      points.Bcp = temp_points[2].clone()
    }

    console.log(opThatCuts)
    angleBetween =
      360 +
      paths.pathThatCuts.start().angle(paths.pathThatCuts.end()) -
      (paths.pathToCut.start().angle(paths.pathToCut.end()) % 360) // guaranteed to be in [0 360)
    console.log('angle:', angleBetween)
    if (opThatCuts.type === 'line') {
      pathBase = new Path()
        .move(paths.pathThatCuts.start().shiftTowards(paths.pathThatCuts.end(), -tol / 2))
        .line(paths.pathThatCuts.end().shiftTowards(paths.pathThatCuts.start(), -tol / 2))

      // reverse path if necessary to ensure that bound_c is closest to the start of bound_a/_b
      if (angleBetween >= 180) {
        pathBase.reverse()
        console.log('reversed base path')
      }

      paths.bound_c = pathBase.offset(tol / 2).addClass('mark')
      paths.bound_d = pathBase.offset(-tol / 2).addClass('mark sa')
      console.log('pathThatCuts is a line')

      points.C = pathBase.start()
      points.D = pathBase.end()
    } else {
      temp_points = [paths.pathToCut.start(), opToCut.cp1, opToCut.cp2, opToCut.to]

      console.log('temp_points:', temp_points)

      if (angleBetween >= 180) {
        // reverse the array defining the path if necessary to ensure that bound_c ('upper') is closest to the start of bound_a/_b
        temp_points.reverse()
        console.log('reversed points')
      }

      // calculate *signed* distance to the straight line between start and end
      distCp1 =
        ((temp_points[3].x - temp_points[0].x) * (temp_points[0].y - temp_points[1].y) -
          (temp_points[0].x - temp_points[1].x) * (temp_points[3].y - temp_points[0].y)) /
        Math.sqrt(
          (temp_points[3].x - temp_points[0].x) * (temp_points[3].x - temp_points[0].x) +
            (temp_points[3].y - temp_points[0].y) * (temp_points[3].y - temp_points[0].y)
        )

      distCp2 =
        ((temp_points[3].x - temp_points[0].x) * (temp_points[0].y - temp_points[2].y) -
          (temp_points[0].x - temp_points[2].x) * (temp_points[3].y - temp_points[0].y)) /
        Math.sqrt(
          (temp_points[3].x - temp_points[0].x) * (temp_points[3].x - temp_points[0].x) +
            (temp_points[3].y - temp_points[0].y) * (temp_points[3].y - temp_points[0].y)
        )

      distToUpper = Math.max(distCp1, distCp2, 0) + tol / 2
      distToLower = Math.min(distCp1, distCp2, 0) - tol / 2

      console.log('dist:', [distToUpper, distToLower])

      // re-use upper/lower start/end points
      points.upperStart = temp_points[0]
        .shiftTowards(temp_points[3], distToUpper)
        .rotate(90, temp_points[0])
      points.upperEnd = temp_points[3]
        .shiftTowards(temp_points[0], distToUpper)
        .rotate(270, temp_points[3])
      points.lowerStart = temp_points[0]
        .shiftTowards(temp_points[3], distToLower)
        .rotate(90, temp_points[0])
      points.lowerEnd = temp_points[3]
        .shiftTowards(temp_points[0], distToLower)
        .rotate(270, temp_points[3])

      paths.bound_c = new Path()
        .move(points.upperStart.shiftTowards(points.upperEnd, -tol / 2))
        .line(points.upperEnd.shiftTowards(points.upperStart, -tol / 2))
        .addClass('mark')

      paths.bound_d = new Path()
        .move(points.lowerStart.shiftTowards(points.lowerEnd, -tol / 2))
        .line(points.lowerEnd.shiftTowards(points.lowerStart, -tol / 2))
        .addClass('mark sa')

      points.C = temp_points[0].clone()
      points.D = temp_points[3].clone()
      points.Ccp = temp_points[1].clone()
      points.Dcp = temp_points[2].clone()
    }

    paths[`bound_a_iter${ind}`] = paths.bound_a.clone()
    paths[`bound_b_iter${ind}`] = paths.bound_b.clone()
    paths[`bound_c_iter${ind}`] = paths.bound_c.clone()
    paths[`bound_d_iter${ind}`] = paths.bound_d.clone()

    // bounds = [bounds, paths.bound_a.clone(), paths.bound_b.clone(), paths.bound_c.clone(), paths.bound_b.clone()]

    points.xAC = utils.linesIntersect(
      paths.bound_a.start(),
      paths.bound_a.end(),
      paths.bound_c.start(),
      paths.bound_c.end()
    )
    points.xAD = utils.linesIntersect(
      paths.bound_a.start(),
      paths.bound_a.end(),
      paths.bound_d.start(),
      paths.bound_d.end()
    )
    points.xBC = utils.linesIntersect(
      paths.bound_b.start(),
      paths.bound_b.end(),
      paths.bound_c.start(),
      paths.bound_c.end()
    )
    points.xBD = utils.linesIntersect(
      paths.bound_b.start(),
      paths.bound_b.end(),
      paths.bound_d.start(),
      paths.bound_d.end()
    )

    // TODO: deal with some lines not intersecting
    // NOTE: distance to intersection along the bound_ lines is guaranteed to be shorter than (or equal to) the length along the curve to that intersection, because a line is the shortest way to get from A to B
    if (!points.xAC ^ !points.xBC) {
      // XOR: exactly one is false
      distToFirst = 0
    } else {
      distToFirst = Math.min(
        paths.bound_a.start().dist(points.xAC),
        paths.bound_b.start().dist(points.xBC)
      )
    }
    if (!points.xAD ^ !points.xBD) {
      // XOR: exactly one is false
      distToLast = 0
    } else {
      distToLast = Math.min(
        paths.bound_a.end().dist(points.xAD),
        paths.bound_b.end().dist(points.xBD)
      )
    }

    /*       // old version: if we don't know the orientations, need to check all distances
      distToFirst = Math.min(paths.bound_a.start().dist(points.xAC),paths.bound_a.start().dist(points.xAD),paths.bound_b.start().dist(points.xBC),paths.bound_b.start().dist(points.xBD))
      distToLast = Math.min(paths.bound_a.end().dist(points.xAC),paths.bound_a.end().dist(points.xAD),paths.bound_b.end().dist(points.xBC),paths.bound_b.end().dist(points.xBD)) */

    console.log([distToFirst, distToLast])

    // reduce the length by tol to account for both the tolerance itself and the fact that the bounds start tol/2 before the start of the curve
    halves = paths.pathToCut.split(paths.pathToCut.shiftAlong(distToFirst - tol, 1 / tol))
    paths.temp = halves[1].reverse()
    halves2 = halves[1].split(paths.temp.shiftAlong(distToLast - tol, 1 / tol))

    // paths.first_part = halves[0]
    // paths.middle_part = halves2[0]
    // paths.last_part = halves2[1]

    potentialIntersectionToCut = halves2[0]

    console.log(potentialIntersectionToCut)

    // TODO: calculate roughLength first to save time?
    // NOTE: several bezier operations use 100 segments, so 10 * tol ensures that these segments are an order of magnitude smaller than our tolerance
    if (potentialIntersectionToCut.length() < 10 * tol) {
      // if we're lucky, the middles are within tol of each other
      if (
        potentialIntersectionToCut
          .shiftFractionAlong(0.5)
          .sitsRoughlyOn(potentialIntersectionThatCuts.shiftFractionAlong(0.5), tol)
      ) {
        points.intersection = potentialIntersectionToCut.shiftFractionAlong(0.5) // got it!
        break // TODO: once this becomes its own function, add a return here
      }
    }
    // } else { // TODO: add an elseif that splits the path in two if the remaining length is 'significant'

    // TODO: use angleBetween to determine which intersections are relevant here
    distToFirst = Math.min(
      paths.bound_c.start().dist(points.xAC),
      paths.bound_c.start().dist(points.xBC),
      paths.bound_d.start().dist(points.xAD),
      paths.bound_d.start().dist(points.xBD)
    )
    distToLast = Math.min(
      paths.bound_c.end().dist(points.xAC),
      paths.bound_c.end().dist(points.xBC),
      paths.bound_d.end().dist(points.xAD),
      paths.bound_d.end().dist(points.xBD)
    )

    // reduce the length by tol to account for both the tolerance itself and the fact that the bounds start tol/2 before the start of the curve
    halves = paths.pathThatCuts.split(paths.pathThatCuts.shiftAlong(distToFirst - tol, 1 / tol))
    paths.temp = halves[1].reverse()
    halves2 = halves[1].split(paths.temp.shiftAlong(distToLast - tol, 1 / tol))

    potentialIntersectionThatCuts = halves2[0]

    if (potentialIntersectionThatCuts.length() < tol) {
      points.intersection = potentialIntersectionThatCuts.shiftFractionAlong(0.5) // pick the middle
      break // TODO: once this becomes its own function, add a return here
    } else {
      // repeat the whole thing
      paths.pathToCut = potentialIntersectionToCut
      paths.pathThatCuts = potentialIntersectionThatCuts
    }
    //}
  }

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
