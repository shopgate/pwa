import React from 'react';
import { shallow } from 'enzyme';
import Tier from './index';

jest.mock('@shopgate/engage/core/helpers/i18n', () => ({
  i18n: {
    text: input => input,
  },
}));

describe('<Tier />', () => {
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

      const tier = {
        from: 3,
        to: 5,
        unitPrice: 77.5,
      };

      const wrapper = shallow(<Tier price={price} tier={tier} />).dive();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Rendering without data', () => {
    it('should render nothing when tier from is less then 1', () => {
      const tier = { from: 1 };
      const wrapper = shallow(<Tier tier={tier} price={{}} />).dive();
      expect(wrapper).toBeEmptyRender();
    });
  });
});

