import React from 'react';
import { mount } from 'enzyme';
import Select from './index';

const inputProps = {
  name: 'test-name',
};

describe('<Select />', () => {
  // Simple tests for snapshots
  const tests = {
    'should render select with no options': { },
    'should render select with 2 options': { options: { DE: 'Germany', US: 'United states' } },
    'should render select with 1 selected option': { options: { DE: 'Germany', US: 'United states' }, value: 'DE' },
  };

  Object.keys(tests).forEach((test) => {
    it(test, () => {
      const testFixtures = tests[test];
      const wrapper = mount(<Select {...{ ...inputProps, ...testFixtures }} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
