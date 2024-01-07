import { frontOutside as nobleFrontOutside } from '@freesewing/noble'

export const frontOutside = {
  name: 'sasha.frontOutside',
  from: nobleFrontOutside,
  draft: ({ store, sa, points, Path, paths, Snippet, snippets, options, macro, part }) => {
    // Hide Noble paths
    for (const key of Object.keys(paths)) paths[key].hide()
    // for (const i in snippets) delete snippets[i] // keep the notches etc

    // take Noble paths, split into convenient pieces
    // NOTE: nobleFrontOutside is drawn from waistDartLeft to sideHem to armhole (etc)
    let halvesA = paths.seam.split(points.sideHem)

    let nobleRest = halvesA[1]

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
          store.get('skirtDartAngle'),
          points.godetEnd.dist(points.godetStart) / 3
        ),
        points.godetStart.shift(0, points.godetStart.dist(points.godetEnd) / 3),
        points.godetStart
      )
      .move(points.sideSkirtHem)
      .join(nobleRest)
      .join(nobleCf)
      .close()

    if (sa) paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')

    let pLeft = paths.princessSeam.edge('left')
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
      let pTop = paths.princessSeam.edge('top')
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
