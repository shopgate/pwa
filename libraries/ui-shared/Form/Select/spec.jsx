import React from 'react';
import { render } from '@testing-library/react';
import Select from './index';

const inputProps = {
  name: 'test-name',
};

describe('<Select />', () => {
  // Simple tests for snapshots
  const tests = {
    'should render select with no options': {},
    // eslint-disable-next-line extra-rules/no-single-line-objects
    'should render select with 2 options': { options: { DE: 'Germany', US: 'United states' } },
    // eslint-disable-next-line extra-rules/no-single-line-objects
    'should render select with 1 selected option': { options: { DE: 'Germany', US: 'United states' }, value: 'DE' },
  };

  Object.keys(tests).forEach((test) => {
    it(test, () => {
      const testFixtures = tests[test];
      // eslint-disable-next-line extra-rules/no-single-line-objects
      const wrapper = render(<Select {...{ ...inputProps, ...testFixtures }} />);
      expect(wrapper.asFragment()).toMatchSnapshot();
    });
  });
});
