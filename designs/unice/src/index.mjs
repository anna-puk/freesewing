import freesewing from '@freesewing/core'
import Ursula from '@freesewing/ursula'
import plugins from '@freesewing/plugin-bundle'
import config from '../config'
import draftFront from './front'
import draftBack from './back'
import draftGusset from './gusset'
import draftElastic from './elastic'
import draftFront2 from './front2'
import draftBack2 from './back2'
import draftGusset2 from './gusset2'

// Create new design
const Unice = new freesewing.Design(config, plugins)

// Attach Ursula parts that we will extend
for (const name of ['Back', 'Front', 'Gusset']) {
  Unice.prototype[`draftUrsula${name}`] = function (part) {
    return new Ursula(this.settings)[`draft${name}`](part)
  }
}

// Attach our own draft methods to the prototype
Unice.prototype.draftFront = draftFront
Unice.prototype.draftBack = draftBack
Unice.prototype.draftGusset = draftGusset
Unice.prototype.draftElastic = draftElastic
Unice.prototype.draftFront2 = draftFront2
Unice.prototype.draftBack2 = draftBack2
Unice.prototype.draftGusset2 = draftGusset2


// Named exports
export { config, Unice }

// Default export
export default Unice
