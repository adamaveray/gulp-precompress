import Vinyl from 'vinyl';

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
  toMatchVinylFiles(received: unknown, expected: Vinyl[]): jest.CustomMatcherResult {
    const { isNot = false } = this;

    if (!Array.isArray(received)) {
      return { pass: false, message: () => 'Value expected to be array.' };
    }

    const nonVinylEntry: unknown = received.find((item) => !(item instanceof Vinyl));
    if (nonVinylEntry != null) {
      return { pass: false, message: () => 'All values expected to be Vinyl files.' };
    }

    const receivedEntries = getFileEntries(received as Vinyl[]).sort(entrySorter);
    const expectedEntries = getFileEntries(expected).sort(entrySorter);
    if (isNot) {
      expect(receivedEntries).not.toEqual(expectedEntries);
    } else {
      expect(receivedEntries).toEqual(expectedEntries);
    }

    return { pass: !isNot, message: () => 'All value paths expected to match.' };
  },
});
