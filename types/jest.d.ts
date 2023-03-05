/* eslint-disable @typescript-eslint/ban-types,@typescript-eslint/no-unused-vars -- Augmenting library - must preserve exact signature */

declare global {
  import type Vinyl from 'vinyl';

  namespace jest {
    interface Matchers<R, T = {}> {
      toMatchVinylFiles(expected: Vinyl[]): R;
    }
  }
}

declare namespace jest {
  import type Vinyl from 'vinyl';

  interface Matchers<R, T = {}> {
    toMatchVinylFiles(expected: Vinyl[]): R;
  }
}
