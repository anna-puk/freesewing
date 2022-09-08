import { base } from './base.mjs'

function walburgaBack(part) {
  const { points, macro, complete, snippets, Snippet } = part.shorthand()

  // Complete?
  if (complete) {
    // logo & title
    points.logo = points.top.shift(45, points.bottom.dy(points.top) / 5)
    snippets.logo = new Snippet('logo', points.logo)
    points.title = points.logo.shift(90, points.bottom.dy(points.top) / 4)
    macro('title', {
      at: points.title,
      nr: 2,
      title: 'back',
    })
    points.__titleNr.attr('data-text-class', 'center')
    points.__titleName.attr('data-text-class', 'center')
    points.__titlePattern.attr('data-text-class', 'center')

    // scalebox
    points.scalebox = points.title.shift(90, points.bottom.dy(points.top) / 5)
    macro('scalebox', { at: points.scalebox })
  }

  return part
}

export const back = {
  name: 'walburga.back',
  from: base,
  draft: walburgaBack,
}
