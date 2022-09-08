---
title: Frequent mistakes
order: zzz
---

Some things to keep in mind when working in Markdown are:

## Use remark-jargon for glossary terms

There is no need to add a _glossary_ section to documentation.
We use a plugin called [remark-jargon][rj] to explain terms.
Information can be found at the link.

[rj]: https://github.com/freesewing/freesewing/blob/develop/packages/remark-jargon/README.md

## Let lists be lists

Please make sure to use Markdown proper, doing things such as hardcoding
numbers for lists and using `&middot;` for bulleted lists won't be rendered
properly and will be styled differently.
Using Markdown in the same way  for everything ensures the site and
documentation look clean and professional. You can use a Markdown editor
like [StackEdit](https://stackedit.io/) to preview your text.

<Note>
Github itself also allows working in Markdown and will give you a handy preview!
</Note>  

If you get lost or have a question about how to do something, feel free to come
ask on the Discord. We've all had to learn Markdown at some point and would be
delighted to pass knowledge on.

## Create meaningful links

When adding links please do not link them using a structure like:
Link [here][yt]. Instead put the link under the relevant term.
See first list item for an example.

[yt]: https://www.youtube.com/watch?v=dQw4w9WgXcQ

## Make sure your links lead where you think they do

### Linking within the same website

When you are linking within freesewing.dev or freesewing.org you can use a relative link from
the site root.  
Use:

```text
/guides/markdown/frequent-mistakes
```

instead of

```text
https://freesewing.dev/guides/markdown/frequent-mistakes
```

### Linking images

Images can be put in the same folder you are working on with a link
to the filename. For example:

```markdown
This is [a picture of a banana](banana.jpg)
```

## Avoid ambiguity when listing a number of steps

If you're writing documentation that involves steps, please do not mix levels
of steps. Steps written out in documentation are there to facilitate brainless
execution. Don't be afraid to repeat yourself.

If you use substeps we want those substeps to take away ambiguity rather
than introduce it into your instructions. In the next example the substep
introduces something that ought to be done before the previous steps.
This creates confusion about when that step ought to be executed.

An example of what not to do:

```md
1. cut collar
2. cut collar stand
3.  sew collar stand to collar
    1. sewing staystitch collar and collar stand
4. sew collar stand to neckline
```

## Be mindful of whitespace

Markdown sytax around white space is a little unintuitive. If you want a
paragraph break but no white space you need to add two spaces at the end of
your line. I've found it helpful to experiment and keep checking the preview
to see how things look. Not all the empty lines and whitespace in your
document will render in the preview.

## Using custom components

When you're using custom components you want to leave an empty line before
and after your component.

```markdown
Lorem ipsum dolor sit amet,

<Note>
consectetur adipisci elit, 
</Note>

sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
```

If you're using any markdown syntax within a custom component you want to also
leave an empty line at the start and end of your component.

```markdown
Lorem ipsum dolor sit amet,

<Note>

*consectetur adipisci elit,*

</Note>

sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
```

## Don't be shy to ask a friend

Learning a new language can be intimidating, whether its Javascript, Norse or
Markdown but everyone in the Freesewing community is glad you're here and
helping us make the site even more awesome.
