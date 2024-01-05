import { backArmholeCalculation } from './backArmholeCalculation.mjs'

export const front = {
  name: 'front',
  from: backArmholeCalculation,
  measurements: [
    'biceps',
    'chest',
    'hpsToBust',
    'hpsToWaistBack',
    'neck',
    'shoulderToShoulder',
    'shoulderSlope',
    'waistToArmpit',
    'waistToHips',
  ],
  options: {
    sleeveFor: {
      dflt: 'Noble',
      list: ['Noble', 'Bella', 'Teagan'],
    },
  },
  draft: ({
    store,
    log,
    units,
    options,
    Point,
    Path,
    points,
    paths,
    Snippet,
    snippets,
    sa,
    macro,
    part,
  }) => {
    // NOTE: this part does not draw anything and is called 'front' only because brian.sleevecap requires (imports) a part called front
    /*   switch (options.sleeveFor) {
			case "Noble"
				// derived from bella, so use those values
			case "Bella" */
    store.set('sleevecapTarget', store.get('frontArmholeLength') + store.get('backArmholeLength'))
    // store.set('sleevecapTargetNoble',store.get('sleeveCapTargetFront')+store.get('sleeveCapTargetBack'))
    /* 		case "Teagan"
				// no need to do anything, 'sleevecapTarget' already added to store by brian.base
				break;
			default
				error('not supported')
		} */

    let frontLength = store.get('frontArmholeLength')
    let backLength = store.get('backArmholeLength')
    let totalLength = store.get('sleevecapTarget')

    log.debug(
      `setting sleevecap target, front armhole length is ${units(frontLength)}, back ${units(
        backLength
      )}, total ${units(totalLength)}`
    )

    return part
  },
}
