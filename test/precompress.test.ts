/* eslint @typescript-eslint/no-unsafe-argument: "off" -- Simpler polymorphic testing */

import { Readable } from 'node:stream';
import zlib from 'node:zlib';

import type Vinyl from 'vinyl';

import precompress, { type Options } from '../src';
import compressors from '../src/compressors';
import defaults, { GZIP_MAX_QUALITY } from '../src/defaults';

import { collateStream, makeFile } from './lib';

async function apply(files: Vinyl[], options?: Partial<Options>): Promise<Vinyl[]> {
  return collateStream<Vinyl>(Readable.from(files).pipe(precompress(options)) as Readable);
}

function repeat(string: string, count: number, type: 'buffer' | 'stream'): Buffer | Readable {
  let result = '';
  for (let i = 0; i < count; i += 1) {
    result += string;
  }
  const buffer = Buffer.from(result, 'utf8');
  return type === 'buffer' ? buffer : Readable.from(buffer);
}

function clone<T extends Buffer | Iterable<any> | AsyncIterable<any>>(input: T): T {
  return (input instanceof Buffer ? Buffer.from(input) : Readable.from(input)) as T;
}

describe('precompress', () => {
  const defaultOpts = defaults.formats;
  const opts = {
    brotli: { [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY },
    gzip: { level: GZIP_MAX_QUALITY },
  } as const;

  describe.each(['buffer', 'stream'] as const)('buffer or stream', (type) => {
    const DUMMY_FILE_LINES = 1000;

    it('generates files', async () => {
      const filename = 'input.txt';
      const inputFile = makeFile(filename, repeat('<p>hello world</p>\n', DUMMY_FILE_LINES, type));
      const outputFiles = await apply([inputFile], { formats: opts });

      expect(outputFiles).toMatchVinylFiles([
        inputFile,
        makeFile(`${filename}.br`, compressors.brotli[type](clone(inputFile.contents as any), opts.brotli)),
        makeFile(`${filename}.gz`, compressors.gzip[type](clone(inputFile.contents as any), opts.gzip)),
      ]);
    });

    it('uses default format options', async () => {
      const filename = 'input.txt';
      const inputFile = makeFile(filename, repeat('<p>hello world</p>\n', DUMMY_FILE_LINES, type));
      const outputFiles = await apply([inputFile], { formats: { brotli: true, gzip: true } });

      expect(outputFiles).toMatchVinylFiles([
        inputFile,
        makeFile('input.txt.br', compressors.brotli[type](clone(inputFile.contents as any), defaultOpts.brotli)),
        makeFile(`${filename}.gz`, compressors.gzip[type](clone(inputFile.contents as any), defaultOpts.gzip)),
      ]);
    });
  });

  describe('buffer', () => {
    it('skips smaller compressed files', async () => {
      const inputFiles = [makeFile('input.txt', repeat('a', 1, 'buffer'))];
      const outputFiles = await apply(inputFiles);
      expect(outputFiles).toEqual(inputFiles);
    });

    it('allows forcing smaller compressed files', async () => {
      const filename = 'input.txt';
      const inputFile = makeFile(filename, repeat('a', 1, 'buffer'));
      const outputFiles = await apply([inputFile], { skipLarger: false, formats: opts });

      expect(outputFiles).toMatchVinylFiles([
        inputFile,
        makeFile(`${filename}.br`, compressors.brotli.buffer(clone(inputFile.contents as Buffer), opts.brotli)),
        makeFile(`${filename}.gz`, compressors.gzip.buffer(clone(inputFile.contents as Buffer), opts.gzip)),
      ]);
    });
  });

  it('skips null files', async () => {
    const inputFiles = [makeFile('input.txt', null)];
    const outputFiles = await apply(inputFiles);
    expect(outputFiles).toEqual(inputFiles);
  });
});
