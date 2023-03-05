import { normaliseFormatEntries } from '../src/utils';
import defaults from '../src/defaults';
import { Formats } from '../src';

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
