---
title: noop()
---

```js
Path path.noop(string id)
```

Adds a placeholder path operation.

A `noop` operation does nothing, but is intended to be replaced later
with [`Path.insop()`](/reference/api/path/insop).

<Tip compact>This is often used to insert darts into a path</Tip>

<Example part="path_noop">
Example of the Path.noop() method
</Example>

```js
points.left = new Point(10,10)
points.dartLeft = new Point(40, 10)
points.dartTip = new Point(50, 50)
points.dartRight = new Point(60, 10)
points.right = new Point(90, 10)

paths.withoutDart = new Path()
  .move(points.left)
  .line(points.dartLeft)
  .noop('dart')
  .line(points.right)

paths.withDart = paths.without
  .insop(
    'dart',
    new Path()
      .line(points.dartTip)
      .line(points.dartRight)
  )
  .attr('style', 'stroke-width: 2px; stroke-opacity: 0.5; stroke: orange;')
```
