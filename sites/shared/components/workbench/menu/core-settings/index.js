import SettingsIcon from 'shared/components/icons/settings.js'
import { Chevron } from 'shared/components/navigation/primary.js'
import Setting from './setting.js'
import { Ul, Details, TopSummary, TopSumTitle } from '../index.js'
import { useTranslation } from 'next-i18next'

export const settings = {
  paperless: {
    dflt: false,
  },
  saBool: {
    dflt: false,
  },
  saMm: {
    min: 0,
    max: 25,
    dflt: 10,
  },
  complete: {
    dflt: false,
  },
  only: { },
  locale: {
    list: ['de', 'en', 'es', 'fr', 'nl'],
  },
  units: {
    list: ['metric', 'imperial'],
  },
  margin: {
    min: 0,
    max: 25,
    dflt: 2,
  },
  scale: {
    min: 0.1,
    max: 5,
    dflt: 1,
  },
  renderer: {
    list: ['react', 'svg'],
    titles: {
      react: '<Draft /> (React)',
      svg: '@freesewing/core (SVG)'
    }
  },
  debug: {
    dflt: false,
  },
}

const CoreSettings = props => {
  const { t } = useTranslation(['app'])

  return (
    <Details open>
      <TopSummary icon={<SettingsIcon />}>
        <TopSumTitle>{t('settings')}</TopSumTitle>
        <Chevron />
      </TopSummary>
      <Ul>
        {Object.keys(settings).map(setting => (
          <Setting key={setting} setting={setting} config={settings[setting]} {...props} />
        ))}
      </Ul>
    </Details>
  )
}

export default CoreSettings
