import React from 'react';
import { shallow } from 'enzyme';
import SelectContextChoices from './index';

jest.mock('@shopgate/engage/a11y/components');
jest.mock('@shopgate/engage/components');

describe('<SelectContextChoices />', () => {
  // Simple tests for snapshots
  const tests = {
    'should render select with no options': { },
    // eslint-disable-next-line extra-rules/no-single-line-objects
    'should render select with 2 options': { options: { DE: 'Germany', US: 'United states' } },
    // eslint-disable-next-line extra-rules/no-single-line-objects
    'should render select with 1 selected option': { options: { DE: 'Germany', US: 'United states' }, value: ['DE'] },
  };

  Object.keys(tests).forEach((test) => {
    it(test, () => {
      const testFixtures = tests[test];
      const wrapper = shallow(<SelectContextChoices {...{ ...testFixtures }} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
