import { front } from './front.mjs'

export const dummy = {
  name: 'dummy',
  from: front,
  draft: ({ options, Point, Path, points, paths, Snippet, snippets, sa, macro, part }) => {
    // NOTE: this part does not draw anything but ensures that the appropriate front is used
    return part
  },
}
