import { pluginBundle } from '@freesewing/plugin-bundle'
import { back as titanBack } from '@freesewing/titan'
//import { front as titanFront } from '@freesewing/titan'

function draftLilyBack({
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
  
  //TODO: implement stretch setting to replace ease
  //TODO: rework length bonus (Titan assumes knee-to-ankle section is straight)
  
  
  //console.log('option test has value:',units(options.test))
  // work-around: have user set ease values based on fabric stretch
  let stretchAsEase = -options.fabricStretch/10
  //log.info("set waist ease, seat ease and knee ease to " + stretchAsEase)
  //log.info("set waist ease, seat ease and knee ease to " + -0.04)
  //log.info(`string text ${5} string text`)
  
  /*
   * Helper method to draw the inseam path
   */
  const drawInseam = () =>
    new Path()
          .move(points.fork)
          .curve(points.forkCp2, points.kneeInCp1, points.kneeIn)
          .curve(points.kneeInCp2, points.floorInCp2, points.floorIn)
  /*
   * Helper method to draw the outseam path
   */
  const drawOutseam = () => {
    let waistOut = points.styleWaistOutLily || points.waistOut
      if (points.waistOut.x > points.seatOut.x)
        return new Path()
          .move(points.floorOut)
          .curve(points.floorOutCp2,points.kneeOutCp1,points.kneeOut)
          .curve(points.kneeOutCp2, points.seatOut, waistOut)
      else
        return new Path()
          .move(points.floorOut)
          .curve(points.floorOutCp2,points.kneeOutCp1,points.kneeOut)
          .curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut)
          .curve_(points.seatOutCp2, waistOut)
  }  
  /*
   * Helper method to draw the outline path
   */
  const drawPath = () => {
    let waistIn = points.styleWaistInLily || points.waistIn
    return drawInseam()
      .line(points.floorOut)
      .join(drawOutseam())
      .line(waistIn)
      .line(points.crossSeamCurveStart)
      .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
      .close()
  }
  /*
   * Helper method to calculate the length of the cross seam
   */
  const crossSeamDelta = () =>
    new Path()
      .move(points.waistIn)
      .line(points.crossSeamCurveStart)
      .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
      .length() - measurements.crossSeamBack
  /*
   * Helper method to (re)draw the cross seam
   */
  const drawCrossSeam = () => {
    points.crossSeamCurveStart = points.waistIn.shiftFractionTowards(
      points.cbSeat,
      options.crossSeamCurveStart
    )
    points.crossSeamCurveMax = utils.beamsIntersect(
      points.waistIn,
      points.cbSeat,
      points.fork,
      points.fork.shift(0, 1) // beams have infinite length anyway
    )
    points.crossSeamCurveCp1 = points.crossSeamCurveStart.shiftFractionTowards(
      points.crossSeamCurveMax,
      options.crossSeamCurveBend
    )
    points.crossSeamCurveCp2 = points.fork
      .shiftFractionTowards(points.crossSeamCurveMax, options.crossSeamCurveBend)
      .rotate(options.crossSeamCurveAngle, points.fork)
  }

  // majority of points re-used from titan

/*   // Let's get to work
  points.waistX = new Point(-1 * measurements.waistBackArc * (1 + options.waistEase), 0)
  points.upperLegY = new Point(0, measurements.waistToUpperLeg)
  points.seatX = new Point(-1 * measurements.seatBackArc * (1 + options.seatEase), 0)
  points.seatY = new Point(0, measurements.waistToSeat)
  points.seatOut = points.seatY
  points.cbSeat = new Point(points.seatX.x, points.seatY.y)

  // Determine fork location
  points.fork = new Point(
    measurements.seatBackArc * (1 + options.seatEase) * -1.25,
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
  let kneeTotal = measurements.knee * (1 + options.kneeEase)
  if (!options.fitKnee) {
    // Based the knee width on the seat, unless that ends up being less
    let altKneeTotal = measurements.seatFront
    if (altKneeTotal > kneeTotal) kneeTotal = altKneeTotal
  }
  // Store for re-use in front part
  store.set('kneeTotal', kneeTotal)
  store.set('kneeBack', kneeTotal * options.legBalance)
  store.set('kneeFront', kneeTotal * (1 - options.legBalance))
  let halfKnee = store.get('kneeBack') / 2
  points.kneeOut = points.knee.shift(0, halfKnee)
  points.kneeIn = points.kneeOut.flipX(points.knee) */

  // shape at the ankle (unlike titan)
  let halfAnkle
  if (measurements.ankle * (1 + options.fabricStretch) > measurements.heel) {
    console.log('using ankle measurement')
    //let halfAnkle = (1 + stretchAsEase) * (measurements.ankle / 4)
    halfAnkle = (1 - options.fabricStretch/10) * (measurements.ankle / 4)
  } else {
    // ensure that stretched fabric will accommodate ankle
    console.log('overriding ankle measurement to accommodate heel (lower leg is broader now)')
    halfAnkle = (measurements.heel / 4) / (1 + options.fabricStretch)
  }
    
  points.floorOut = points.floor.shift(0, halfAnkle)
  points.floorIn = points.floorOut.flipX(points.floor)   
  
  store.set('halfAnkle',halfAnkle)
  
  points.floorInCp2 = points.floorIn.shift(90,points.knee.dy(points.floor) / 3)
  points.kneeInCp2 = points.kneeIn.shift(90, -points.knee.dy(points.floor) / 3)
  points.floorOutCp2 = points.floorOut.shift(90,points.knee.dy(points.floor) / 3)
  points.kneeOutCp1 = points.kneeOut.shift(90, -points.knee.dy(points.floor) / 3)  

  // other control points have already been calculated in titan
/*   // Control points to shape the legs towards the seat
  points.kneeInCp1 = points.kneeIn.shift(90, points.fork.dy(points.knee) / 3)
  points.kneeOutCp2 = points.kneeOut.shift(90, points.fork.dy(points.knee) / 3)
  points.seatOutCp1 = points.seatOut.shift(-90, points.seatOut.dy(points.knee) / 3)
  points.seatOutCp2 = points.seatOut.shift(90, points.seatOut.y / 2) */

/*   // Balance the waist
  if (points.cbSeat.x < points.waistX.x) {
    let delta = points.cbSeat.dx(points.waistX)
    points.waistIn = points.waistX.shift(180, delta * (1 - options.waistBalance))
  } else points.waistIn = points.waistX
  let width = points.waistX.x
  points.waistOut = points.waistIn.shift(180, width) */

  // Cross seam
  drawCrossSeam()

  //Uncomment the line below to see the seam prior to fitting the cross seam
  // paths.seam1 = drawPath().attr('class', 'dashed lining')

  // Should we fit the cross seam?
  if (options.fitCrossSeam && options.fitCrossSeamBack) {
    let rotate = ['waistIn', 'waistOut']
    let delta = crossSeamDelta()
    let run = 0
    do {
      run++
      // Remedy A: Slash and spread
      for (const i of rotate) points[i] = points[i].rotate(delta / 15, points.seatOut)
      // Remedy B: Nudge the fork inwards/outwards
      points.fork = points.fork.shift(0, delta / 5)
      points.forkCp2 = points.crossSeamCurveCp2.rotate(-90, points.fork)
      drawCrossSeam()
      delta = crossSeamDelta()
      // Uncomment the line beloe this to see all iterations
      // paths[`try${run}`] = drawPath().attr('class', 'dotted')
    } while (Math.abs(delta) > 1 && run < 15)
  }

  // Store inseam & outseam length
  store.set('inseamBack', drawInseam().length())
  store.set('outseamBack', drawOutseam().length())

  // Only now style the waist lower if requested
  // Note: redo this for lily even though it was already done for titan;
  //  calculation for titan happened using its own seam lengths              
  store.set('waistbandWidth', absoluteOptions.waistbandWidth) // used in lilyWaistband
  if (options.waistHeight < 1 || absoluteOptions.waistbandWidth > 0) {
    points.styleWaistOutLily = drawOutseam()
      .reverse()
      .shiftAlong(
        measurements.waistToHips * (1 - options.waistHeight) + absoluteOptions.waistbandWidth
      )
    points.styleWaistInLily = utils.beamsIntersect(
      points.styleWaistOutLily,
      points.styleWaistOutLily.shift(points.waistOut.angle(points.waistIn), 10),
      points.waistIn,
      points.crossSeamCurveStart
    )
  } else {
    points.styleWaistInLily = points.waistIn.clone()
    points.styleWaistOutLily = points.waistOut.clone()
  }
  // Adapt the vertical placement of the seat control point to the lowered waist
  points.seatOutCp2.y = points.seatOut.y - points.styleWaistOutLily.dy(points.seatOut) / 2
  let test = points.styleWaistInLily.dist(points.styleWaistOutLily)
  console.log('back waist length',test)
  store.set('backWaist', points.styleWaistInLily.dist(points.styleWaistOutLily))

  // Paths
  paths.seam = drawPath().attr('class', 'fabric')

  if (complete) {
    points.grainlineTop.y = points.styleWaistOutLily.y
    macro('grainline', {
      from: points.grainlineTop,
      to: points.grainlineBottom,
    })
    macro('scalebox', { at: points.knee })
    points.logoAnchor = new Point(points.crossSeamCurveStart.x / 2, points.fork.y)
    snippets.logo = new Snippet('logo', points.logoAnchor)
    points.titleAnchor = points.logoAnchor.shift(-90, 60)
    macro('title', {
      nr: 1,
      title: 'back',
      at: points.titleAnchor,
    })
    
    //notches
    //if (options.fitGuides) {
    if (true) {
      points.waistMid = points.waistOut.shiftFractionTowards(points.waistIn, 0.5)
      // shift + rotate (below) is equivalent to shifting measurements.waistToSeat perpendicular to the waistIn-waistMid line
      points.seatMid = points.waistMid
        .shiftTowards(points.waistIn, measurements.waistToSeat)
        .rotate(90, points.waistMid) 
      points.seatInTarget = points.seatOut.shiftOutwards(points.seatMid, measurements.seat / 4)
      points.seatOutTarget = points.seatMid.shiftTowards(points.seatOut, measurements.seat / 4)
      // shift + rotate (below) is equivalent to shifting measurements.waistToHips perpendicular to the waistIn-waistOut line
      points.hipsInTarget = points.waistIn
        .shiftTowards(points.waistOut, measurements.waistToHips)
        .rotate(-90, points.waistIn)
      points.hipsOutTarget = points.waistOut
        .shiftTowards(points.waistIn, measurements.waistToHips)
        .rotate(90, points.waistOut)
      points.hipsIn = utils.beamsIntersect(
        points.hipsOutTarget,
        points.hipsInTarget,
        points.waistIn,
        points.crossSeamCurveStart
      )
      points.crossSeamCurveStartMid = utils.beamsIntersect(
        points.crossSeamCurveStart,
        points.crossSeamCurveStart.shift(points.waistIn.angle(points.waistOut), 1),
        points.waistMid,
        points.seatMid
      )
      if (points.seatMid.y > points.crossSeamCurveStartMid.y) {
        points.seatIn = utils.lineIntersectsCurve(
          points.seatMid,
          points.seatInTarget,
          points.crossSeamCurveStart,
          points.crossSeamCurveCp1,
          points.crossSeamCurveCp2,
          points.fork
        )
      } else {
        points.seatIn = utils.beamsIntersect(
          points.seatMid,
          points.seatInTarget,
          points.waistIn,
          points.crossSeamCurveStart
        )
      }
        if (points.waistOut.x > points.seatOut.x) {
          points.hipsOut = utils.lineIntersectsCurve(
            points.hipsOutTarget,
            points.hipsIn.rotate(180, points.hipsOutTarget),
            points.kneeOut,
            points.kneeOutCp2,
            points.seatOut,
            points.waistOut
          )
          points.seatOutNotch = utils.lineIntersectsCurve(
            points.seatMid,
            points.seatOutTarget,
            points.kneeOut,
            points.kneeOutCp2,
            points.seatOut,
            points.waistOut
          )
        } else {
          points.hipsOut = utils.lineIntersectsCurve(
            points.hipsOutTarget,
            points.hipsIn.rotate(180, points.hipsOutTarget),
            points.seatOut,
            points.seatOutCp2,
            points.waistOut,
            points.waistOut
          )
          points.seatOutNotch = points.seatOut
        }
        points.kneeOutNotch = points.kneeOut
        points.kneeInNotch = points.kneeIn
      macro('sprinkle', {
        snippet: 'notch',
        on: ['seatOutNotch', 'kneeInNotch', 'kneeOutNotch'],
      })
      macro('sprinkle', {
        snippet: 'bnotch',
        on: ['crossSeamCurveStart', 'seatIn'],
      })
      paths.seatline = new Path()
        .move(points.seatIn)
        .line(points.seatOutNotch)
        .attr('class', 'fabric help')
        .attr('data-text', 'Seat Line')
        .attr('data-text-class', 'center')
      if (
        measurements.waistToHips * (1 - options.waistHeight) + absoluteOptions.waistbandWidth <
        measurements.waistToHips
      ) {
        snippets.hipsIn = new Snippet('bnotch', points.hipsIn)
        snippets.hipsOut = new Snippet('notch', points.hipsOut)
        paths.hipline = new Path()
          .move(points.hipsIn)
          .line(points.hipsOut)
          .attr('class', 'fabric help')
          .attr('data-text', 'Hip Line')
          .attr('data-text-class', 'center')
      }
    }
   
    if (sa) {
      paths.saBase = drawOutseam()
        .join(
          new Path()
            .move(points.styleWaistOutLily)
            .line(points.styleWaistInLily)
            .line(points.crossSeamCurveStart)
            .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
        )
        .join(drawInseam())
      paths.hemBase = new Path().move(points.floorIn).line(points.floorOut)
      paths.sa = paths.hemBase
        .offset(sa * 3)
        .join(paths.saBase.offset(sa))
        .close()
        .attr('class', 'fabric sa')
      paths.saBase.hide()
      paths.hemBase.hide()
    }

    if (paperless && options.titanPaperless) {
      // Help construct cross seam
      paths.hint = new Path()
        .move(points.crossSeamCurveStart)
        .line(points.crossSeamCurveMax)
        .line(points.fork)
        .attr('class', 'note lashed')
      macro('hd', {
        from: points.floorIn,
        to: points.floorOut,
        y: points.floorIn.y - 30,
      })
      macro('hd', {
        from: points.floorIn,
        to: points.floor,
        y: points.floorIn.y - 15,
      })
      macro('hd', {
        from: points.floor,
        to: points.floorOut,
        y: points.floorIn.y - 15,
      })
      macro('vd', {
        from: points.floorOut,
        to: points.styleWaistOutLily,
        x:
          (points.seatOut.x > points.styleWaistOutLily.x ? points.seatOut.x : points.styleWaistOutLily.x) +
          sa +
          15,
      })
      macro('vd', {
        from: points.floorIn,
        to: points.fork,
        x: points.fork.x - sa - 15,
      })
      macro('vd', {
        from: points.fork,
        to: points.styleWaistInLily,
        x: points.fork.x - sa - 15,
      })
      macro('vd', {
        from: points.floorIn,
        to: points.styleWaistInLily,
        x: points.fork.x - sa - 30,
      })
      macro('vd', {
        from: points.crossSeamCurveStart,
        to: points.styleWaistInLily,
        x: points.crossSeamCurveStart.x - sa - 15,
      })
      macro('hd', {
        from: points.styleWaistInLily,
        to: points.grainlineTop,
        y: points.styleWaistInLily.y - sa - 15,
      })
      macro('hd', {
        from: points.crossSeamCurveStart,
        to: points.grainlineTop,
        y: points.styleWaistInLily.y - sa - 30,
      })
      macro('hd', {
        from: points.crossSeamCurveMax,
        to: points.grainlineTop,
        y: points.styleWaistInLily.y - sa - 45,
      })
      macro('hd', {
        from: points.fork,
        to: points.grainlineTop,
        y: points.styleWaistInLily.y - sa - 60,
      })
      macro('hd', {
        from: points.grainlineTop,
        to: points.styleWaistOutLily,
        y: points.styleWaistInLily.y - sa - 15,
      })
      if (points.seatOut.x > points.styleWaistOutLily.x) {
        macro('hd', {
          from: points.grainlineTop,
          to: points.seatOut,
          y: points.styleWaistInLily.y - sa - 30,
        })
      }
    }
  }

  return part
}

export const back = {
  name: 'lily.back',
  from: titanBack,
  //after: titanFront,
  measurements: [
    'ankle',
    'heel', // secondary measurement, used instead of ankle
  ],
  options: {
    fitGuides: {bool: true, menu: undefined},
    fitKnee: {bool: true, menu: undefined},
    legBalance: 0.5, // between back and front parts
    waistBalance: 0.5,
    fabricStretch: { pct: 40, min: 0, max: 50, menu: 'fit' },
    waistEase: {pct: -4,  menu: undefined}, // -fabricStretch/10,
    seatEase: {pct: -4, menu: undefined}, // -fabricStretch/10,
    kneeEase: {pct: -4, menu: undefined}, // -fabricStretch/10,
    test: {pct: ({ options }) => (options.fabricStretch/2)}
    },
  hideDependencies: true,
  draft: draftLilyBack,
}
