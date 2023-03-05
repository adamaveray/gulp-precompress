import type { BrotliOptions, ZlibOptions } from 'node:zlib';

export enum Formats {
  BROTLI = 'brotli',
  GZIP = 'gzip',
}

export interface FormatOptions extends Record<Formats, any> {
  [Formats.BROTLI]: BrotliOptions;
  [Formats.GZIP]: ZlibOptions;
}

export interface Compressor<TOpts> {
  stream(stream: NodeJS.ReadableStream, options?: TOpts): NodeJS.ReadableStream;
  buffer(buffer: Buffer, options?: TOpts): Buffer;
}

export type UnconfiguredFormats = {
  [key in Formats]: FormatOptions[key] | boolean;
};
export type ConfiguredFormats = {
  [key in Formats]: FormatOptions[key];
};

export interface Options {
  /** Which compression formats to generate, and optional format-specific configuration */
  formats: Partial<UnconfiguredFormats>;
  /** Whether to omit outputting compressed files that are larger than the source file */
  skipLarger: boolean;
}
