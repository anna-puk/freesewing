import { frontInside as nobleFrontInside } from '@freesewing/noble'

export const frontInside = {
  name: 'sasha.frontInside',
  from: nobleFrontInside,
	measurements: [
		'hips',
		'seat',
		'crossSeam',
		'crossSeamFront',
		'upperLeg',
		'waistToHips',
		'waistToSeat',
		'waistToKnee',]
	options: {
		lengthBonus: { pct: -10, min: -100, max: 100, ...pctBasedOn('waistToKnee'), menu: style },
		skirtWidth: {pct: 50, min: 0, max: 100, ...pctBasedOn('hips'), menu: style },
	},
  draft: ({
		utils,
    store,
    sa,
    Point,
    points,
    Path,
    paths,
    Snippet,
    snippets,
    options,
    measurements,
    macro,
    part,
		}) => {

		store.set('skirtLength',measurements.waistToKnee*options.lengthBonus)
		store.set('skirtWidth',measurements.hips*(1 + options.skirtWidth))
		store.set('skirtDartAngle',Math.asin(measurements.hips/4 * options.skirtWidth/store.get('skirtLength')))
		
		points.cfSkirtHem = points.cfHem.shift(270,store.get('skirtLength'))
		points.dartSkirtHem = points.waistDartLeft.shift(270+store.get('skirtDartAngle'),store.get('skirtWidth')/4)
				
		// NOTE: nobleFrontInside is drawn from cfHem to waistDartLeft to shoulder to cfNeck
		let halvesA = paths.insideSeam.split(points.waistDartLeft)
		let halvesB = halvesA[1].split(cfNeck)
		
		let nobleCf = halvesB[1]
		let nobleRest = halvesB[0]
		
		// store a copy of the insideSeam before overwriting, and hide it
		paths.nobleInsideSeam = paths.insideSeam.hide()
		paths.insideSeam = new Path()
			.move(points.cfSkirtHem)
			.curve(points.cfSkirtHem.shiftTowards(points.dartSkirtHem,1/3),points.cfSkirtHem.shiftTowards(points.dartSkirtHem,2/3),points.dartSkirtHem)
			.join(nobleRest)
			.join(nobleCf)
			.close

    if (sa) {
      paths.sa = paths.insideSeam.offset(sa).line(points.cfNeck).attr('class', 'fabric sa')
      paths.sa = paths.sa.move(points.cfHem).line(paths.sa.start())
    }

    let extraOffset = 0
    if (options.dartPosition == 'shoulder') {
      macro('hd', {
        from: points.cfNeck,
        to: points.shoulderDartInside,
        y: points.hps.y - 25,
        id: 'hpsToDart',
      })
      macro('vd', {
        from: points.cfHem,
        to: points.shoulderDartInside,
        x: 0 - 30,
        id: 'hemToDart',
      })
      macro('vd', {
        from: points.cfHem,
        to: points.shoulderDartTip,
        x: 0 - 10,
        id: 'hemToDartTip',
      })
      macro('hd', {
        from: points.cfBust,
        to: points.shoulderDartTip,
        y: points.cfHem.y + sa + 25,
        id: 'middleToDartTip',
      })
    } else {
      extraOffset = 10
      macro('hd', {
        from: points.hps,
        to: points.shoulderCp1,
        y: points.hps.y - 35,
        id: 'hpsToShoulder',
      })
      macro('hd', {
        from: points.hps,
        to: points.armholeDartInsideCp2,
        y: points.hps.y - 25,
        id: 'hpsToDart',
      })
      macro('vd', {
        from: points.cfHem,
        to: points.armholeDartInsideCp2,
        x: 0 - 20,
        id: 'hemToDart',
      })
      macro('vd', {
        from: points.cfHem,
        to: points.shoulderCp1,
        x: 0 - 40,
        id: 'hemToShoulder',
      })
      macro('vd', {
        from: points.cfHem,
        to: points.armholeDartTipInside,
        x: 0 - 10,
        id: 'hemToDartTip',
      })
      macro('hd', {
        from: points.cfBust,
        to: points.armholeDartTipInside,
        y: points.cfHem.y + sa + 25,
        id: 'middleToDartTip',
      })
    }

    macro('vd', {
      from: points.cfHem,
      to: points.cfNeck,
      x: 0 - 20 - extraOffset,
      id: 'hemToNeck',
    })
    macro('vd', {
      from: points.cfHem,
      to: points.hps,
      x: 0 - 40 - extraOffset,
      id: 'hemToHps',
    })
    macro('hd', {
      from: points.cfHem,
      to: points.waistDartLeft,
      y: points.cfHem.y + sa + 15,
      id: 'middleToDart',
    })
    macro('hd', {
      from: points.cfNeck,
      to: points.hps,
      y: points.hps.y - sa - 15,
      id: 'middleToHps',
    })

    return part
  },
}
