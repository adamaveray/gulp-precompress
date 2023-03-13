/* eslint @typescript-eslint/ban-types: "off", @typescript-eslint/no-unused-vars: "off" -- Augmenting library - must preserve exact signature */
/* eslint no-duplicate-imports: "off", @typescript-eslint/no-duplicate-imports: "off" -- Required for use within multiple declare blocks */
/* eslint no-shadow: "off" -- Required to augment Jest's specific structure */

declare global {
  import type Vinyl from 'vinyl';

  namespace jest {
    interface Matchers<R, T = {}> {
      toMatchVinylFiles: (expected: Vinyl[]) => R;
    }
  }
}

declare namespace jest {
  import type Vinyl from 'vinyl';

  interface Matchers<R, T = {}> {
    toMatchVinylFiles: (expected: Vinyl[]) => R;
  }
}
