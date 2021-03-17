import React from 'react';
import { shallow } from 'enzyme';
import InfoField from './index';

describe('<InfoField>', () => {
  it('should render info field', () => {
    const wrapper = shallow((
      <InfoField>
        {'Some info text'}
      </InfoField>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
