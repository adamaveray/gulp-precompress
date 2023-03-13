import type Vinyl from 'vinyl';

import { Formats, type ConfiguredFormats, type UnconfiguredFormats, type FormatOptions } from './types';

const allFormats: Formats[] = Object.values(Formats);

type FormatEntry = [format: Formats, options: FormatOptions[Formats]];
export function normaliseFormatEntries(
  formats: Partial<UnconfiguredFormats>,
  defaults: ConfiguredFormats,
): FormatEntry[] {
  const possibleEntries: (FormatEntry | undefined)[] = allFormats.map((format) => {
    const formatOptions = formats[format];
    return formatOptions === false || formatOptions == null
      ? undefined
      : [format, formatOptions === true ? defaults[format] : formatOptions];
  });

  return possibleEntries.filter((entry) => entry != null) as FormatEntry[];
}

export function touch(file: Vinyl, date: Date): void {
  if (file.stat == null) {
    return;
  }
  file.stat.birthtime = date;
  file.stat.atime = date;
  file.stat.ctime = date;
  file.stat.mtime = date;
}
