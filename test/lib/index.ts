import type { Stream } from 'node:stream';
import Vinyl from 'vinyl';

export function makeFile(path: string, contents: Buffer | NodeJS.ReadableStream | null = null): Vinyl {
  const file = new Vinyl();
  file.path = path;
  file.contents = contents;
  return file;
}

export async function collateStream<T>(stream: Stream): Promise<T[]> {
  const entries: T[] = [];
  return new Promise((resolve, reject) => {
    stream
      .on('data', (item: T) => {
        entries.push(item);
      })
      .on('end', () => {
        resolve(entries);
      })
      .on('error', reject);
  });
}
