import { Ul, Li, NoSumDiv, Deg } from 'shared/components/workbench/menu'
import { formatMm } from 'shared/utils'
import Attributes from './attributes'
import Ops from './path-ops'

const XrayPath = ({ pathName, partName, draft, t, units }) => {
  const path = draft?.parts?.[partName]?.paths?.[pathName]

  if (!path) return null
  return (
    <Ul>
      <Attributes attr={path.attributes} />
      <Li>
        <NoSumDiv>
          <Deg />
          <span className="font-bold mr-2">path.render =</span>
          <span>{JSON.stringify(path.render)}</span>
        </NoSumDiv>
      </Li>
      <Li>
        <NoSumDiv>
          <Deg />
          <span className="font-bold mr-2">path.length() =</span>
          <span dangerouslySetInnerHTML={{
            __html: formatMm(path.length(), units)
          }} />
        </NoSumDiv>
      </Li>
      <Ops ops={path.ops} />
    </Ul>
  )
}

export default XrayPath
