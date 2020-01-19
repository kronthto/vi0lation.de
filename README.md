# vi0lation.de

The Vi0 website using lots of cool new technologies.

Consumes [api.vi0lation.de](https://github.com/kronthto/api.vi0lation.de).

## Install

* Compile `src/style/bulma.scss`
``` bash
npm install
npm run build
npm run start:server
```

For the Push Notifications we sadly need a manual edit of the webpack config and add `importScripts: ['pushSw.js'],` to `GenerateSW`

## Technologies

* React
* Redux
* SSR
* PWA

## Credits

- [All Contributors][link-contributors]

[link-contributors]: ../../contributors
