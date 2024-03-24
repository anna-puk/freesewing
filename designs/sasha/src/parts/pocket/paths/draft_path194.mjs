function draft_path194(
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  store,
  part
) {
  // Path: path194
  const scaling_path194 = (-1.082 * store.get('pocketWidth')) / 4 / 14.272481456249999
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
}

export { draft_path194 }
