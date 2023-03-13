import { Transform } from 'node:stream';
import Vinyl from 'vinyl';

import compressors from './compressors';
import defaultOptions from './defaults';
import { Compressor, Formats } from './types';
import type { Options } from './types';
import { normaliseFormatEntries, touch } from './utils';

export { Formats } from './types';
export type { Options } from './types';

const formatExts: Record<Formats, string> = {
  [Formats.BROTLI]: '.br',
  [Formats.GZIP]: '.gz',
};

function compress<TOpts>(
  file: Vinyl,
  compressor: Compressor<TOpts>,
  formatOptions: TOpts,
  skipLarger: boolean,
): Buffer | NodeJS.ReadableStream | undefined {
  if (file.isStream()) {
    return compressor.stream(file.contents, formatOptions);
  }
  if (file.isBuffer()) {
    const newContents = compressor.buffer(file.contents, formatOptions);
    if (skipLarger && newContents.byteLength > file.contents.length) {
      // Ignore larger
      return undefined;
    }
    return newContents;
  }

  // Unsupported
  return undefined;
}

export default function precompress(options: Partial<Options> = {}): Transform {
  const { formats, skipLarger } = { ...defaultOptions, ...options };
  const activeFormatEntries = normaliseFormatEntries(formats, defaultOptions.formats);

  return new Transform({
    objectMode: true,
    async transform(file: Vinyl, encoding, callback): Promise<void> {
      // Preserve existing
      this.push(file);

      // Create compressed copies in parallel
      await Promise.all(
        activeFormatEntries.map(async ([format, formatOptions]) => {
          return new Promise<void>((resolve) => {
            const newContents = compress(file, compressors[format], formatOptions, skipLarger);
            if (newContents != null) {
              // Add compressed file
              const compressedFile = file.clone({ contents: false });
              compressedFile.contents = newContents;
              compressedFile.extname += formatExts[format];
              // Update modification time
              touch(compressedFile, new Date());
              this.push(compressedFile);
            }
            resolve();
          });
        }),
      );

      callback();
    },
  });
}
