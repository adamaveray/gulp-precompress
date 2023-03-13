import { normaliseFormatEntries, touch } from '../src/utils';
import { type Stats } from 'node:fs';
import defaults from '../src/defaults';
import { Formats } from '../src';
import Vinyl from 'vinyl';

describe('normalising format entries', () => {
  it('handles defaults', () => {
    expect(normaliseFormatEntries(defaults.formats, defaults.formats)).toEqual([
      [Formats.BROTLI, defaults.formats[Formats.BROTLI]],
      [Formats.GZIP, defaults.formats[Formats.GZIP]],
    ]);
  });

  it('handles all enabled', () => {
    expect(normaliseFormatEntries({ brotli: true, gzip: true }, defaults.formats)).toEqual([
      [Formats.BROTLI, defaults.formats[Formats.BROTLI]],
      [Formats.GZIP, defaults.formats[Formats.GZIP]],
    ]);
  });

  it('handles overrides', () => {
    expect(normaliseFormatEntries({ brotli: true, gzip: { level: 9001 } }, defaults.formats)).toEqual([
      [Formats.BROTLI, defaults.formats[Formats.BROTLI]],
      [Formats.GZIP, { level: 9001 }],
    ]);
  });

  it('handles all disabled', () => {
    expect(normaliseFormatEntries({ brotli: false, gzip: false }, defaults.formats)).toEqual([]);
  });

  it('handles all missing', () => {
    expect(normaliseFormatEntries({}, defaults.formats)).toEqual([]);
  });

  it('handles some missing', () => {
    expect(normaliseFormatEntries({ gzip: true }, defaults.formats)).toEqual([
      [Formats.GZIP, defaults.formats[Formats.GZIP]],
    ]);
  });
});

describe('touching files', () => {
  it('ignores files without stats', () => {
    const file = new Vinyl();
    touch(file, new Date());
    expect(file.stat).toBeNull();
  });

  it('sets stats dates', () => {
    const date = new Date('2000-01-01T00:00:00');

    const file = new Vinyl();
    file.stat = {} as Stats;
    touch(file, date);

    expect(file.stat).not.toBeUndefined();
    expect(file.stat.atime).toStrictEqual(date);
    expect(file.stat.mtime).toStrictEqual(date);
    expect(file.stat.ctime).toStrictEqual(date);
    expect(file.stat.birthtime).toStrictEqual(date);
  });
});
