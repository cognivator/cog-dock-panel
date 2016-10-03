<a name="1.0.0"></a>
# [1.0.0](https://github.com/cognivator/ng-dock-panel/compare/0.1.1...v1.0.0) (2016-10-03)


### Bug Fixes

* **bower:** adjust main and dependencies section ([3789e6b](https://github.com/cognivator/ng-dock-panel/commit/3789e6b)), closes [#12](https://github.com/cognivator/ng-dock-panel/issues/12)

### Features

* **style:** add LESS source to distribution ([e27770e](https://github.com/cognivator/ng-dock-panel/commit/e27770e)), closes [#13](https://github.com/cognivator/ng-dock-panel/issues/13)


### BREAKING CHANGES

* style: filenames for style source and style distribution have changed

Source
- lib/style/sass/_ng-dock-panel.theme.scss is now _ng-dock-panel_theme.scss
Reason: the LESS processor does not resolve the previous @import names (e.g. `@import 'ng-dock-panel.style'`) properly. The trailing `.style` is treated as the final extension by the LESS processor, with no attempt to append a final `.less`. Renaming the files was an easier, less brittle solution than trying to munge the @import filename during conversion from SASS to LESS.

- lib/style/sass/ng-dock-panel.style.scss is now ng-dock-panel.scss
Reason: simplify filenames in general. This is the only style entry point, so no further distinction beyond the module name is necessary.

Distribution
- ng-dock-panel.style.css is now ng-dock-panel.css
- ng-dock-panel.style.min.css is now ng-dock-panel.min.css
Reason: this is a natural extension of filename simplicity (see Source above).



<a name="0.1.1"></a>
## [0.1.1](https://github.com/cognivator/ng-dock-panel/compare/0.1.0...v0.1.1) (2016-09-21)


### Bug Fixes

* **npm, bower:** update ignore files and settings ([1bfc669](https://github.com/cognivator/ng-dock-panel/commit/1bfc669))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/cognivator/ng-dock-panel/compare/v0.0.1...0.1.0) (2016-09-21)


### Bug Fixes

* **dock-resizable, dock-collapsible:** correct style placeholder member names ([20d597a](https://github.com/cognivator/ng-dock-panel/commit/20d597a))

### Features

* **dock-resizable, dock-collapsible:** add support for custom resize / collapse handles ([8fba668](https://github.com/cognivator/ng-dock-panel/commit/8fba668)), closes [#4](https://github.com/cognivator/ng-dock-panel/issues/4) [#6](https://github.com/cognivator/ng-dock-panel/issues/6)



<a name="0.0.1"></a>
## 0.0.1 (2016-09-15)

### Features

* **dock:** add support for ng-show / ng-hide ([5b0bc57](https://github.com/cognivator/ng-dock-panel/commit/5b0bc57))

