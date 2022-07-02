import {forwardRef} from 'react'

const Svg = forwardRef(({
  embed = true,
  develop = false,
  locale = 'en',
  className = 'freesewing pattern',
  style = {},
  viewBox = false,
  width,
  height,
  children
}, ref) => {
  if (width < 1) width = 1000
  if (height < 1) height = 1000
  let attributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    'xmlns:svg': 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
    xmlLang: locale,
    viewBox: viewBox || `0 0 ${width} ${height}`,
    className,
    style
  }

  if (!embed) {
    attributes.width = width + 'mm'
    attributes.height = height + 'mm'
  }
  if (develop) attributes.className += ' develop'

  return <svg {...attributes} ref={ref}>{children}</svg>
})

export default Svg
