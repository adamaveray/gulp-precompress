import zlib from 'node:zlib';

import { Formats, FormatOptions } from './types';
import type { Compressor } from './types';
import { Stream } from 'node:stream';

export default {
  [Formats.BROTLI]: {
    stream(stream, options) {
      return new Stream(stream).pipe(zlib.createBrotliCompress(options));
    },
    buffer(buffer, options) {
      return zlib.brotliCompressSync(buffer, options);
    },
  },
  [Formats.GZIP]: {
    stream(stream, options) {
      return new Stream(stream).pipe(zlib.createGzip(options));
    },
    buffer(buffer, options) {
      return zlib.gzipSync(buffer, options);
    },
  },
} satisfies { [key in Formats]: Compressor<FormatOptions[key]> };
