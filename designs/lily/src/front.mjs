import { pluginBundle } from '@freesewing/plugin-bundle'
import { front as titanFront } from '@freesewing/titan'

function draftLilyFront({
  points,
  Point,
  paths,
  Path,
  measurements,
  options,
  complete,
  paperless,
  store,
  macro,
  utils,
  snippets,
  Snippet,
  sa,
  absoluteOptions,
  part,
}) {
  
  //TODO: update back so that matching to inseamBack and outseamBack works normally
  //TODO: update drawOutseam
  //TODO: implement stretch setting to replace ease
  
  /*
   * Helper method to draw the inseam path
   */
  const drawInseam = () => 
    new Path()
          .move(points.floorIn)
          .curve(points.floorInCp2, points.kneeInCp1, points.kneeIn)
          .curve(points.kneeInCp2, points.forkCp1, points.fork)
  /*
   * Helper method to draw the outseam path
   */
  const drawOutseam = () => {
    let waistOut = points.styleWaistOut || points.waistOut
      if (points.waistOut.x < points.seatOut.x)
        return new Path()
          .move(waistOut)
          .curve(points.seatOut, points.kneeOutCp1, points.kneeOut)
          .line(points.floorOut)
      else
        return new Path()
          .move(waistOut)
          ._curve(points.seatOutCp1, points.seatOut)
          .curve(points.seatOutCp2, points.kneeOutCp1, points.kneeOut)
          .line(points.floorOut)
  }

  /*
   * Helper method to draw the outline path
   */
  const drawPath = () => {
    let waistIn = points.styleWaistIn || points.waistIn
    let waistOut = points.styleWaistOut || points.waistOut
    return drawOutseam()
      .line(points.floorIn)
      .join(drawInseam())
      .curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart)
      .line(waistIn)
      .line(waistOut)
      .close()
  }
  /*
   * Helper method to calculate the length of the crotch seam
   */
  const crotchSeamDelta = () =>
    new Path()
      .move(points.waistIn)
      .line(points.crotchSeamCurveStart)
      .curve(points.crotchSeamCurveCp2, points.crotchSeamCurveCp1, points.fork)
      .length() - measurements.crossSeamFront
  /*
   * Helper method to (re)draw the crotch seam
   */
  const drawCrotchSeam = () => {
    points.crotchSeamCurveStart = points.waistIn.shiftFractionTowards(
      points.cfSeat,
      options.crotchSeamCurveStart
    )
    points.crotchSeamCurveMax = utils.beamsIntersect(
      points.waistIn,
      points.cfSeat,
      points.fork,
      points.fork.shift(0, 666)
    )
    points.crotchSeamCurveCp1 = points.fork
      .shiftFractionTowards(points.crotchSeamCurveMax, options.crotchSeamCurveBend)
      .rotate(options.crotchSeamCurveAngle * -1, points.fork)
    points.crotchSeamCurveCp2 = points.crotchSeamCurveStart.shiftFractionTowards(
      points.crotchSeamCurveMax,
      options.crotchSeamCurveBend
    )
    points.forkCp1 = points.crotchSeamCurveCp1.rotate(90, points.fork)
  }
  /*
   * Helper method to calculate the inseam delta
   */
  const inseamDelta = () => drawInseam().length() - store.get('inseamBack')
  /*
   * Helper method to calculate the outseam delta
   */
  const outseamDelta = () => drawOutseam().length() - store.get('outseamBack')
  /*
   * Helper method to lengthen/shorten both inseam and outseam
   */
  const adaptInseamAndOutseam = () => {
    let shift = [
      'kneeInCp2',
      'kneeOutCp1',
      'kneeIn',
      'kneeOut',
      'knee',
      'floorIn',
      'floorOut',
      'floor',
      'grainlineBottom',
    ]
    let delta = seamDelta()
    let run = 0
    do {
      run++
      for (const i of shift) points[i] = points[i].shift(90, delta)
      delta = seamDelta()
    } while (Math.abs(delta) > 1 && run < 10)
  }
  /*
   * Helper method to determine the delta common when both inseam and outseam
   * are either too long or too short
   */
  const seamDelta = () => {
    let inseam = inseamDelta()
    let outseam = outseamDelta()
    return Math.abs(inseam) > Math.abs(outseam) ? outseam : inseam
  }
  /*
   * Helper method that can fit either inseam or outseam
   */
  const adaptSeam = (side) => {
    const out = side === 'out' ? true : false
    let rotate = [
      'cfSeat',
      'crotchSeamCurveCp1',
      'crotchSeamCurveCp2',
      'crotchSeamCurveStart',
      'waistIn',
      'cfWaist',
      'waistOut',
    ]
    rotate.push(out ? 'seatOut' : 'fork')
    const deltaMethod = out ? outseamDelta : inseamDelta
    let run = 0
    let delta = deltaMethod()
    do {
      for (const i of rotate)
        points[i] = points[i].rotate(
          (delta / 10) * (out ? 1 : -1),
          points[out ? 'fork' : 'seatOut']
        )
      run++
      delta = deltaMethod()
    } while (Math.abs(delta) > 1 && run < 20)
  }
  const adaptOutseam = () => adaptSeam('out')
  const adaptInseam = () => adaptSeam('in')
  
  console.log('test')

  // majority of points re-used from titan

