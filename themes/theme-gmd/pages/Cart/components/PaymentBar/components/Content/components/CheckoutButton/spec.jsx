import React from 'react';
import { shallow } from 'enzyme';
import Link from '@shopgate/pwa-common/components/Link';
import CheckoutButton from './index';

// Mock the history connector
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

  newObj.defaultProps = {
    ...newObj.defaultProps,
    isActive: false,
  };

  return newObj;
});

describe('<CheckoutButton />', () => {
  jest.useFakeTimers();

  let wrapper;
  let childLink;

  describe('Checkout is possible', () => {
    beforeEach(() => {
      wrapper = shallow(<CheckoutButton />);
      childLink = wrapper.find(Link);
    });

    it('should render without any props', () => {
      expect(wrapper).toMatchSnapshot();
      expect(childLink.props().disabled).toBe(true);
    });
  });
});
