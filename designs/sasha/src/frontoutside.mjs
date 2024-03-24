import { frontOutside as nobleFrontOutside } from '@freesewing/noble'
import { frontInside as sashaFrontInside } from '@freesewing/sasha'

/* // method to cut a (closed) path in two pieces using a second path (rest of the path is discarded)
const chopPath = (pathToCut, pathThatCuts) => {
	let intersections = pathToCut.intersects(pathThatCuts)
	
	if (~intersections) {// no intersections found
		return pathToCut
	} else if ( length(intersections) ~= 2 ) {
		log.error("could not chop path; more than two intersections found")
	} else {
		 */

export const frontOutside = {
  name: 'sasha.frontOutside',
  from: nobleFrontOutside,
  after: sashaFrontInside,
  hide: { from: true },
  measurements: ['waistToHips', 'shoulderToWrist', 'hpsToWaistBack'],
  options: {
    pocketCurve: { pct: 54, min: 0, max: 100, menu: 'style' }, //54% just looks good to me
    pocketOpeningHeight: { pct: 65, min: 0, max: 150, menu: 'style' }, // default is rather arbitrary
  },
  draft: ({
    store,
    sa,
    points,
    Path,
    paths,
    Snippet,
    snippets,
    options,
    macro,
    measurements,
    utils,
    log,
    part,
  }) => {
    // Hide Noble paths
    for (const key of Object.keys(paths)) paths[key].hide()
    // for (const i in snippets) delete snippets[i] // keep the notches etc

    // take Noble paths, split into convenient pieces
    // NOTE: nobleFrontOutside is drawn from waistDartLeft to sideHem to armhole (etc)
    const halvesA = paths.seam.split(points.sideHem)

    const nobleRest = halvesA[1]

    // skirt portion consists of a rectangle and a 'godet' (but as one piece)
    points.sideSkirtHem = points.sideHem.shift(270, store.get('skirtLength'))
    points.godetStart = points.waistDartRight.shift(270, store.get('skirtLength'))
    points.godetEnd = points.waistDartRight.shift(
      270 - store.get('skirtDartAngle'),
      store.get('skirtLength')
    )

    // start drawing the path at bottom left, which is the 'end' of the godet
    paths.seam = new Path()
      .move(points.godetEnd)
      .curve(
        points.godetEnd.shift(
          -store.get('skirtDartAngle'),
          points.godetEnd.dist(points.godetStart) / 3
        ),
        points.godetStart.shift(180, points.godetStart.dist(points.godetEnd) / 3),
        points.godetStart
      )
      .move(points.sideSkirtHem)
      .join(nobleRest)
      .close()

    // mark the waist line with notches
    macro('sprinkle', {
      snippet: 'notch',
      on: ['sideHem', 'waistDartRight'],
    })

    // now cut this in half to insert the pocket
    // base position is wrist height, approximated by assuming shoulder and hps are same height
    const waistToWrist = measurements.shoulderToWrist - measurements.hpsToWaistBack
    const pocketHeight = options.pocketOpeningHeight * measurements.waistToHips
    points.pocketStart = utils.beamsIntersect(
      points.waistDartRight,
      points.godetEnd,
      points.sideHemInitial.shift(0, 1).shift(270, waistToWrist - pocketHeight),
      points.sideHemInitial.shift(180, 1).shift(270, waistToWrist - pocketHeight)
    )

    points.pocketEnd = utils.beamsIntersect(
      points.sideHem,
      points.sideSkirtHem,
      points.sideHemInitial.shift(0, 1).shift(270, waistToWrist),
      points.sideHemInitial.shift(180, 1).shift(270, waistToWrist)
    )

    const pocketWidth = -points.pocketStart.dx(points.pocketEnd)
    store.set('pocketWidth', pocketWidth)

    points.cpPocket = points.pocketEnd.shift(0, options.pocketCurve * pocketWidth)

    paths.pocketOpening = new Path()
      .move(points.pocketStart)
      ._curve(points.cpPocket, points.pocketEnd)

    /* 		// TODO: turn this into a macro
    let pathToCut = new Path()
      .move(points.waistDartRight)
      .line(points.godetEnd)
    //let pathToCut = paths.seam.translate(0.001,0.001)
    // let pathThatCuts = new Path()
      // .move(points.pocketStart.shift(0,pocketWidth/10))
      // .line(points.pocketEnd.shift(180,pocketWidth/10))
    let pathThatCuts = paths.pocketOpening
    paths.pathThatCuts = pathThatCuts
    
    let opToCut = pathToCut.ops[1]
    let opThatCuts = pathThatCuts.ops[1]
    
    console.log(opToCut)
    
    let temp_points
    if (opToCut.type === 'line') {
      paths.bound_a = pathToCut
      paths.bound_b = pathToCut
    } else {
      temp_points = [opToCut.cp1, opToCut.cp2, opToCut.to]
      temp_points.sort((a, b) => a.slope(pathToCut.start) - b.slope(pathToCut.start))
    
      console.log(temp_points)
      
    
      points.A = temp_points[0].clone()
      points.B = temp_points[2].clone()
    
      paths.bound_a = new Path()
        .move(temp_points[0])
        .line(temp_points[0].shiftTowards(pathToCut.start,10))
      paths.bound_b = new Path()
        .move(temp_points[2])
        .line(temp_points[2].shiftTowards(pathToCut.start,10))      
    }
    if (opThatCuts.type === 'line') {
      paths.bound_c = pathThatCuts
      paths.bound_d = pathThatCuts
    } else {
      temp_points = [opThatCuts.cp1, opThatCuts.cp2, opThatCuts.to]
      //temp_points.sort((a, b) => a.slope(pathThatCuts.start) - b.slope(pathThatCuts.start))
    
      paths.bound_c = new Path()
        .move(temp_points[0])
        .line(temp_points[0].shiftTowards(pathThatCuts.start,10))
      paths.bound_d = new Path()
        .move(temp_points[2])
        .line(temp_points[2].shiftTowards(pathThatCuts.start,10))      
      paths.bound_e = new Path()
        .move(temp_points[1])
        .line(temp_points[1].shiftTowards(pathThatCuts.start,10))
    }    
    
    // TODO: specify path sections and use utils.curvesIntersect
    let intersections = pathToCut.intersects(pathThatCuts)
    
    if (~intersections) {// no intersections found
      // return pathToCut
      log.info('no intersection found')
    } else if ( length(intersections) != 2 ) {
      log.error("could not chop path; more than two intersections found")
    } else {
      let halves = pathToCut.split(intersections[0])
      paths.begin = halves[0]
      let halves2 = halves[1].split(intersections[1])
      paths.end = halves2[1]
      
      let halves3 = pathThatCuts.split(intersections[0])
      let halves4 = halves[1].split(intersections[1])
      paths.middle = halves4[0]

      paths.chopped = paths.begin.join(paths.middle).join(paths.end)   

      // return paths.chopped
      log.info("path was chopped")
    }
    // end of 'chop' macro */

    macro('title', {
      at: points.titleAnchor,
      nr: 2,
      title: 'frontOutside',
    })

    if (sa) paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

    const pLeft = paths.princessSeam.edge('left')
    macro('hd', {
      from: points.waistDartRight,
      to: points.armholeOutsidePitchCp1,
      y: points.sideHemInitial.y + sa + 35,
      id: 'dartToArmhole',
    })
    macro('hd', {
      from: points.waistDartRight,
      to: points.sideHemInitial,
      y: points.sideHemInitial.y + sa + 25,
      id: 'dartToSide',
    })
    macro('hd', {
      from: pLeft,
      to: points.sideHemInitial,
      y: points.sideHemInitial.y + sa + 15,
      id: 'leftToSide',
    })

    macro('vd', {
      from: points.armholeOutsidePitchCp1,
      to: points.sideHemInitial,
      x: points.sideHemInitial.x + sa + 15,
      id: 'hemToArmhole',
    })
    macro('vd', {
      from: points.waistDartRight,
      to: pLeft,
      x: pLeft.x - sa - 15,
      id: 'hemToLeft',
    })

    if (options.dartPosition == 'shoulder') {
      macro('hd', {
        from: points.shoulderDartOutside,
        to: points.shoulder,
        y: points.shoulderDartOutside.y - sa - 15,
        id: 'dartToShoulder',
      })
      macro('hd', {
        from: points.snippet,
        to: points.shoulder,
        y: points.shoulderDartOutside.y - sa - 25,
        id: 'dartPointToShoulder',
      })
      macro('hd', {
        from: pLeft,
        to: points.shoulder,
        y: points.shoulderDartOutside.y - sa - 35,
        id: 'leftToShoulder',
      })
      macro('hd', {
        from: points.waistDartRight,
        to: points.shoulder,
        y: points.sideHemInitial.y + sa + 45,
        id: 'hemDartToShoulder',
      })
      macro('vd', {
        from: points.shoulder,
        to: points.sideHemInitial,
        x: points.shoulder.x,
        id: 'hemToShoulder',
      })
      macro('vd', {
        from: points.shoulderDartOutside,
        to: points.sideHemInitial,
        x: points.shoulderDartOutside.x,
        id: 'sideHemToShoulderDart',
      })
      macro('vd', {
        from: points.waistDartRight,
        to: points.shoulderDartOutside,
        x: pLeft.x - sa - 25,
        id: 'hemToShoulderDart',
      })
      macro('vd', {
        from: points.snippet,
        to: points.shoulderDartOutside,
        x: pLeft.x - sa - 15,
        id: 'shoulderDartToDartPoint',
      })

      const pArmholeLeft = paths.armhole.edge('left')
      macro('hd', {
        from: points.waistDartRight,
        to: pArmholeLeft,
        y: points.sideHemInitial.y + sa + 5,
        id: 'hemDartToRight',
      })
      macro('vd', {
        from: pArmholeLeft,
        to: points.sideHemInitial,
        x: points.sideHemInitial.x + sa + 25,
        id: 'hemSideToRight',
      })
    } else {
      const pTop = paths.princessSeam.edge('top')
      macro('hd', {
        from: pLeft,
        to: points.armholeOutsidePitchCp1,
        y: pTop.y - sa - 35,
        id: 'leftToArmhole',
      })
      macro('hd', {
        from: pLeft,
        to: points.armholeDartOutside,
        y: pTop.y - sa - 25,
        id: 'leftToArmholeDart',
      })
      macro('hd', {
        from: pLeft,
        to: pTop,
        y: pTop.y - sa - 15,
        id: 'leftToTop',
      })
      macro('vd', {
        from: points.waistDartRight,
        to: pTop,
        x: pLeft.x - sa - 25,
        id: 'hemToTop',
      })
      macro('vd', {
        from: points.snippet,
        to: pTop,
        x: pLeft.x - sa - 15,
        id: 'topToDartPoint',
      })
      macro('vd', {
        from: points.armholeDartOutside,
        to: points.sideHemInitial,
        x: points.sideHemInitial.x + sa + 25,
        id: 'sideHemToArmholeDart',
      })
      macro('vd', {
        from: pTop,
        to: points.sideHemInitial,
        x: points.sideHemInitial.x + sa + 35,
        id: 'sideHemToTop',
      })
    }

    return part
  },
}
