---
title: "Path._curve()"
---

The `Path._curve()` method draws a cubic Bezier curve 
from the current position via two control points to a given endpoint.
However, the start control point is identical to the current position,
so you do not need to provide it.

## Signature

```js
Path path._curve(Point cp2, Point to)
```

<Tip compact>This method is chainable as it returns the `Path` object</Tip>

## Example

<TabbedExample part="path__curve" caption="Example of the Path.\_curve() method">
```js
({ Point, points, Path, paths, part }) => {

  points.from = new Point(5, 20);
  points.cp2 = new Point(60, 30);
  points.to = new Point(90, 20);

  paths.line = new Path()
    .move(points.from)
    ._curve(points.cp2, points.to)
    .attr("data-text", "Path._curve()")
    .attr("data-text-class", "text-sm center fill-note");

  return part
}
```
</TabbedExample>


## Notes

The main purpose of this method is to save your some typing,
as the two following calls yield the same result:

```js
path.curve(point1, point1, point2)
path._curve(point1, point2)
```


