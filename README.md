# font-cdn

[Google Fonts](https://www.google.com/fonts) clone, for use with custom fonts not available on google.

## How it works

- Boot it up with `npm start`
- Visit [http://localhost:3000/css?family=Bitstream+Vera+Sans+Mono:400italic|Montserrat:400,700](http://localhost:3000/css?family=Bitstream+Vera+Sans+Mono:400italic|Montserrat:400,700)
- This will produce the following CSS, with CORS enabled:

```css
@font-face {
  font-family: 'Humnst777 Cn BT';
  src: url('https://cdn.fonts.netlify.app/Humanist-777-Bold-Condensed-BT.ttf');
}


@font-face {
  font-family: 'Bitstream Vera Sans Mono';
  font-weight: 400;
  font-style: italic;
  src: url('http://localhost:3000/fonts/Bitstream-Vera-Sans-Mono-400italic.woff2') format('woff2'),
       url('http://localhost:3000/fonts/Bitstream-Vera-Sans-Mono-400italic.woff') format('woff');
}
@font-face {
  font-family: 'Montserrat';
  font-weight: 400;
  font-style: normal;
  src: url('http://localhost:3000/fonts/Montserrat-400.woff2') format('woff2'),
       url('http://localhost:3000/fonts/Montserrat-400.woff') format('woff');
}
@font-face {
  font-family: 'Montserrat';
  font-weight: 700;
  font-style: normal;
  src: url('http://localhost:3000/fonts/Montserrat-700.woff2') format('woff2'),
       url('http://localhost:3000/fonts/Montserrat-700.woff') format('woff');
}
```

## Installing new fonts

Add fonts to the `/public/fonts` directory. Only `woff` and `woff2` formats are supported.

The naming format is `{font-family}-{font-weight}{font-style}.{extension}`, where `font-style` is optional, and `font-family` should be hyphenated if there are spaces. 

Examples: 

- `Futura-700italic.woff`
- `Bitstream-Vera-Sans-Mono-400.woff`

# Express.js on Netlify Example

[![Netlify
Status](https://api.netlify.com/api/v1/badges/9aaef7de-1e5d-4fda-bc39-faa10a68b35b/deploy-status)](https://app.netlify.com/sites/netlify-express/deploys)

[![Deploy to
Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/neverendingqs/netlify-express)

An example of how to host an Express.js app on Netlify using
[serverless-http](https://github.com/dougmoscrop/serverless-http). See
[express/server.js](express/server.js) for details, or check it out at
https://netlify-express.netlify.com/!

[index.html](index.html) simply loads html from the Express.js app using
`<object>`, and the app is hosted at `/.netlify/functions/server`. Examples of
how to access the Express.js endpoints:

```sh
curl https://netlify-express.netlify.com/.netlify/functions/server
curl https://netlify-express.netlify.com/.netlify/functions/server/another
curl --header "Content-Type: application/json" --request POST --data '{"json":"POST"}' https://netlify-express.netlify.com/.netlify/functions/server
```
