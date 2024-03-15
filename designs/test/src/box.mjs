function draftBox({
  options,
  Point,
  Path,
  points,
  paths,
  Snippet,
  snippets,
  sa,
  macro,
  measurements,
  part,
}) {
  const keyWidth = measurements.waist / 4
  const keyHeight = (1 + options.lengthBonus) * measurements.waistToKnee
  const extraWidth1 = ((1 + options.width) * measurements.waist) / 4

  // Path: path4006
  // M 93.0673 305.267
  points.path4006_p1 = new Point(0.01488 * keyWidth, 0.00221 * keyHeight)
  // H 207.448
  points.path4006_p2 = new Point(1.01488 * keyWidth, 0.00187 * keyHeight)
  // c 0 0 157.323 530.853 190.946 641.839
  points.path4006_p3_cp1 = new Point(1.01094 * keyWidth, 0.00187 * keyHeight)
  points.path4006_p3_cp2 = new Point(0.91549 * extraWidth1, 0.694 * keyHeight)
  points.path4006_p3_ep = new Point(extraWidth1, 0.83871 * keyHeight)
  // c -67.8094 60.1069 -188.46 53.8175 -188.46 53.8175
  points.path4006_p4_cp1 = new Point(0.82973 * extraWidth1, 0.91729 * keyHeight)
  points.path4006_p4_cp2 = new Point(1.03315 * keyWidth, 0.90909 * keyHeight)
  points.path4006_p4_ep = new Point(1.03315 * keyWidth, 0.90909 * keyHeight)
  // H 93.1489
  points.path4006_p5 = new Point(0.01559 * keyWidth, 0.90932 * keyHeight)
  // Z

  paths.path4006 = new Path()
    // inkex.paths.Move: M 93.0673 305.267
    .move(points.path4006_p1)
    // inkex.paths.Horz: H 207.448
    .line(points.path4006_p2)
    // inkex.paths.curve: c 0 0 157.323 530.853 190.946 641.839
    .curve(points.path4006_p3_cp1, points.path4006_p3_cp2, points.path4006_p3_ep)
    // inkex.paths.curve: c -67.8094 60.1069 -188.46 53.8175 -188.46 53.8175
    .curve(points.path4006_p4_cp1, points.path4006_p4_cp2, points.path4006_p4_ep)
    // inkex.paths.Horz: H 93.1489
    .line(points.path4006_p5)
    // inkex.paths.ZoneClose: Z
    .line(points.path4006_p1)

  return part
}

export const box = {
  name: 'box',
  options: {
    width: { pct: 50, min: 10, max: 100, menu: 'fit' },
    lengthBonus: { pct: 10, min: -40, max: 100, menu: 'style' },
  },
  measurements: ['waist', 'waistToKnee'],
  draft: draftBox,
}