/*   // Let's get to work
  points.waistX = new Point(measurements.waistFrontArc * (1 + options.waistEase), 0)
  points.upperLegY = new Point(0, measurements.waistToUpperLeg)
  points.seatX = new Point(measurements.seatFrontArc * (1 + options.seatEase), 0)
  points.seatY = new Point(0, measurements.waistToSeat)
  points.seatOut = points.seatY
  points.cfSeat = new Point(points.seatX.x, points.seatY.y)

  // Determine fork width
  points.fork = new Point(
    measurements.seatFrontArc * (1 + options.seatEase) * 1.25,
    points.upperLegY.y * (1 + options.crotchDrop)
  )

  // Grainline location, map out center of knee and floor
  points.grainlineTop = points.upperLegY.shiftFractionTowards(
    points.fork,
    options.grainlinePosition
  )
  points.knee = new Point(points.grainlineTop.x, measurements.waistToKnee)
  points.floor = new Point(
    points.grainlineTop.x,
    measurements.waistToFloor * (1 + options.lengthBonus)
  )
  points.grainlineBottom = points.floor

  // Figure out width at the knee
  let halfKnee = store.get('kneeFront') / 2
  points.kneeOut = points.knee.shift(180, halfKnee)
  points.kneeIn = points.kneeOut.flipX(points.knee) */
  
  console.log('test2')

  // shape at the ankle (unlike titan)
  let halfAnkle = measurements.ankle / 4
  points.floorOut = points.floor.shift(180, halfAnkle)
  points.floorIn = points.floorOut.flipX(points.floor)
  
  console.log('ankle')

  // Control points to shape the legs towards the seat
  points.floorInCp2 = points.floorIn.shift(90,points.knee.dy(points.floor) / 3)
  points.kneeInCp1 = points.kneeIn.shift(90, -points.knee.dy(points.floor) / 3)
  
  // other control points have already been calculated in titan
