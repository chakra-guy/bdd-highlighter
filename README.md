Text highlighter for `Given`, `When`, `Then` and `And` keywords in VS Code.

VS Marketplace: https://marketplace.visualstudio.com/items?itemName=TamasSoos.bdd-highlighter

## Settings

```js
"BDDHighlighter": {
  "backgroundColor": "#1f171e",
  "color": "#e956ce",
  "borderRadius": "2px"
},
```

You can also limit the feature to specific files. If you leave the `includeFiles` empty it will operate on _all files_.

```js
"BDDHighlighter": {
  "includeFiles": [ ".test.js", ".spec.js" ],
},
```

## Demo

Before

![Without Keyword Highlight][before]

[before]: https://raw.githubusercontent.com/tamas-soos/bdd-highlighter/master/assets/before.png "Without Keyword Highlight"

After

![With Keyword Highlight][after]

[after]: https://raw.githubusercontent.com/tamas-soos/bdd-highlighter/master/assets/after.png "With Keyword Highlight"

## License

MIT © Tamas Soos
