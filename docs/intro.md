---
id: intro
title: Introduction
sidebar_label: Introduction
---

## Getting Started

To try out Keet is to include it from a CDN or npm.

Create a HTML file:-

```html
<html>
  <head>
    <script src="//cdn.rawgit.com/syarul/keet/master/keet-min.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
  <script>
    // your codes goes here
  </script>
</html>
```

Keet is flexible, you can include/intergrate into your current existing project easily

```npm install keet```

```js
import Keet, { CreateModel, html } from 'keet'
```

> NOTE: This documentation use [```babel-plugin-transform-class-properties```](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/)
