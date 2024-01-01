/*
 * This page is auto-generated. Do not edit it by hand.
 */
import { Sasha } from 'designs/sasha/src/index.mjs'
// Dependencies
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { nsMerge } from 'shared/utils.mjs'
// Components
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { Workbench, ns as wbNs } from 'shared/components/workbench/new.mjs'
import { WorkbenchLayout } from 'site/components/layouts/workbench.mjs'

// Translation namespaces used on this page
const ns = nsMerge('sasha', wbNs, pageNs)

const NewSashaPage = ({ page, docs }) => (
  <PageWrapper {...page} title="Sasha" layout={WorkbenchLayout} header={null}>
    <Workbench
      {...{
        design: 'sasha',
        Design: Sasha,
        docs,
      }}
    />
  </PageWrapper>
)

export default NewSashaPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ns)),
      page: {
        locale,
        path: ['new', 'sasha'],
        title: 'Sasha',
      },
    },
  }
}