/*   points.kneeInCp2 = points.kneeIn.shift(90, points.fork.dy(points.knee) / 3)
  points.kneeOutCp1 = points.kneeOut.shift(90, points.fork.dy(points.knee) / 3)
  points.seatOutCp1 = points.seatOut.shift(
    90,
    measurements.waistToHips * options.waistHeight + absoluteOptions.waistbandWidth
  )
  points.seatOutCp2 = points.seatOut.shift(-90, points.seatOut.dy(points.knee) / 3) */
  
  console.log('control points')

  // Balance the waist
  let delta = points.waistX.dx(points.cfSeat)
  let width = points.waistX.x
  points.waistOut = new Point(delta * options.waistBalance, 0)
  points.waistIn = points.waistOut.shift(0, width)
  points.cfWaist = points.waistIn

  // Draw initial crotch seam
  drawCrotchSeam()

  // Uncomment this to see the outline prior to fitting the crotch seam
  //paths.seam1 = drawPath().attr('class', 'dashed lining')

  if (options.fitCrossSeam && options.fitCrossSeamFront) {
    let delta = crotchSeamDelta()
    let rotate = ['waistIn', 'waistOut', 'cfWaist']
    let run = 0
    do {
      run++
      // Remedy A: Slash and spread
      for (const i of rotate) points[i] = points[i].rotate(delta / -15, points.seatOut)
      // Remedy B: Nudge the fork inwards/outwards
      points.fork = points.fork.shift(180, delta / 5)
      drawCrotchSeam()
      delta = crotchSeamDelta()
      // Uncomment the line below this to see all iterations
      // paths[`try${run}`] = drawPath().attr('class', 'dotted')
    } while (Math.abs(delta) > 1 && run < 15)
  }

  // Uncomment this to see the outline prior to fitting the inseam & outseam
  paths.seam2 = drawPath().attr('class', 'dotted interfacing')

  /*
   * With the cross seams matched back and front,
   * all that's left is to match the inseam and outseam
   */

  // When both are too short/long, adapt the leg length
  if ((inseamDelta() < 0 && outseamDelta() < 0) || (inseamDelta() > 0 && outseamDelta() > 0))
    adaptInseamAndOutseam()

  // Now one is ok, the other will be adapted
  adaptOutseam()
  adaptInseam()

  // Changing one will ever so slightly impact the other, so let's run both again to be sure
  adaptOutseam()
  adaptInseam()

  // Only now style the waist lower if requested
  if (options.waistHeight < 1 || absoluteOptions.waistbandWidth > 0) {
    points.styleWaistOut = drawOutseam().shiftAlong(
      measurements.waistToHips * (1 - options.waistHeight) + absoluteOptions.waistbandWidth
    )
    points.styleWaistIn = utils.beamsIntersect(
      points.styleWaistOut,
      points.styleWaistOut.shift(points.waistOut.angle(points.waistIn), 10),
      points.waistIn,
      points.crotchSeamCurveStart
    )
  } else {
    points.styleWaistIn = points.waistIn.clone()
    points.styleWaistOut = points.waistOut.clone()
  }

  // Seamline
  paths.seam = drawPath().attr('class', 'fabric')

  if (complete) {
    points.grainlineTop.y = points.styleWaistIn.y
    macro('grainline', {
      from: points.grainlineTop,
      to: points.grainlineBottom,
    })
    points.logoAnchor = new Point(points.crotchSeamCurveStart.x / 2, points.fork.y)
    snippets.logo = new Snippet('logo', points.logoAnchor)
    points.titleAnchor = points.logoAnchor.shift(-90, 60)
    macro('title', {
      nr: 2,
      title: 'front',
      at: points.titleAnchor,
    })
    /*
    //notches
    if (options.fitGuides) {
      points.waistMid = points.waistOut.shiftFractionTowards(points.waistIn, 0.5)
      points.seatMid = points.waistMid
        .shiftTowards(points.waistOut, measurements.waistToSeat)
        .rotate(90, points.waistMid)
      points.seatInTarget = points.seatOut.shiftOutwards(points.seatMid, measurements.seat / 4)
      points.seatOutTarget = points.seatMid.shiftTowards(points.seatOut, measurements.seat / 4)
      points.hipsInTarget = points.waistIn
        .shiftTowards(points.waistOut, measurements.waistToHips)
        .rotate(90, points.waistIn)
      points.hipsOutTarget = points.waistOut
        .shiftTowards(points.waistIn, measurements.waistToHips)
        .rotate(-90, points.waistOut)
      points.hipsIn = utils.beamsIntersect(
        points.hipsOutTarget,
        points.hipsInTarget,
        points.waistIn,
        points.crotchSeamCurveStart
      )
      points.crotchSeamCurveStartMid = utils.beamsIntersect(
        points.crotchSeamCurveStart,
        points.crotchSeamCurveStart.shift(points.waistIn.angle(points.waistOut), 1),
        points.waistMid,
        points.seatMid
      )
      if (points.seatMid.y > points.crotchSeamCurveStartMid.y) {
        points.seatIn = utils.lineIntersectsCurve(
          points.seatMid,
          points.seatInTarget,
          points.fork,
          points.crotchSeamCurveCp1,
          points.crotchSeamCurveCp2,
          points.crotchSeamCurveStart
        )
      } else {
        points.seatIn = utils.beamsIntersect(
          points.seatMid,
          points.seatInTarget,
          points.crotchSeamCurveStart,
          points.waistIn
        )
      }
      if (options.fitKnee) {
        if (points.waistOut.x < points.seatOut.x) {
          points.hipsOut = utils.lineIntersectsCurve(
            points.hipsOutTarget,
            points.hipsIn.rotate(180, points.hipsOutTarget),
            points.waistOut,
            points.seatOut,
            points.kneeOutCp1,
            points.kneeOut
          )
          points.seatOutNotch = utils.lineIntersectsCurve(
            points.seatMid,
            points.seatOutTarget,
            points.waistOut,
            points.seatOut,
            points.kneeOutCp1,
            points.kneeOut
          )
        } else {
          points.hipsOut = utils.lineIntersectsCurve(
            points.hipsOutTarget,
            points.hipsIn.rotate(180, points.hipsOutTarget),
            points.waistOut,
            points.waistOut,
            points.seatOutCp1,
            points.seatOut
          )
          points.seatOutNotch = points.seatOut
        }
        points.kneeOutNotch = points.kneeOut
        points.kneeInNotch = points.kneeIn
      } else {
        if (points.waistOut.x < points.seatOut.x) {
          points.hipsOut = utils.lineIntersectsCurve(
            points.hipsOutTarget,
            points.hipsIn.rotate(180, points.hipsOutTarget),
            points.waistOut,
            points.seatOut,
            points.kneeOutCp1,
            points.floorOut
          )
          points.seatOutNotch = utils.lineIntersectsCurve(
            points.seatMid,
            points.seatOutTarget,
            points.waistOut,
            points.seatOut,
            points.kneeOutCp1,
            points.floorOut
          )
          points.kneeOutNotch = utils.lineIntersectsCurve(
            points.kneeOut,
            points.kneeIn.rotate(180, points.kneeOut),
            points.waistOut,
            points.seatOut,
            points.kneeOutCp1,
            points.floorOut
          )
        } else {
          points.hipsOut = utils.lineIntersectsCurve(
            points.hipsOutTarget,
            points.hipsIn.rotate(180, points.hipsOutTarget),
            points.waistOut,
            points.waistOut,
            points.seatOutCp1,
            points.seatOut
          )
          points.seatOutNotch = points.seatOut
          points.kneeOutNotch = utils.lineIntersectsCurve(
            points.kneeOut,
            points.kneeIn.rotate(180, points.kneeOut),
            points.seatOut,
            points.seatOutCp2,
            points.kneeOutCp1,
            points.floorOut
          )
        }
        points.kneeInNotch = utils.lineIntersectsCurve(
          points.kneeIn,
          points.kneeOut.rotate(180, points.kneeIn),
          points.floorIn,
          points.kneeInCp2,
          points.forkCp1,
          points.fork
        )
      }
      macro('sprinkle', {
        snippet: 'notch',
        on: ['crotchSeamCurveStart', 'seatIn', 'seatOutNotch', 'kneeInNotch', 'kneeOutNotch'],
      })
      paths.seatline = new Path()
        .move(points.seatOutNotch)
        .line(points.seatIn)
        .attr('class', 'fabric help')
        .attr('data-text', 'Seat Line')
        .attr('data-text-class', 'center')
      if (
        measurements.waistToHips * (1 - options.waistHeight) + absoluteOptions.waistbandWidth <
        measurements.waistToHips
      ) {
        macro('sprinkle', {
          snippet: 'notch',
          on: ['hipsIn', 'hipsOut'],
        })
        paths.hipline = new Path()
          .move(points.hipsOut)
          .line(points.hipsIn)
          .attr('class', 'fabric help')
          .attr('data-text', 'Hip Line')
          .attr('data-text-class', 'center')
      }
    }
    */
    if (sa) {
      paths.saBase = drawInseam()
        .join(
          new Path()
            .move(points.fork)
            .curve(
              points.crotchSeamCurveCp1,
              points.crotchSeamCurveCp2,
              points.crotchSeamCurveStart
            )
            .line(points.styleWaistIn)
            .line(points.styleWaistOut)
        )
        .join(drawOutseam())
      paths.hemBase = new Path().move(points.floorOut).line(points.floorIn)
      paths.sa = paths.hemBase
        .offset(sa * 3)
        .join(paths.saBase.offset(sa))
        .close()
        .attr('class', 'fabric sa')
      paths.saBase.hide()
      paths.hemBase.hide()
    }

    if (paperless && options.titanPaperless) {
      // Help construct crotch seam
      paths.hint = new Path()
        .move(points.crotchSeamCurveStart)
        .line(points.crotchSeamCurveMax)
        .line(points.fork)
        .attr('class', 'note lashed')
      macro('hd', {
        from: points.floorOut,
        to: points.floor,
        y: points.floorIn.y - 15,
      })
      macro('hd', {
        from: points.floor,
        to: points.floorIn,
        y: points.floorIn.y - 15,
      })
      macro('hd', {
        from: points.floorOut,
        to: points.floorIn,
        y: points.floorIn.y - 30,
      })
      macro('vd', {
        from: points.floorOut,
        to: points.fork,
        x: points.fork.x + sa + 15,
      })
      macro('vd', {
        from: points.fork,
        to: points.styleWaistIn,
        x: points.fork.x + sa + 15,
      })
      macro('vd', {
        from: points.floorIn,
        to: points.styleWaistOut,
        x:
          (points.seatOut.x < points.styleWaistOut.x ? points.seatOut.x : points.styleWaistOut.x) -
          sa -
          15,
      })
      macro('vd', {
        from: points.crotchSeamCurveStart,
        to: points.styleWaistIn,
        x: points.crotchSeamCurveStart.x + sa + 15,
      })
      macro('hd', {
        from: points.seatOut,
        to: points.grainlineTop,
        y: points.styleWaistIn.y - sa - 15,
      })
      if (points.styleWaistOut.x < points.seatOut.x) {
        macro('hd', {
          from: points.styleWaistOut,
          to: points.grainlineTop,
          y: points.styleWaistIn.y - sa - 30,
        })
      }
      macro('hd', {
        from: points.grainlineTop,
        to: points.styleWaistIn,
        y: points.styleWaistIn.y - sa - 15,
      })
      macro('hd', {
        from: points.grainlineTop,
        to: points.crotchSeamCurveStart,
        y: points.styleWaistIn.y - sa - 30,
      })
      macro('hd', {
        from: points.grainlineTop,
        to: points.crotchSeamCurveMax,
        y: points.styleWaistIn.y - sa - 45,
      })
      macro('hd', {
        from: points.grainlineTop,
        to: points.fork,
        y: points.styleWaistIn.y - sa - 60,
      })
    }
  }

  return part
}

export const front = {
  name: 'lily.front',
  from: titanFront,
  measurements: [
    'ankle',
  ],
  options: {
    fitGuides: true,
  },
  draft: draftLilyFront,
}
