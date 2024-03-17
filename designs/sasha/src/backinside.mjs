import { backInside as nobleBackInside } from '@freesewing/noble'

export const backInside = {
  name: 'sasha.backInside',
  from: nobleBackInside,
  options: {
    dartPosition: 'armhole', // only support armhole as princess seam endpoint
  },
  draft: ({ sa, store, Point, points, Path, paths, Snippet, snippets, options, macro, part }) => {
    // Hide Noble paths
    for (const key of Object.keys(paths)) paths[key].hide()
    // for (const i in snippets) delete snippets[i] // keep the notches etc

    // take Noble paths, split into convenient pieces
    // NOTE: nobleBackInside is drawn from cbNeck to waistCenter to dart to waistSide to armhole etc
    const halvesA = paths.insideSeam.split(points.waistCenter)
    const halvesAA = halvesA[1].split(points.dartBottomLeft) // TODO: rename
    const halvesB = halvesAA[1].split(points.dartTip)
    const halvesC = halvesB[1].split(points.armhole)
    const halvesD = halvesC[1].split(points.shoulderPoint)

    const nobleCb = halvesA[0]
    const nobleDartLeftHalf = halvesB[0]
    const nobleArmholeCurve = halvesD[0]
    const nobleRest = halvesD[1]

    // skirt portion consists of a rectangle and a 'godet' (but as one piece)
    points.cbSkirtHem = points.waistCenter.shift(270, store.get('skirtLength'))
    points.godetStart = points.dartBottomLeft.shift(270, store.get('skirtLength'))
    points.godetEnd = points.dartBottomLeft.shift(
      270 + store.get('skirtDartAngle'),
      store.get('skirtLength')
    )

    // separate the armhole 1/3 of the way down = 2/3 of the way up
    points.armholeSplit = nobleArmholeCurve.shiftFractionAlong(2 / 3)
    const halvesArmhole = nobleArmholeCurve.split(points.armholeSplit)
    const upperArmholeCurve = halvesArmhole[0]

    // roughly circular path from point of tip to armhole split
    const nobleDartToArmhole = new Path()
      .move(points.dartTip)
      .curve(
        points.dartTip.shift(90, -points.dartTip.dy(points.armholeSplit) * 0.4),
        points.armholeSplit.shift(180, -points.armholeSplit.dx(points.dartTip) * 0.5),
        points.armholeSplit
      )

    // assemble the seam from these paths
    paths.insideSeam = new Path()
      .move(points.cbSkirtHem)
      .move(points.godetStart)
      .curve(
        points.godetStart.shift(0, points.godetStart.dist(points.godetEnd) / 3),
        points.godetEnd.shift(
          store.get('skirtDartAngle'),
          points.godetEnd.dist(points.godetEnd) / 3
        ),
        points.godetEnd
      )
      .join(nobleDartLeftHalf)
      .join(nobleDartToArmhole)
      .join(nobleRest)
      .join(nobleCb)
      .close()

    if (sa) paths.sa = paths.insideSeam.offset(sa).attr('class', 'fabric sa')

    if (options.dartPosition == 'shoulder') {
      points.shoulderPoint = points.shoulderDart.clone()
    } else {
      points.shoulderPoint = points.shoulder.clone()
    }
    macro('hd', {
      from: points.waistCenter,
      to: points.shoulderPoint,
      y: points.waistCenter.y + sa + 15,
      id: 'middleToShoulder',
    })
    macro('hd', {
      from: points.waistCenter,
      to: points.dartTip,
      y: points.waistCenter.y + sa + 25,
      id: 'middleToDartPoint',
    })
    macro('hd', {
      from: points.waistCenter,
      to: points.dartBottomLeft,
      y: points.waistCenter.y + sa + 35,
      id: 'middleToDart',
    })
    macro('hd', {
      from: points.cbNeck,
      to: points.dartBottomLeft,
      y: points.waistCenter.y + sa + 45,
      id: 'neckToDart',
    })
    macro('hd', {
      from: points.cbNeck,
      to: points.hps,
      y: points.hps.y - sa - 15,
      id: 'neckToHps',
    })
    macro('hd', {
      from: points.hps,
      to: points.shoulderPoint,
      y: points.hps.y - sa - 15,
      id: 'hpsToShoulder',
    })
    if (options.dartPosition != 'shoulder') {
      macro('hd', {
        from: points.dartTip,
        to: points.waistSide,
        y: points.waistCenter.y + sa + 25,
        id: 'dartPointToSide',
      })
      macro('hd', {
        from: points.dartBottomRight,
        to: points.waistSide,
        y: points.waistCenter.y + sa + 35,
        id: 'dartToSide',
      })
      macro('hd', {
        from: points.dartBottomRight,
        to: points.armhole,
        y: points.waistCenter.y + sa + 45,
        id: 'dartToArmhole',
      })
    }

    let extraOffset = 0
    if (options.dartPosition != 'shoulder') {
      macro('vd', {
        from: points.shoulderPoint,
        to: points.waistSide,
        x: points.shoulderPoint.x + sa + 25,
        id: 'sideToShoulder',
      })
      macro('vd', {
        from: points.armhole,
        to: points.waistSide,
        x: points.shoulderPoint.x + sa + 15,
        id: 'sideToArmhole',
      })
      extraOffset = 10
    }

    macro('vd', {
      from: points.shoulderPoint,
      to: points.dartTip,
      x: points.shoulderPoint.x + sa + 15,
      id: 'dartPointToShoulder',
    })
    macro('vd', {
      from: points.shoulderPoint,
      to: points.dartBottomLeft,
      x: points.shoulderPoint.x + sa + 25 + extraOffset,
      id: 'dartToShoulder',
    })
    macro('vd', {
      from: points.shoulderPoint,
      to: points.waistCenter,
      x: points.shoulderPoint.x + sa + 35 + extraOffset,
      id: 'middleToShoulder',
    })
    macro('vd', {
      from: points.hps,
      to: points.waistCenter,
      x: points.shoulderPoint.x + sa + 45 + extraOffset,
      id: 'middleToHps',
    })
    macro('vd', {
      from: points.waistCenter,
      to: points.cbNeck,
      x: points.cbNeck.x - sa - 15,
      id: 'hemToNeck',
    })
    macro('vd', {
      from: points.waistCenter,
      to: points.hps,
      x: points.cbNeck.x - sa - 25,
      id: 'hemToHps',
    })

    return part
  },
}
