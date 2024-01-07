import { backOutside as noblebackOutside } from '@freesewing/noble'

export const backOutside = {
  name: 'noble.backOutside',
  from: nobleBackOutside,
  draft: ({ sa, Point, points, Path, paths, Snippet, snippets, options, macro, part }) => {
    // Hide Noble paths
    for (const key of Object.keys(paths)) paths[key].hide()
    // for (const i in snippets) delete snippets[i] // keep the notches etc

    // take Noble paths, split into convenient pieces
    // NOTE: nobleBackOutside is drawn from cbNeck to waistCenter to dart to waistSide to armhole etc
    let halvesA = paths.outsideSeam.split(points.dartTip)
    let halvesB = halvesA[1].split(points.dartBottomRight)
    let halvesC = halvesB[1].split(points.waistSide)
    let halvesD = halvesC[1].split(points.armhole)
    let halvesE = halvesD[1].split(points.shoulderPoint)

    let nobleDartRightHalf = halvesB[0]
    let nobleSide = halvesD[0]
    let nobleArmholeCurve = halvesE[0]

    // skirt portion consists of a rectangle and a 'godet' (but as one piece)
    points.sideSkirtHem = points.waistSide.shift(270, store.get('skirtLength'))
    points.godetStart = points.dartBottomRight.shift(270, store.get('skirtLength'))
    points.godetEnd = points.dartBottomRight.shift(
      270 - store.get('skirtDartAngle'),
      store.get('skirtLength')
    )

    // code below is copied from backinside
    // separate the armhole 1/3 of the way down = 2/3 of the way up
    points.armholeSplit = nobleArmholeCurve.shiftFractionAlong(2 / 3)
    halvesArmhole = nobleArmholeCurve.split(points.armholeSplit)
    let lowerArmholeCurve = halvesArmhole[0] // backinside uses [1] instead

    // roughly circular path from point of tip to armhole split to bottom of armhole
    let nobleDartToArmhole = new Path()
      .move(points.dartTip)
      .curve(
        points.dartTip.shift(90, points.dartTip.dy(points.armholeSplit) * 0.4),
        points.armholeSplit.shift(180, points.armholeSplit.dx(points.dartTip) * 0.5),
        points.armholeSplit
      )
      .close()

    // assemble the seam from these paths
    paths.outsideSeam = new Path()
      .move(points.godetEnd)
      .curve(
        points.godetEnd.shift(
          store.get('skirtDartAngle'),
          points.godetEnd.dist(points.godetStart) / 3
        ),
        points.godetStart.shift(0, points.godetStart.dist(points.godetEnd) / 3),
        points.godetStart
      )
      .move(points.sideSkirtHem)
      .join(nobleSide)
      .join(lowerArmholeCurve)
      .join(nobleDartToArmhole.reverse())
      .join(nobleDartRightHalf.reverse())
      .close()

    paths.outsideSeam = new Path()
      .move(points.dartBottomRight)
      .line(points.waistSide)
      .curve_(points.waistSideCp2, points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .curve_(points.armholePitchCp2, points.shoulder)
      .line(points.shoulderDart)
      .join(paths.dart)
      .close()
      .attr('class', 'fabric')

    points.grainlineFrom = new Point(
      Math.max(points.shoulderDart.x, points.dartBottomRight.x),
      points.shoulder.y
    )
    points.grainlineTo = new Point(
      points.grainlineFrom.x,
      points.waistSide.y - (points.waistSide.y - points.shoulder.y) * 0.4
    )

    macro('grainline', {
      from: points.grainlineFrom,
      to: points.grainlineTo,
    })

    snippets.dartTip = new Snippet('notch', points.dartTip)

    points.titleAnchor = points.dartBottomRight
      .shiftFractionTowards(points.waistSide, 0.1)
      .shiftFractionTowards(points.shoulder, 0.3)
    macro('title', {
      at: points.titleAnchor,
      nr: 4,
      title: 'backOutside',
    })
    points.gridAnchor = points.armholeCpTarget.clone()

    if (sa) paths.sa = paths.outsideSeam.offset(sa).attr('class', 'fabric sa')

    let pLeft = paths.dart.edge('left')
    macro('hd', {
      from: pLeft,
      to: points.waistSide,
      y: points.waistCenter.y + sa + 15,
      id: 'leftToSide',
    })
    macro('hd', {
      from: points.dartBottomRight,
      to: points.armhole,
      y: points.waistCenter.y + sa + 25,
      id: 'dartToArmhole',
    })
    macro('hd', {
      from: points.dartTip,
      to: points.waistSide,
      y: points.waistCenter.y + sa + 35,
      id: 'leftToSide',
    })
    macro('hd', {
      from: points.dartBottomRight,
      to: points.waistSide,
      y: points.waistCenter.y + sa + 45,
      id: 'dartToSide',
    })
    macro('hd', {
      from: pLeft,
      to: points.shoulder,
      y: points.shoulderDart.y - sa - 15,
      id: 'leftToShoulder',
    })
    macro('hd', {
      from: points.shoulderDart,
      to: points.shoulder,
      y: points.shoulderDart.y - sa - 25,
      id: 'dartToShoulder',
    })
    macro('hd', {
      from: points.shoulderDart,
      to: points.armhole,
      y: points.shoulderDart.y - sa - 35,
      id: 'dartToArmhole',
    })

    macro('vd', {
      from: points.shoulder,
      to: points.dartTip,
      x: points.armhole.x + sa + 15,
      id: 'dartPointToShoulder',
    })
    macro('vd', {
      from: points.armhole,
      to: points.waistSide,
      x: points.armhole.x + sa + 15,
      id: 'sideToArmhole',
    })
    macro('vd', {
      from: points.shoulder,
      to: points.waistSide,
      x: points.armhole.x + sa + 25,
      id: 'sideToShoulder',
    })
    macro('vd', {
      from: points.shoulder,
      to: points.dartBottomRight,
      x: points.armhole.x + sa + 35,
      id: 'dartToShoulder',
    })
    macro('vd', {
      from: points.shoulderDart,
      to: points.dartBottomRight,
      x: points.armhole.x + sa + 45,
      id: 'dartToDart',
    })

    return part
  },
}
