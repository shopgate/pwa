import React from 'react';
import { shallow } from 'enzyme';
import Empty from './index';

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => obj => obj);

describe('<CartEmpty />', () => {
  it('should render', () => {
    const wrapper = shallow(<Empty goBackHistory={() => {}} />);

    expect(wrapper).toMatchSnapshot();
  });
});
