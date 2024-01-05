function calculate({ options, Point, Path, points, paths, Snippet, snippets, sa, macro, part }) {
// NOTE: this part does not draw anything but calculates the length of the front armhole

	store.set('sleeveCapTargetBack',new Path()
					.move(points.armhole)
					.curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
					.curve_(points.armholePitchCp2, points.shoulder)
					.line(points.hps)
					.length())

  return part
}

export const backArmholeCalculation = {
  name: 'backArmholeCalculation',
	from: bella.back,
	after: frontArmholeCalculation,
  },
  draft: calculate,
}
