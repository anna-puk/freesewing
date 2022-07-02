import { prebuildMdx } from './mdx.mjs'
import { prebuildStrapi } from './strapi.mjs'
import { prebuildNavigation } from './navigation.mjs'
import { prebuildContributors } from './contributors.mjs'
import { prebuildPatrons } from './patrons.mjs'
import { prebuildI18n } from './i18n.mjs'
import { prebuildLab } from './lab.mjs'

const SITE = process.env.SITE || 'lab'

const run = async () => {
  if (SITE !== 'lab') {
    const mdxPages = await prebuildMdx(SITE)
    const [posts, authors] = await prebuildStrapi(SITE)
    prebuildNavigation(mdxPages, posts, SITE)
  } else {
    await prebuildLab()
  }
  await prebuildI18n(SITE)
  await prebuildContributors(SITE)
  await prebuildPatrons(SITE)
  console.log()
}

run()
