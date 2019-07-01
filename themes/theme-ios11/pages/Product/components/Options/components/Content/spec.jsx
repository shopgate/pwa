import React from 'react';
import { mount, shallow } from 'enzyme';
import Picker from 'Components/Picker';
import Options from './index';

jest.mock('../../../../context', () => ({
  ProductContext: {
    Consumer: jest.fn(({ children }) => children({
      setOption: jest.fn(),
      currency: 'EUR',
    })),
  },
}));

jest.mock('Components/View/context', () => ({
  ViewContext: {
    Consumer: ({ children }) => children({ setAriaHidden: () => { } }),
  },
}));

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => (obj) => {
  const newObj = obj;

  const mockOptions = [{
    id: 'test-id',
    type: 'select',
    label: 'label',
    items: [
      {
        currency: 'USD',
        price: 10,
        priceDifference: 0,
      },
      {
        currency: 'USD',
        price: 10,
        priceDifference: 0,
      },
    ],
  }];

  newObj.defaultProps = {
    options: mockOptions,
    currentOptions: {},
  };

  return newObj;
});

describe('<Options />', () => {
  const mockOptions = [{
    id: 'test-id',
    type: 'select',
    label: 'label',
    items: [
      {
        currency: 'USD',
        price: 10,
        priceDifference: 0,
      },
      {
        currency: 'USD',
        price: 10,
        priceDifference: 0,
      },
    ],
  }];

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      const wrapper = shallow(<Options currentOptions={{}} />).dive();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correct number of options', () => {
      const wrapper = mount(<Options options={mockOptions} />);
      const picker = wrapper.find(Picker);
      expect(picker.length).toBe(mockOptions.length);
    });
  });
});
