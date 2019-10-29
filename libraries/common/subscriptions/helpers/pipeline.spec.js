import { transformGeneralPipelineError } from './pipeline';

describe('transformGeneralPipelineError', () => {
  const general = [
    'An internal error occured.',
    '502 Bad Gateway',
    'error from bigApi 504',
    'BigApi request timeout',
    'error in bigApi response',
  ];

  const others = [
    'Some other pipeline error',
    'Login was unsuccessful',
  ];

  general.forEach((message) => {
    it(`should return general for ${message}`, () => {
      expect(transformGeneralPipelineError({ message })).toBe('error.general');
    });
  });

  others.forEach((message) => {
    it(`should return original ${message}`, () => {
      expect(transformGeneralPipelineError({ message })).toBe(message);
    });
  });
});
