import { Chevron } from 'shared/components/navigation/primary.js'
import { Ul, Li, Details, Summary, SumButton, SumDiv, Deg } from 'shared/components/workbench/menu'

const ConsoleLog = props =>  (
  <Li>
    <Details>
      <Summary>
        <SumDiv>
          <Deg />
          <span>console.log()</span>
        </SumDiv>
        <Chevron />
      </Summary>
      <Ul>
        {['designConfig', 'patternConfig', 'gist', 'draft'].map(it => (
          <Li key={it}>
            <SumButton onClick={() => {
              if (it === 'designConfig') return console.log(props.design.designConfig)
              if (it === 'patternConfig') return console.log(props.design.patternConfig)
              return console.log(props[it])
            }}>
              <SumDiv>
                <Deg />
                <span>{it}</span>
              </SumDiv>
            </SumButton>
          </Li>
        ))}
      </Ul>
    </Details>
  </Li>
)

export default ConsoleLog
