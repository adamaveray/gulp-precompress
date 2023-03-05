import { Formats, Options } from './types';
import zlib from 'node:zlib';

export default {
  formats: {
    [Formats.BROTLI]: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
    },
    [Formats.GZIP]: {
      level: 9, // Maximum
    },
  },
  skipLarger: true,
} satisfies Options;
