import Vinyl from 'vinyl';

export {};

interface Entry {
  path: string;
  contents: string;
}

function getFileEntries(files: Vinyl[]): Entry[] {
  return files.map(({ path, contents }) => {
    return { path, contents: String(contents) };
  });
}

function entrySorter(a: Entry, b: Entry): number {
  return a.path.localeCompare(b.path);
}

expect.extend({
  toMatchVinylFiles(received: any, expected: any): jest.CustomMatcherResult {
    if (!Array.isArray(received)) {
      return { pass: false, message: () => 'Value expected to be array.' };
    }

    const nonVinylEntry = received.find((item) => !(item instanceof Vinyl));
    if (nonVinylEntry != null) {
      return { pass: false, message: () => 'All values expected to be Vinyl files.' };
    }

    const receivedEntries = getFileEntries(received).sort(entrySorter);
    const expectedEntries = getFileEntries(expected).sort(entrySorter);
    if (this.isNot) {
      expect(receivedEntries).not.toEqual(expectedEntries);
    } else {
      expect(receivedEntries).toEqual(expectedEntries);
    }

    return { pass: !this.isNot, message: () => 'All value paths expected to match.' };
  },
});
