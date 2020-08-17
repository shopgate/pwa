import React from 'react';
import { shallow } from 'enzyme';
import Cart from './index';

jest.mock('@shopgate/engage/components', () => ({
  View: ({ children }) => children,
}));

jest.mock('./components/Content', () => function Content() { return null; });

describe('<Cart> page', () => {
  it('should match snapshot', () => {
    const component = shallow(<Cart />);
    expect(component).toMatchSnapshot();
  });
});
