/*
 * This page is auto-generated. Do not edit it by hand.
 */
import { Test } from 'designs/test/src/index.mjs'
// Dependencies
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { nsMerge } from 'shared/utils.mjs'
// Components
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { Workbench, ns as wbNs } from 'shared/components/workbench/new.mjs'
import { WorkbenchLayout } from 'site/components/layouts/workbench.mjs'

// Translation namespaces used on this page
const ns = nsMerge('test', wbNs, pageNs)

const NewTestPage = ({ page, docs }) => (
  <PageWrapper {...page} title="Test" layout={WorkbenchLayout} header={null}>
    <Workbench
      {...{
        design: 'test',
        Design: Test,
        docs,
      }}
    />
  </PageWrapper>
)

export default NewTestPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ns)),
      page: {
        locale,
        path: ['new', 'test'],
        title: 'Test',
      },
    },
  }
}
