import { render } from '@testing-library/react';
import { PickerUtilize as Picker } from '@shopgate/engage/components';
import Options from './index';

jest.mock('@shopgate/engage/components', () => ({
  PickerUtilize: jest.fn(() => 'PickerUtilize'),
  I18n: {
    Text: () => null,
  },
}));
jest.mock('@shopgate/engage/product/components', () => ({
  PriceDifference: () => null,
}));

jest.mock('@shopgate/engage/product/contexts', () => {
  const ReactCopy = jest.requireActual('react');
  return {
    ProductContext: ReactCopy.createContext({
      setOption: jest.fn(),
      currency: 'EUR',
    }),
  };
});

// Mock the redux connect() method instead of providing a fake store.
jest.mock('./connector', () => (Component) => {
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

  return props => <Component options={mockOptions} currentOptions={{}} {...props} />;
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should render a picker for the select option', () => {
      const { container } = render(<Options currentOptions={{}} />);

      const options = container.querySelector('[data-test-id="optionsPicker"]');

      expect(options).toHaveClass('engage__product__options');
      expect(options.querySelector('[data-test-id="label"]')).toHaveTextContent('PickerUtilize');
      expect(Picker.mock.lastCall[0]).toEqual(expect.objectContaining({
        label: 'label',
        value: null,
        items: mockOptions[0].items.map(item => expect.objectContaining(item)),
        onChange: expect.any(Function),
      }));
    });
  });
});
