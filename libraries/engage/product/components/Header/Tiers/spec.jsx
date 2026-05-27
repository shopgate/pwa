import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import Tiers from './index';

jest.mock('./connector', () => cmp => cmp);

describe('<Tiers />', () => {
  describe('Rendering with data', () => {
    it('should render tier prices when tier prices are available', () => {
      const price = {
        tiers: [
          {
            from: 1,
            to: 2,
            unitPrice: 92.5,
          },
          {
            from: 3,
            to: 5,
            unitPrice: 77.5,
          },
          {
            from: 6,
            to: null,
            unitPrice: 68.5,
          },
        ],
        currency: 'USD',
      };

      const wrapper = render(<Tiers price={price} />);

      expect(wrapper.asFragment()).toMatchSnapshot();
    });
  });

  describe('Rendering without data', () => {
    it('should render nothing when price data are not available ({})', () => {
      const wrapper = render(<Tiers price={{}} />);
      expect(wrapper).toBeEmptyRender();
    });

    it('should render nothing when price data are not available (null)', () => {
      const wrapper = render(<Tiers price={null} />);
      expect(wrapper).toBeEmptyRender();
    });

    it('should render nothing when tier prices are empty ([])', () => {
      const price = {
        tiers: [],
        currency: 'USD',
      };

      const wrapper = render(<Tiers price={price} />);
      expect(wrapper).toBeEmptyRender();
    });

    it('should render nothing when tier prices are not available (field missing)', () => {
      const price = { currency: 'USD' };
      const wrapper = render(<Tiers price={price} />);
      expect(wrapper).toBeEmptyRender();
    });
  });
});

