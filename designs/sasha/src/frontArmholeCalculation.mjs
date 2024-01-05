function calculate({ options, Point, Path, points, paths, Snippet, snippets, sa, macro, part }) {
// NOTE: this part does not draw anything but calculates the length of the front armhole

	store.set('sleevecapTargetFront',new Path()
					.move(points.armhole)
					.curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
					.curve_(points.armholePitchCp2, points.shoulder)
					.line(points.hps)
					.length())

  return part
}

export const frontArmholeCalculation = {
  name: 'frontArmholeCalculation',
	from: bella.front
  },
  draft: calculate,
}
