function draftBox({ options, Point, Path, points, paths, Snippet, snippets, sa, macro, part }) {
  /*   // for historic reasons, this is the path I've been testing with
  const scaling_path194 = (-1.082 ) / 4 / 14.272481456249999
  points.path194_p1 = new Point(26.4701 * scaling_path194, 148.5 * scaling_path194)
  points.path194_p2_cp1 = new Point(32.2571 * scaling_path194, 172.6299 * scaling_path194)
  points.path194_p2_cp2 = new Point(30.4535 * scaling_path194, 197.2958 * scaling_path194)
  points.path194_p2_ep = new Point(25.4703 * scaling_path194, 220.5309 * scaling_path194)
  points.path194_p3_cp1 = new Point(23.0427 * scaling_path194, 249.2232 * scaling_path194)
  points.path194_p3_cp2 = new Point(52.5555 * scaling_path194, 255.0394 * scaling_path194)
  points.path194_p3_ep = new Point(72.7078 * scaling_path194, 241.9014 * scaling_path194)
  points.path194_p4 = new Point(81.4191 * scaling_path194, 217.1457 * scaling_path194)
  points.path194_p5 = new Point(79.346 * scaling_path194, 179.3808 * scaling_path194)

  paths.path194 = new Path()
    .move(points.path194_p1)
    .curve(points.path194_p2_cp1, points.path194_p2_cp2, points.path194_p2_ep)
    .curve(points.path194_p3_cp1, points.path194_p3_cp2, points.path194_p3_ep)
    .line(points.path194_p4)
    .line(points.path194_p5)
    .line(points.path194_p1)

  paths.path194.hide()

  paths.tempPath = paths.path194.join(
    paths.pocketOpening.translate(
      -points.path194_p5.dx(points.pocketEnd),
      -points.path194_p5.dy(points.pocketEnd)
    )
  )

  paths.testLine = new Path()
    .move(points.path194_p1.translate(15, -15).shift(90, options.lineStartShift * paths.pocketOpening.length()))
    .line(
      points.path194_p5
        .translate(-50, 50)
        .shift(0, options.lineEndShift * paths.pocketOpening.length())
    )

  paths.testCurve = paths.pocketOpening
    .translate(-points.path194_p5.dx(points.pocketEnd), -points.path194_p5.dy(points.pocketEnd))
    .unhide()
    
  const tol = options.snapTol // mm

  let opCurve = paths.testCurve.ops[1]

  console.log('calling lineIntersectsCurveAlt from box')
  const test_intersection2 = utils.lineIntersectsCurveAlt(
    paths.testLine.start(),
    paths.testLine.end(),
    paths.testCurve.start(),
    opCurve.cp1,
    opCurve.cp2,
    opCurve.to,
    tol
  )

  let num_intersects
  if (test_intersection2) {
    console.log('test_intersection:',test_intersection2)
    if (test_intersection2 instanceof Array) {
      const intersections_flat = test_intersection2.flat(Infinity)
      console.log('intersections_flat:',intersections_flat)
      let nint = 0
      for (let i of intersections_flat) {
        if (i) {
          i.addCircle(5, 'facing')
          points[`intersection_${nint++}`] = i.clone()       
        }
      }
      num_intersects = nint
    } else {
      points.intersection = test_intersection2.addCircle(5, 'facing')
      num_intersects = 1
    }
  } else {
    num_intersects = 0
  }
  
  console.log('lineIntersectsCurveAlt found', num_intersects,'intersections')
    
  
  console.log('paths',paths)

  let point3 = new Point(36, 160)
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

  console.log('calling curvesIntersectAlt from box')
  let i = utils.curvesIntersectAlt(point3, point3Cp1, point4Cp2, point4, dartPoint0, dartPoint0Cp1, dartPoint1Cp2, dartPoint1 ,tol)  
    
  console.log('i',i) */

  return part
}

export const box = {
  name: 'box',
  /*   options: {
    lineEndShift: {
      pct: 0,
      min: -100,
      max: +100,
      menu: 'fit',
    },
    lineStartShift: {
      pct: -0.2,
      min: -50,
      max: +10,
      menu: 'fit',
    }, */
  /*     snapTol: {
      mm: 0.1, // frowned upon, but reasonable here
      min: 0.01,
      max: 10,
      snap: [0.1, 0.5, 1, 3, 5, 10],
    }    
  }, */
  draft: draftBox,
}
