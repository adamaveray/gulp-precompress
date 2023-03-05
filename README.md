# @averay/gulp-precompress

[![View code coverage on codecov][codecov-badge]][codecov]

[codecov]: https://codecov.io/gh/adamaveray/gulp-precompress
[codecov-badge]: https://codecov.io/gh/adamaveray/gulp-precompress/branch/main/graph/badge.svg

A Gulp plugin to generate precompressed assets to avoid on-the-fly webserver compression.

Compressed versions of static web assets are typically compressed on-demand by a webserver (e.g. with [nginx's gzip module][nginx-gz]). While the webserver will usually cache the compressed versions, the need to respond quickly means a faster compression setting is typically used, resulting in slightly suboptimal compression ratios. This plugin allows generating the compressed versions ahead of time, which enables using slower, more aggressive compression settings.

Compressed versions are stored alongside the sources (e.g. `styles.css` will be accompanied by `styles.css.gz` & `styles.css.br`). The webserver then needs to be configured to use these static compressed files (e.g. with nginx's [gzip_static module][nginx-gz-static] & [brotli module][nginx-brotli]).

[nginx-gz]: https://nginx.org/en/docs/http/ngx_http_gzip_module.html
[nginx-gz-static]: https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html
[nginx-brotli]: https://github.com/google/ngx_brotli#brotli_static

## Usage

Pipe the precompress plugin into the Gulp stream after all other plugins, directly before the final pipe to `gulp.dest()`:

```js
import precompress from '@averay/gulp-precompress';

gulp
  .src('...')
  .pipe(/* Apply other plugins */)
  .pipe(precompress())
  .pipe(gulp.dest('...'));
```

### Options

The plugin can be configured by passing a single (optional) object argument to the function:

- **`formats`:** Which compression formats to generate, and optional format-specific configuration (default: `{ brotli: {...}, gzip: {...} }` – [see defaults](./src/defaults.ts))
- **`skipLarger`:** Whether to omit outputting compressed files that are larger than the source file (default: `true`)

```js
precompress({
  formats: { gzip: true, brotli: false },
  skipLarger: false,
});
```

---

[MIT License](./LICENSE)
