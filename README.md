#cog-dock-panel

>NOTE: This is a breaking change from [ng-dock-panel](https://github.com/cognivator/ng-dock-panel) .

Angular module for dockable panels

_Inspired by dardino/ngDock._

##Usage:

### `cog-dock-panel` and `cog-dock`


```html
<body>
  <div cog-dock-panel>
    <div cog-dock="$angularexpr">my content</div>
  </div>
</body>
```

$angularexpr is an angular expression that returns one of this:

- top
- left
- right
- bottom
- fill

example:
```html
<body>
  <div cog-dock-panel>
    <div cog-dock="bottom">Bottom</div>
    <div cog-dock="fill">my content</div>
  </div>
</body>
```

or:

```html
<body>
  <div cog-dock-panel>
    <div cog-dock="myScopeVariable">my content</div>
  </div>
</body>
```


###`cog-dock-resizable`

If you want to be able to resize a dock you need to set the `cog-dock-resizable` directive:

```html
<body>
  <div cog-dock-panel>
    <div cog-dock="bottom" cog-dock-resizable>Bottom</div>
    <div cog-dock="fill">Fill</div>
  </div>
</body>
```

You can also pass an options object that will be passed through to the underlying jquery-ui resizable plugin:

```html
<body>
  <div cog-dock-panel>
    <div cog-dock="bottom" cog-dock-resizable="{maxHeight: 300}">Bottom</div>
    <div cog-dock="fill">Fill</div>
  </div>
</body>
```

See [jquery-ui resizable](http://api.jqueryui.com/resizable/) docs for possible options.

If you want to customize the resize handles, you can include an HTML element with a css class of 'cog-dock-resize-handle' as a child of the `cog-dock-resizable` element. The `cog-dock-resizable` directive will locate the child element and convert it to a resize handle.

```html
<body>
  <div cog-dock-panel>
    <div cog-dock="bottom" cog-dock-resizable>Bottom
      <div cog-dock-resize-handle></div>
    </div>
    <div cog-dock="fill">Fill</div>
  </div>
</body>
```

You can use both `cog-dock-resizable` and `cog-dock-collapsible` on the same dock, if desired.

>notice:
>you can only resize a non 'fill' dock

###`cog-dock-collapsible`

If you want to be able to collapse a dock you need to set the `cog-dock-collapsible` directive, AND include an HTML element with a css class of 'cog-dock-collapse-handle' as a child of the `cog-dock-collapsible` element. The `cog-dock-collapsible` directive will locate the child element and convert it to a collapse handle.

```html
<body>
  <div cog-dock-panel>
    <div cog-dock="bottom" cog-dock-collapsible>Bottom
          <div cog-dock-collapse-handle></div>
        </div>
    </div>
    <div cog-dock="fill">Fill</div>
  </div>
</body>
```

You can use both `cog-dock-collapsible` and `cog-dock-resizable` on the same dock, if desired.

>notice:
>you can only collapse a non 'fill' dock

##Styling

Because cog-dock-panel components are composed of normal HTML elements, you can style them as necessary using a combination of the jquery-ui classes, cog-dock-panel classes and attributes, plus your own custom classes.

### Style distribution (CSS)
The compiled styles are distributed in the root of the package, as
`cog-dock-panel.css` (or `.min.css`).

### Style source (SASS / LESS)
The style source is available as either SCSS or LESS format, in
`<package-root>/lib/style/sass` or `.../style/less`, respectively. 
