import zlib from 'node:zlib';

import { Formats, type Options } from './types';

export const GZIP_MAX_QUALITY = 9;

export default {
  formats: {
    [Formats.BROTLI]: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
    },
    [Formats.GZIP]: {
      level: GZIP_MAX_QUALITY,
    },
  },
  skipLarger: true,
} satisfies Options;
