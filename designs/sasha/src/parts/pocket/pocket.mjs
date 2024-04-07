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

  points.test_intersection = pathsIntersect(
    paths,
    points,
    paths.pathToCut,
    paths.pathThatCuts,
    tol
  ).addCircle(5, 'interfacing')

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

function projectPointOnBeam(from, to, check, precision = 1e6) {
  if (from.sitsOn(check)) return 0
  if (to.sitsOn(check)) return 1
  let angleBetween = (360 + from.angle(check) - from.angle(to)) % 360 // guaranteed to be in [0 360)

  console.log('points:', from, to, check)
  console.log('angle:', angleBetween, 'rel. length', from.dist(check) / from.dist(to))

  return (Math.cos(deg2rad(angleBetween)) * from.dist(check)) / from.dist(to)
}

function pathsIntersect(paths, points, pathToCut, pathThatCuts, tol) {
  let opToCut,
    opThatCuts,
    temp_points,
    distCp1,
    distCp2,
    xAC,
    xAD,
    xBC,
    xBD,
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
    opToCut = pathToCut.ops[1]
    opThatCuts = pathThatCuts.ops[1]

    if (opToCut.type === 'line') {
      pathBase = new Path()
        .move(pathToCut.start().shiftTowards(pathToCut.end(), -tol / 2))
        .line(pathToCut.end().shiftTowards(pathToCut.start(), -tol / 2))
      paths.bound_a = pathBase.offset(tol / 2).addClass('lining')
      paths.bound_b = pathBase.offset(-tol / 2).addClass('lining sa')
      console.log('pathToCut is a line')

      points.A = pathBase.start()
      points.B = pathBase.end()
    } else {
      temp_points = [pathToCut.start(), opToCut.cp1, opToCut.cp2, opToCut.to]

      console.log(temp_points)

      // calculate *signed* distance to the straight line between start and end
      distCp1 = temp_points[1].sitsRoughlyOn(temp_points[0], tol)
        ? 0
        : temp_points[1].sitsRoughlyOn(temp_points[3], tol)
          ? 0
          : ((temp_points[3].x - temp_points[0].x) * (temp_points[0].y - temp_points[1].y) -
              (temp_points[0].x - temp_points[1].x) * (temp_points[3].y - temp_points[0].y)) /
            Math.sqrt(
              (temp_points[3].x - temp_points[0].x) * (temp_points[3].x - temp_points[0].x) +
                (temp_points[3].y - temp_points[0].y) * (temp_points[3].y - temp_points[0].y)
            )

      distCp2 = temp_points[2].sitsRoughlyOn(temp_points[0], tol)
        ? 0
        : temp_points[2].sitsRoughlyOn(temp_points[3], tol)
          ? 0
          : ((temp_points[3].x - temp_points[0].x) * (temp_points[0].y - temp_points[2].y) -
              (temp_points[0].x - temp_points[2].x) * (temp_points[3].y - temp_points[0].y)) /
            Math.sqrt(
              (temp_points[3].x - temp_points[0].x) * (temp_points[3].x - temp_points[0].x) +
                (temp_points[3].y - temp_points[0].y) * (temp_points[3].y - temp_points[0].y)
            )

      console.log('distCp12', distCp1, distCp2)

      console.log(
        'max test',
        Math.max(distCp1, distCp2),
        Math.max(distCp1, 0),
        Math.max(distCp2, 0),
        Math.max(distCp1, distCp2, 0)
      )

      console.log(
        'min test',
        Math.min(distCp1, distCp2),
        Math.min(distCp1, 0),
        Math.min(distCp2, 0),
        Math.min(distCp1, distCp2, 0)
      )

      console.log('tol:', tol)

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
      (360 +
        pathThatCuts.start().angle(pathThatCuts.end()) -
        pathToCut.start().angle(pathToCut.end())) %
      360 // guaranteed to be in [0 360)
    console.log('angle:', angleBetween)
    if (opThatCuts.type === 'line') {
      pathBase = new Path()
        .move(pathThatCuts.start().shiftTowards(pathThatCuts.end(), -tol / 2))
        .line(pathThatCuts.end().shiftTowards(pathThatCuts.start(), -tol / 2))

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
      temp_points = [pathToCut.start(), opToCut.cp1, opToCut.cp2, opToCut.to]

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

    xAC = linesIntersect(
      paths.bound_a.start(),
      paths.bound_a.end(),
      paths.bound_c.start(),
      paths.bound_c.end()
    )
    xAD = linesIntersect(
      paths.bound_a.start(),
      paths.bound_a.end(),
      paths.bound_d.start(),
      paths.bound_d.end()
    )
    xBC = linesIntersect(
      paths.bound_b.start(),
      paths.bound_b.end(),
      paths.bound_c.start(),
      paths.bound_c.end()
    )
    xBD = linesIntersect(
      paths.bound_b.start(),
      paths.bound_b.end(),
      paths.bound_d.start(),
      paths.bound_d.end()
    )

    // deal with some lines not intersecting
    // general approach: for any missing intersection, project the corners of the other box and
    // use this distance instead (or 0 if the projection is beyond the line start/end)

    console.log('paths:', paths.bound_a, paths.bound_c)

    console.log('points:', paths.bound_a.start(), paths.bound_a.end(), paths.bound_c.start())

    console.log('vals:', [
      0,
      projectPointOnBeam(paths.bound_a.start(), paths.bound_a.end(), paths.bound_c.start(), tol),
      projectPointOnBeam(paths.bound_a.start(), paths.bound_a.end(), paths.bound_d.start(), tol),
    ])

    points.xACa =
      xAC ||
      paths.bound_a.shiftFractionAlong(
        Math.max(
          0,
          Math.min(
            projectPointOnBeam(
              paths.bound_a.start(),
              paths.bound_a.end(),
              paths.bound_c.start(),
              tol
            ),
            projectPointOnBeam(
              paths.bound_a.start(),
              paths.bound_a.end(),
              paths.bound_d.start(),
              tol
            )
          )
        )
      )
    points.xACc =
      xAC ||
      paths.bound_c.shiftFractionAlong(
        Math.max(
          0,
          Math.min(
            projectPointOnBeam(
              paths.bound_c.start(),
              paths.bound_c.end(),
              paths.bound_a.start(),
              tol
            ),
            projectPointOnBeam(
              paths.bound_c.start(),
              paths.bound_c.end(),
              paths.bound_b.start(),
              tol
            )
          )
        )
      )
    points.xADa =
      xAD ||
      paths.bound_a.shiftFractionAlong(
        Math.min(
          1,
          Math.min(
            projectPointOnBeam(
              paths.bound_a.start(),
              paths.bound_a.end(),
              paths.bound_c.end(),
              tol
            ),
            projectPointOnBeam(paths.bound_a.start(), paths.bound_a.end(), paths.bound_d.end(), tol)
          )
        )
      )
    points.xADd =
      xAD ||
      paths.bound_d.shiftFractionAlong(
        Math.min(
          1,
          Math.min(
            projectPointOnBeam(
              paths.bound_d.start(),
              paths.bound_d.end(),
              paths.bound_a.end(),
              tol
            ),
            projectPointOnBeam(paths.bound_d.start(), paths.bound_d.end(), paths.bound_b.end(), tol)
          )
        )
      )
    points.xBCb =
      xBC ||
      paths.bound_b.shiftFractionAlong(
        Math.max(
          0,
          Math.min(
            projectPointOnBeam(
              paths.bound_b.start(),
              paths.bound_b.end(),
              paths.bound_c.start(),
              tol
            ),
            projectPointOnBeam(
              paths.bound_b.start(),
              paths.bound_b.end(),
              paths.bound_d.start(),
              tol
            )
          )
        )
      )
    points.xBCc =
      xBC ||
      paths.bound_c.shiftFractionAlong(
        Math.max(
          0,
          Math.min(
            projectPointOnBeam(
              paths.bound_c.start(),
              paths.bound_c.end(),
              paths.bound_a.start(),
              tol
            ),
            projectPointOnBeam(
              paths.bound_c.start(),
              paths.bound_c.end(),
              paths.bound_b.start(),
              tol
            )
          )
        )
      )
    points.xBDb =
      xBD ||
      paths.bound_b.shiftFractionAlong(
        Math.min(
          1,
          Math.min(
            projectPointOnBeam(
              paths.bound_b.start(),
              paths.bound_b.end(),
              paths.bound_c.end(),
              tol
            ),
            projectPointOnBeam(paths.bound_b.start(), paths.bound_b.end(), paths.bound_d.end(), tol)
          )
        )
      )
    points.xBDd =
      xBD ||
      paths.bound_d.shiftFractionAlong(
        Math.min(
          1,
          Math.min(
            projectPointOnBeam(
              paths.bound_d.start(),
              paths.bound_d.end(),
              paths.bound_a.end(),
              tol
            ),
            projectPointOnBeam(paths.bound_d.start(), paths.bound_d.end(), paths.bound_b.end(), tol)
          )
        )
      )

    // special case: if there are zero intersections, all bounds are parallel:
    // check whether one is inside the other (if not, these curves do not intersect)
    if (!(xAC || xAD || xBC || xBD)) {
      // project all starting points onto a perpendicular line
      points.CvsAB = projectPointOnBeam(
        paths.bound_a.start(),
        paths.bound_b.start(),
        paths.bound_c.start(),
        tol
      )
      points.DvsAB = projectPointOnBeam(
        paths.bound_a.start(),
        paths.bound_b.start(),
        paths.bound_d.start(),
        tol
      )

      if ((points.CvsAB < 0 && points.DvsAB < 0) || (points.CvsAB > 1 && points.DvsAB > 1)) {
        points.intersection = false
        break
      }
    }

    distToFirst = Math.min(
      paths.bound_a.start().dist(points.xACa),
      paths.bound_b.start().dist(points.xBCb)
    )
    distToLast = Math.min(
      paths.bound_a.end().dist(points.xADa),
      paths.bound_b.end().dist(points.xBDb)
    )

    console.log('distAB:', [distToFirst, distToLast])

    // NOTE: distance to intersection along the bound_ lines is guaranteed to be shorter than (or equal to) the length along the curve to that intersection, because a line is the shortest way to get from A to B
    // reduce the length by tol to account for both the tolerance itself and the fact that the bounds start tol/2 before the start of the curve
    halves = pathToCut.split(pathToCut.shiftAlong(distToFirst - tol, 1 / tol))
    paths.temp = halves[1].reverse()
    halves2 = halves[1].split(paths.temp.shiftAlong(distToLast - tol, 1 / tol))

    potentialIntersectionToCut = halves2[0]

    console.log(potentialIntersectionToCut)

    // TODO: calculate roughLength first to save time?
    // NOTE: several bezier operations use 100 segments, so 10 * tol ensures that these segments are an order of magnitude smaller than our tolerance
    if (potentialIntersectionToCut.length() < 10 * tol) {
      // if we're lucky, the middles are within tol of each other
      if (
        potentialIntersectionToCut
          .shiftFractionAlong(0.5)
          .sitsRoughlyOn(pathThatCuts.shiftFractionAlong(0.5), tol)
      ) {
        points.intersection = potentialIntersectionToCut.shiftFractionAlong(0.5) // got it!
        return points.intersection
      }
    }
    // } else { // TODO: add an elseif that splits the path in two if the remaining length is 'significant'

    // TODO: use angleBetween to determine which intersections are relevant here
    distToFirst = Math.min(
      paths.bound_c.start().dist(points.xACc),
      paths.bound_c.start().dist(points.xBCc),
      paths.bound_d.start().dist(points.xADd),
      paths.bound_d.start().dist(points.xBDd)
    )
    distToLast = Math.min(
      paths.bound_c.end().dist(points.xACc),
      paths.bound_c.end().dist(points.xBCc),
      paths.bound_d.end().dist(points.xADd),
      paths.bound_d.end().dist(points.xBDd)
    )

    // reduce the length by tol to account for both the tolerance itself and the fact that the bounds start tol/2 before the start of the curve
    halves = pathThatCuts.split(pathThatCuts.shiftAlong(distToFirst - tol, 1 / tol))
    paths.temp = halves[1].reverse()
    halves2 = halves[1].split(paths.temp.shiftAlong(distToLast - tol, 1 / tol))

    potentialIntersectionThatCuts = halves2[0]

    if (potentialIntersectionThatCuts.length() < tol) {
      points.intersection = potentialIntersectionThatCuts.shiftFractionAlong(0.5) // pick the middle
    } else if (
      potentialIntersectionToCut.length() < 10 * tol &&
      potentialIntersectionToCut
        .shiftFractionAlong(0.5)
        .sitsRoughlyOn(pathThatCuts.shiftFractionAlong(0.5), tol)
    ) {
      // if we're lucky, the middles are within tol of each other
      points.intersection = potentialIntersectionToCut.shiftFractionAlong(0.5) // got it!
      return points.intersection
    } else {
      // repeat the whole thing (recursive function)
      points.intersection = pathsIntersect(
        paths,
        points,
        potentialIntersectionToCut,
        potentialIntersectionThatCuts,
        tol
      )
    }
    // } else { // TODO: add an elseif that splits the path in two if the remaining length is 'significant'

    return points.intersection
  }
}
