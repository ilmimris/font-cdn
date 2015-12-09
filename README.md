# font-cdn

[Google Fonts](https://www.google.com/fonts) clone, for use with custom fonts not available on google.

## How it works

- Boot it up with `npm start`
- Visit [http://localhost:3000/css?family=Bitstream+Vera+Sans+Mono:400italic|Montserrat:400,700](http://localhost:3000/css?family=Bitstream+Vera+Sans+Mono:400italic|Montserrat:400,700)
- This will produce the following CSS, with CORS enabled:

```css
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

The naming format is `{font-family}-{font-weight}.{extension}`. Example: `Futura-100.woff`.
