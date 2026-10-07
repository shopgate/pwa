const createTypeCheckParser = require('./createTypeCheckParser');

/**
 * Feeds lines to a new parser and returns the events it emits.
 * @param {string[]} lines The compiler output.
 * @return {Object[]}
 */
const parseLines = (lines) => {
  const parse = createTypeCheckParser();

  return lines.map(line => parse(line)).filter(Boolean);
};

describe('createTypeCheckParser', () => {
  it('reports the start and the errors of a check', () => {
    expect(parseLines([
      '2:36:55 PM - Starting compilation in watch mode...',
      '',
      "portals/Banner/index.tsx(33,68): error TS2322: Type 'false' is not assignable to type 'true'.",
      'error TS6053: File not found.',
      '',
      '2:36:58 PM - Found 2 errors. Watching for file changes.',
    ])).toEqual([
      { type: 'started' },
      {
        type: 'finished',
        errors: [
          {
            file: 'portals/Banner/index.tsx',
            line: 33,
            column: 68,
            code: 'TS2322',
            message: "Type 'false' is not assignable to type 'true'.",
          },
          {
            file: null,
            line: null,
            column: null,
            code: 'TS6053',
            message: 'File not found.',
          },
        ],
      },
    ]);
  });

  it('adds indented lines to the message of the error before', () => {
    const [, finished] = parseLines([
      '02:36:48 PM - Starting compilation in watch mode...',
      "a.ts(1,14): error TS2345: Argument of type 'A' is not assignable to parameter of type 'B'.",
      "  Property 'id' is missing in type 'A'.",
      '02:36:49 PM - Found 1 error. Watching for file changes.',
    ]);

    expect(finished.errors).toHaveLength(1);
    expect(finished.errors[0].message).toBe([
      "Argument of type 'A' is not assignable to parameter of type 'B'.",
      "  Property 'id' is missing in type 'A'.",
    ].join('\n'));
  });

  it('forgets the errors of the check before when a new one starts', () => {
    const events = parseLines([
      '2:36:55 PM - Starting compilation in watch mode...',
      "a.ts(1,14): error TS2322: Type 'string' is not assignable to type 'number'.",
      '2:36:58 PM - Found 1 error. Watching for file changes.',
      '2:37:10 PM - File change detected. Starting incremental compilation...',
      '2:37:11 PM - Found 0 errors. Watching for file changes.',
    ]);

    expect(events[3]).toEqual({
      type: 'finished',
      errors: [],
    });
  });
});
