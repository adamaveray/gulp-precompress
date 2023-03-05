import { Readable } from 'node:stream';
import zlib from 'node:zlib';
import type Vinyl from 'vinyl';

import { collateStream, makeFile } from './lib';
import precompress, { Options } from '../src';
import compressors from '../src/compressors';
import defaults from '../src/defaults';

const apply = async (files: Vinyl[], options?: Partial<Options>): Promise<Vinyl[]> => {
  return collateStream<Vinyl>(Readable.from(files).pipe(precompress(options)));
};

const repeat = (string: string, count: number, type: 'buffer' | 'stream'): Buffer | Readable => {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += string;
  }
  const buffer = Buffer.from(result, 'utf8');
  return type === 'buffer' ? buffer : Readable.from(buffer);
};

const clone = <T extends Buffer | Readable>(input: T): T =>
  (input instanceof Buffer ? Buffer.from(input) : Readable.from(input)) as T;

describe('precompress', () => {
  const defaultOpts = defaults.formats;
  const opts = {
    brotli: { [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY },
    gzip: { level: 9 },
  } as const;

  describe.each(['buffer', 'stream'] as const)('buffer or stream', (type) => {
    it('generates files', async () => {
      const inputFile = makeFile('input.txt', repeat('<p>hello world</p>\n', 1_000, type));
      const outputFiles = await apply([inputFile], { formats: opts });

      expect(outputFiles).toMatchVinylFiles([
        inputFile,
        makeFile('input.txt.br', compressors.brotli[type](clone(inputFile.contents as any), opts.brotli)),
        makeFile('input.txt.gz', compressors.gzip[type](clone(inputFile.contents as any), opts.gzip)),
      ]);
    });

    it('uses default format options', async () => {
      const inputFile = makeFile('input.txt', repeat('<p>hello world</p>\n', 1_000, type));
      const outputFiles = await apply([inputFile], { formats: { brotli: true, gzip: true } });

      expect(outputFiles).toMatchVinylFiles([
        inputFile,
        makeFile('input.txt.br', compressors.brotli[type](clone(inputFile.contents as any), defaultOpts.brotli)),
        makeFile('input.txt.gz', compressors.gzip[type](clone(inputFile.contents as any), defaultOpts.gzip)),
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
      const inputFile = makeFile('input.txt', repeat('a', 1, 'buffer'));
      const outputFiles = await apply([inputFile], { skipLarger: false, formats: opts });

      expect(outputFiles).toMatchVinylFiles([
        inputFile,
        makeFile('input.txt.br', compressors.brotli.buffer(clone(inputFile.contents as any), opts.brotli)),
        makeFile('input.txt.gz', compressors.gzip.buffer(clone(inputFile.contents as any), opts.gzip)),
      ]);
    });
  });

  it('skips null files', async () => {
    const inputFiles = [makeFile('input.txt', null)];
    const outputFiles = await apply(inputFiles);
    expect(outputFiles).toEqual(inputFiles);
  });
});
