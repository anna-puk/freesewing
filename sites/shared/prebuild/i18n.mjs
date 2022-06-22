import path from 'path'
import fs from 'fs'
import { en, de, es, fr, nl, languages } from '../../../packages/i18n/src/next.mjs'

const locales = { en, de, es, fr, nl }

const writeJson = (site, locale, namespace, content) => fs.writeFileSync(
  path.resolve(
    '..',
    site,
    'public',
    'locales',
    locale,
    `${namespace}.json`
  ),
  JSON.stringify(content)
)

/*
 * Main method that does what needs doing
 */
export const prebuildI18n = async (site, only=false) => {
  // Iterate over locales
  for (const locale in locales) {
    // Only English for dev site
    if (site !== 'dev' || locale === 'en') {
      console.log('Generating translation files for', locale)
      const loc = locales[locale]
      // Fan out into namespaces
      for (const namespace in loc) {
        if (!only || only.indexOf(namespace) !== -1) {
          writeJson(
            site, locale, namespace,
            loc[namespace]
          )
        }
      }
      writeJson(site, locale, 'locales', languages)
    }
  }
}

