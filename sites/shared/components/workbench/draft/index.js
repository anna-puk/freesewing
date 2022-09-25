import SvgWrapper from './svg-wrapper'
import Error from './error.js'

const LabDraft = (props) => {
  const { app, draft, gist, updateGist, unsetGist, showInfo, feedback, hasRequiredMeasurements } =
    props

  if (!draft || !hasRequiredMeasurements) return null

  // Render as SVG
  if (gist?.renderer === 'svg') {
    let svg
    try {
      svg = draft.render()
    } catch (error) {
      console.log('Failed to render design', error)
      return <Error error={error} {...props} />
    }
    return <div dangerouslySetInnerHTML={{ __html: svg }} />
  }

  // Render as React
  let patternProps = {}
  try {
    patternProps = draft.getRenderProps()
    console.log(patternProps)
  } catch (error) {
    console.log('Failed to get render props for design', error)
    return <Error error={error} {...props} />
  }

  const errors = []
  errors.push(...patternProps.logs.pattern.error)
  for (const set of patternProps.logs.sets) {
    errors.push(...set.error)
  }

  return (
    <>
      {!patternProps || errors.length > 0 ? (
        <Error {...{ draft, patternProps, updateGist }} />
      ) : null}
      <SvgWrapper
        {...{ draft, patternProps, gist, updateGist, unsetGist, showInfo, app, feedback }}
      />
    </>
  )
}

export default LabDraft
